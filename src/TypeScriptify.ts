import {
	esmify,
} from './AjvUtilities.ts';
import type {
	EmptyStatement,
	FunctionDeclaration,
	ImportDeclaration,
	Node,
	SourceFile,
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
	isObjectLiteralExpression,
	isPropertyAccessExpression,
	isVariableDeclaration,
	ScriptTarget,
	SyntaxKind,
	transform,
	visitEachChild,
	visitNode,
} from 'typescript';

export type Config = {
	[key: string]: [string, string],
};

export default class TypeScriptify {
	#validate_function_name = /^validate\d+$/;

	ify(code: string, config: Config): string {
		code = esmify(code);
		const source = createSourceFile(
			'ify.js',
			code,
			ScriptTarget.ESNext,
			true,
		);

		const specify_types: {
			[key: string]: Config[string][0],
		} = {};

		let result = transform(source, [
			(context) => this.#first_pass(
				context,
				config,
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
		config: Config,
		node: EmptyStatement,
	): Config[string] | undefined {
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
		return factory.createTypeReferenceNode(
			'Exclude',
			[
				factory.createIndexedAccessTypeNode(
					factory.createTypeReferenceNode(
						'Parameters',
						[
							factory.createTypeReferenceNode(
								'SchemaValidateFunction',
							),
						],
					),
					factory.createLiteralTypeNode(
						factory.createNumericLiteral(3),
					),
				),
				factory.createKeywordTypeNode(SyntaxKind.UndefinedKeyword),
			],
		);
	}

	#modify_validate(
		node: FunctionDeclaration,
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
			factory.createIndexedAccessTypeNode(
				this.#shim_DataValidationCxt(),
				factory.createLiteralTypeNode(
					factory.createStringLiteral('rootData'),
				),
			),
			data.initializer,
		);

		const new_options = factory.updateParameterDeclaration(
			options,
			options.modifiers,
			options.dotDotDotToken,
			options.name,
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

	#first_pass(
		context: TransformationContext,
		config: Config,
		specify_types: {
			[key: string]: Config[string][0],
		},
	) {
		const prepend_with_imports: {
			[key: string]: Set<string>,
			ajv: Set<string>,
		} = {
			ajv: new Set<string>(),
		};

		const visitor: Visitor = (node: Node) => {
			if (
				isEmptyStatement(node)
				&& isFunctionDeclaration(node.parent.parent)
				&& this.#validate_function_name.test(
					node.parent.parent.name?.getText() || '',
				)
			) {
				const maybe = this.#configEntry(config, node);

				if (maybe) {
					specify_types[
						node.parent.parent.name?.getText() || ''
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
				&& this.#validate_function_name.test(
					node.name?.getText() || '',
				)
				&& 2 === node.parameters.length
			) {
				prepend_with_imports.ajv.add('SchemaValidateFunction');

				return visitEachChild(
					this.#modify_validate(node),
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

			if (imports.length > 0) {
				return factory.updateSourceFile(
					source,
					[
						...imports,
						...result.statements,
					],
				);
			}

			return result;
		};

		return transformer;
	}

	#second_pass(
		context: TransformationContext,
		specify_types: Readonly<{
			[key: string]: Config[string][0],
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
								'ValidateFunction',
								[
									factory.createTypeReferenceNode(
										specify_types[function_name],
									),
								],
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
