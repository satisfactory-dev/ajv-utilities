import type {
	ValidateFunction,
} from 'ajv';

import {
	esmify,
} from './AjvUtilities.ts';
import type {
	BindingPattern,
	EmptyStatement,
	Expression,
	FunctionDeclaration,
	Identifier,
	ImportDeclaration,
	Node,
	NodeArray,
	SourceFile,
	Statement,
	TransformationContext,
	Visitor,
} from 'typescript';

import {
	createPrinter,
	createSourceFile,
	factory,
	isBinaryExpression,
	isCallExpression,
	isEmptyStatement,
	isFunctionDeclaration,
	isIdentifier,
	isIfStatement,
	isObjectBindingPattern,
	isObjectLiteralExpression,
	isPrefixUnaryExpression,
	isPropertyAccessExpression,
	isStringLiteral,
	isTypeOfExpression,
	isVariableDeclaration,
	isVariableStatement,
	ScriptTarget,
	SyntaxKind,
	transform,
	visitEachChild,
	visitNode,
} from 'typescript';

export type Config = {
	remove_schema: boolean,
	remove_dataCtxKeys: [
		keyof Exclude<Parameters<ValidateFunction>[1], undefined>,
		...(keyof Exclude<
			Parameters<ValidateFunction>[1],
			undefined
		>)[],
	],
	specify_types: {
		[key: string]: [string, string],
	},
};

export default class TypeScriptify {
	#validate_function_name = /^validate\d+$/;

	ify(code: string, config?: Partial<Config>): string {
		code = esmify(code);
		const source = createSourceFile(
			'ify.js',
			code,
			ScriptTarget.ESNext,
			true,
		);

		const specify_types: {
			[key: string]: Config['specify_types'][string][0],
		} = {};

		let result = transform(source, [
			(context) => this.#first_pass(
				context,
				config || {},
				specify_types,
			),
		]);

		result = transform(result.transformed[0], [
			(context) => this.#second_pass(
				context,
				Object.freeze(specify_types),
			),
		]);

		code = createPrinter().printFile(result.transformed[0]);

		return code.replace('"use strict";\n', '');
	}

	#configEntry(
		config: Config['specify_types'],
		node: EmptyStatement,
	): Config['specify_types'][string] | undefined {
		const keys = Object.keys(config);

		if (0 === keys.length) {
			return;
		}

		const code = node.getFullText();

		const has_match = new RegExp(
			`\\/\\*# sourceURL="(${
				keys.map((key) => RegExp.escape(key)).join('|')
			})" \\*\\/`,
		);

		const maybe = has_match.exec(code);

		if (maybe && maybe[1] in config) {
			return config[maybe[1]];
		}
	}

	#shim_DataValidationCxt() {
		return factory.createIntersectionTypeNode([
			factory.createIndexedAccessTypeNode(
				factory.createTypeReferenceNode(
					'Parameters',
					[
						factory.createTypeReferenceNode(
							'ValidateFunction',
						),
					],
				),
				factory.createLiteralTypeNode(
					factory.createNumericLiteral(1),
				),
			),
			factory.createTypeLiteralNode([
				factory.createPropertySignature(
					undefined,
					'rootData',
					undefined,
					factory.createKeywordTypeNode(
						SyntaxKind.UnknownKeyword,
					),
				),
			]),
		]);
	}

	#modify_validate(
		node: FunctionDeclaration,
		config: Partial<Config>,
	) {
		const [
			data,
			options,
		] = node.parameters;

		const new_data = factory.updateParameterDeclaration(
			data,
			data.modifiers,
			data.dotDotDotToken,
			data.name,
			data.questionToken,
			factory.createKeywordTypeNode(SyntaxKind.UnknownKeyword),
			data.initializer,
		);

		let options_name: (
			| BindingPattern
			| Identifier
		) = options.name;

		if (
			config.remove_dataCtxKeys
			&& options_name
			&& isObjectBindingPattern(options_name)
			&& options_name.elements.length > 0
		) {
			const elements = options_name.elements.filter((
				maybe,
			) => {
				return (
					isIdentifier(maybe.name)
					&& !(
						config.remove_dataCtxKeys as string[]
					).includes(maybe.name.getText())
				);
			});

			options_name = factory.updateObjectBindingPattern(
				options_name,
				elements,
			);
		}

		const new_options = factory.updateParameterDeclaration(
			options,
			options.modifiers,
			options.dotDotDotToken,
			options_name,
			options.questionToken,
			factory.createTypeReferenceNode('Partial', [
				this.#shim_DataValidationCxt(),
			]),
			options.initializer,
		);

		return factory.updateFunctionDeclaration(
			node,
			node.modifiers,
			node.asteriskToken,
			node.name,
			node.typeParameters,
			[
				new_data,
				new_options,
			],
			node.type,
			node.body,
		);
	}

	#replace_is_array(
		args?: Expression[]|NodeArray<Expression>,
	) {
		return factory.createCallExpression(
			factory.createIdentifier('ajv_utilities__is_probably_array'),
			undefined,
			args,
		);
	}

	#replace_is_object(
		name: Expression,
		then: Statement,
		else_statement?: Statement,
	) {
		return factory.createIfStatement(
			factory.createCallExpression(
				factory.createIdentifier('ajv_utilities__is_probably_object'),
				undefined,
				[name],
			),
			then,
			else_statement,
		);
	}

	#patch_is_array() {
		return factory.createFunctionDeclaration(
			undefined,
			undefined,
			'ajv_utilities__is_probably_array',
			undefined,
			[
				factory.createParameterDeclaration(
					undefined,
					undefined,
					'maybe',
					undefined,
					factory.createKeywordTypeNode(SyntaxKind.UnknownKeyword),
				),
			],
			factory.createTypePredicateNode(
				undefined,
				'maybe',
				factory.createArrayTypeNode(
					factory.createKeywordTypeNode(
						SyntaxKind.UnknownKeyword,
					),
				),
			),
			factory.createBlock([
				factory.createReturnStatement(
					factory.createCallExpression(
						factory.createPropertyAccessExpression(
							factory.createIdentifier('Array'),
							factory.createIdentifier('isArray'),
						),
						undefined,
						[
							factory.createIdentifier('maybe'),
						],
					),
				),
			]),
		);
	}

	#patch_is_object() {
		return factory.createFunctionDeclaration(
			undefined,
			undefined,
			'ajv_utilities__is_probably_object',
			undefined,
			[
				factory.createParameterDeclaration(
					undefined,
					undefined,
					'maybe',
					undefined,
					factory.createKeywordTypeNode(SyntaxKind.UnknownKeyword),
				),
			],
			factory.createTypePredicateNode(
				undefined,
				'maybe',
				factory.createTypeReferenceNode(
					'Record',
					[
						factory.createKeywordTypeNode(
							SyntaxKind.StringKeyword,
						),
						factory.createKeywordTypeNode(
							SyntaxKind.UnknownKeyword,
						),
					],
				),
			),
			factory.createBlock([
				factory.createReturnStatement(
					factory.createBinaryExpression(
						factory.createBinaryExpression(
							factory.createPrefixUnaryExpression(
								SyntaxKind.ExclamationToken,
								factory.createPrefixUnaryExpression(
									SyntaxKind.ExclamationToken,
									factory.createIdentifier('maybe'),
								),
							),
							factory.createToken(
								SyntaxKind.AmpersandAmpersandToken,
							),
							factory.createBinaryExpression(
								factory.createTypeOfExpression(
									factory.createIdentifier('maybe'),
								),
								factory.createToken(
									SyntaxKind.EqualsEqualsEqualsToken,
								),
								factory.createStringLiteral('object'),
							),
						),
						factory.createToken(
							SyntaxKind.AmpersandAmpersandToken,
						),
						factory.createPrefixUnaryExpression(
							SyntaxKind.ExclamationToken,
							factory.createCallExpression(
								factory.createPropertyAccessExpression(
									factory.createIdentifier('Array'),
									factory.createIdentifier('isArray'),
								),
								undefined,
								[
									factory.createIdentifier('maybe'),
								],
							),
						),
					),
				),
			]),
		);
	}

	#first_pass(
		context: TransformationContext,
		config: Partial<Config>,
		specify_types: {
			[key: string]: Config['specify_types'][string][0],
		},
	) {
		const prepend_with_imports: {
			[key: string]: Set<string>,
			ajv: Set<string>,
		} = {
			ajv: new Set<string>(),
		};

		let patch_with_is_array = false;
		let patch_with_is_object = false;

		const visitor: Visitor = (node: Node) => {
			if (
				config.remove_schema
				&& isVariableStatement(node)
				&& !node.modifiers
				&& node.declarationList.declarations.length > 0
			) {
				const was = node.declarationList.declarations.length;

				const declarartions = node.declarationList.declarations
					.filter((
						maybe,
					) => {
						return (
							!isIdentifier(maybe.name)
							|| !/^schema\d+$/.test(maybe.name.getText())
						);
					});

				if (was !== declarartions.length) {
					if (declarartions.length < 1) {
						return undefined;
					} else {
						return visitEachChild(
							factory.updateVariableStatement(
								node,
								node.modifiers,
								factory.updateVariableDeclarationList(
									node.declarationList,
									declarartions,
								),
							),
							visitor,
							context,
						);
					}
				}
			}

			if (
				config.specify_types
				&& isEmptyStatement(node)
				&& isFunctionDeclaration(node.parent.parent)
				&& node.parent.parent.name
				&& this.#validate_function_name.test(
					node.parent.parent.name.getText(),
				)
			) {
				const maybe = this.#configEntry(config.specify_types, node);

				if (maybe) {
					specify_types[
						node.parent.parent.name.getText()
					] = maybe[0];
					prepend_with_imports.ajv.add('ValidateFunction');

					if (!(maybe[1] in prepend_with_imports)) {
						prepend_with_imports[maybe[1]] = new Set([maybe[0]]);
					} else {
						prepend_with_imports[maybe[1]].add(maybe[0]);
					}
				}
			}

			if (
				isFunctionDeclaration(node)
				&& node.name
				&& this.#validate_function_name.test(
					node.name.getText(),
				)
				&& 2 === node.parameters.length
			) {
				prepend_with_imports.ajv.add('ValidateFunction');

				return visitEachChild(
					this.#modify_validate(node, config),
					visitor,
					context,
				);
			} else if (
				isVariableDeclaration(node)
				&& 'vErrors' === node.name.getText()
				&& node.initializer?.kind === SyntaxKind.NullKeyword
			) {
				prepend_with_imports.ajv.add('ErrorObject');

				return factory.updateVariableDeclaration(
					node,
					node.name,
					node.exclamationToken,
					factory.createUnionTypeNode([
						factory.createArrayTypeNode(
							factory.createTypeReferenceNode('ErrorObject'),
						),
						factory.createLiteralTypeNode(factory.createNull()),
					]),
					node.initializer,
				);
			} else if (
				isBinaryExpression(node)
				&& isPropertyAccessExpression(node.left)
				&& this.#validate_function_name.test(
					node.left.expression.getText(),
				)
				&& 'evaluated' === node.left.name.getText()
				&& isObjectLiteralExpression(node.right)
			) {
				prepend_with_imports.ajv.add('ValidateFunction');

				return factory.updateBinaryExpression(
					node,
					node.left,
					node.operatorToken,
					factory.createAsExpression(
						node.right,
						factory.createIndexedAccessTypeNode(
							factory.createTypeReferenceNode(
								'ValidateFunction',
							),
							factory.createLiteralTypeNode(
								factory.createStringLiteral('evaluated'),
							),
						),
					),
				);
			} else if (
				isBinaryExpression(node)
				&& isPropertyAccessExpression(node.left)
				&& this.#validate_function_name.test(
					node.left.expression.getText(),
				)
				&& 'errors' === node.left.name.getText()
			) {
				prepend_with_imports.ajv.add('ValidateFunction');

				return factory.updateBinaryExpression(
					node,
					factory.updatePropertyAccessExpression(
						node.left,
						factory.createAsExpression(
							node.left.expression,
							factory.createTypeReferenceNode(
								'ValidateFunction',
							),
						),
						node.left.name,
					),
					node.operatorToken,
					node.right,
				);
			} else if (
				isVariableDeclaration(node)
				&& /^err\d+$/.test(node.name.getText())
			) {
				prepend_with_imports.ajv.add('ErrorObject');

				return factory.updateVariableDeclaration(
					node,
					node.name,
					node.exclamationToken,
					factory.createTypeReferenceNode('ErrorObject'),
					node.initializer,
				);
			} else if (
				isCallExpression(node)
				&& isPropertyAccessExpression(node.expression)
				&& 'vErrors' === node.expression.expression.getText()
				&& 'push' === node.expression.name.getText()
			) {
				prepend_with_imports.ajv.add('ErrorObject');

				return factory.updateCallExpression(
					node,
					factory.updatePropertyAccessExpression(
						node.expression,
						factory.createAsExpression(
							node.expression.expression,
							factory.createArrayTypeNode(
								factory.createTypeReferenceNode('ErrorObject'),
							),
						),
						node.expression.name,
					),
					node.typeArguments,
					node.arguments,
				);
			} else if (
				isPropertyAccessExpression(node)
				&& isIfStatement(node.parent)
				&& isIdentifier(node.expression)
				&& /^evaluated\d+$/.test(node.expression.getText())
				&& !node.questionDotToken
			) {
				return factory.createPropertyAccessChain(
					node.expression,
					factory.createToken(SyntaxKind.QuestionDotToken),
					node.name,
				);
			} else if(
				isPropertyAccessExpression(node)
				&& isIdentifier(node.expression)
				&& 'ucs2length' === node.expression.getText()
				&& 'default' === node.name.getText()
			) {
				return factory.createIdentifier('ucs2length');
			} else if (
				isIfStatement(node)
				&& isBinaryExpression(node.expression)
				&& isBinaryExpression(node.expression.left)
				&& isIdentifier(node.expression.left.left)

				// oxlint-disable-next-line @stylistic/max-len
				&& SyntaxKind.AmpersandAmpersandToken === node.expression.left.operatorToken.kind

				&& isBinaryExpression(node.expression.left.right)
				&& isTypeOfExpression(node.expression.left.right.left)
				&& isIdentifier(node.expression.left.right.left.expression)

				// oxlint-disable-next-line @stylistic/max-len
				&& node.expression.left.left.getText() === node.expression.left.right.left.expression.getText()

				// oxlint-disable-next-line @stylistic/max-len
				&& SyntaxKind.EqualsEqualsToken === node.expression.left.right.operatorToken.kind
				&& isStringLiteral(node.expression.left.right.right)
				&& 'object' === node.expression.left.right.right.text

				// oxlint-disable-next-line @stylistic/max-len
				&& SyntaxKind.AmpersandAmpersandToken === node.expression.operatorToken.kind
				&& isPrefixUnaryExpression(node.expression.right)

				// oxlint-disable-next-line @stylistic/max-len
				&& SyntaxKind.ExclamationToken === node.expression.right.operator
				&& isCallExpression(node.expression.right.operand)
				&& isPropertyAccessExpression(
					node.expression.right.operand.expression,
				)
				&& isIdentifier(
					node.expression.right.operand.expression.expression,
				)
				&& isIdentifier(
					node.expression.right.operand.expression.name,
				)
				&& 'Array.isArray' === `${

					// oxlint-disable-next-line @stylistic/max-len
					node.expression.right.operand.expression.expression.getText()
				}.${
					node.expression.right.operand.expression.name.getText()
				}`
				&& 1 === node.expression.right.operand.arguments.length
				&& isIdentifier(
					node.expression.right.operand.arguments[0],
				)
				&& (
					node.expression.left.left.getText(
					) === node.expression.right.operand.arguments[0].getText()
				)
			) {
				patch_with_is_object = true;

				return visitEachChild(
					this.#replace_is_object(
						node.expression.left.left,
						node.thenStatement,
						node.elseStatement,
					),
					visitor,
					context,
				);
			} else if (
				isIfStatement(node)
				&& isCallExpression(node.expression)
				&& isPropertyAccessExpression(node.expression.expression)
				&& isIdentifier(node.expression.expression.expression)
				&& isIdentifier(node.expression.expression.name)
				&& 'Array.isArray' === `${
					node.expression.expression.expression.getText()
				}.${
					node.expression.expression.name.getText()
				}`
			) {
				patch_with_is_array = true;

				return visitEachChild(
					factory.updateIfStatement(
						node,
						this.#replace_is_array(node.expression.arguments),
						node.thenStatement,
						node.elseStatement,
					),
					visitor,
					context,
				);
			}

			return visitEachChild(node, visitor, context);
		};

		const transformer = (
			source: SourceFile,
		) => {
			const result = visitNode(source, visitor) as SourceFile;

			const imports: ImportDeclaration[] = [];

			for (const [from, types] of Object.entries(prepend_with_imports)) {
				if (types.size < 1) {
					continue;
				}

				imports.push(factory.createImportDeclaration(
					undefined,
					factory.createImportClause(
						SyntaxKind.TypeKeyword,
						undefined,
						factory.createNamedImports([
							...types,
						].sort((a, b) => a.localeCompare(b)).map((
							identifier,
						) => factory.createImportSpecifier(
							false,
							undefined,
							factory.createIdentifier(identifier),
						))),
					),
					factory.createStringLiteral(from, true),
				));
			}

			let modified: Statement[] | undefined = undefined;

			if (patch_with_is_array) {
				modified = [
					this.#patch_is_array(),
					...(modified || result.statements),
				];
			}

			if (patch_with_is_object) {
				modified = [
					this.#patch_is_object(),
					...(modified || result.statements),
				];
			}

			if (imports.length > 0) {
				modified = [
					...imports,
					...(modified || result.statements),
				];
			}

			if (modified) {
				return factory.updateSourceFile(
					source,
					modified,
				);
			}

			return result;
		};

		return transformer;
	}

	#second_pass(
		context: TransformationContext,
		specify_types: Readonly<{
			[key: string]: Config['specify_types'][string][0],
		}>,
	) {
		if (Object.keys(specify_types).length < 1) {
			return (source: SourceFile) => source;
		}

		const visitor: Visitor = (node: Node) => {
			if (
				isFunctionDeclaration(node)
				&& node.name
				&& isIdentifier(node.name)
				&& !node.name.text.startsWith('ajv_utilities__')
			) {
				const function_name = node.name.getText();

				if (function_name in specify_types) {
					return factory.updateFunctionDeclaration(
						node,
						node.modifiers,
						node.asteriskToken,
						node.name,
						node.typeParameters,
						node.parameters,
						factory.createTypePredicateNode(
							undefined,
							'data',
							factory.createTypeReferenceNode(
								specify_types[function_name],
							),
						),
						node.body,
					);
				}
			}

			return visitEachChild(node, visitor, context);
		};

		return (
			source: SourceFile,
		) => visitNode(source, visitor) as SourceFile;
	}
}
