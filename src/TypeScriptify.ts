import {
	esmify,
} from './AjvUtilities.ts';

import type {
	ImportDeclaration,
	Node,
	SourceFile,
	Statement,
	TransformationContext,
	Visitor,
} from 'typescript';
import {
	createPrinter,
	createSourceFile,
	factory,
	ScriptTarget,
	SyntaxKind,
	transform,
	visitEachChild,
	visitNode,
} from 'typescript';

import {
	ConditionalModification,
	ConditionalPreprocessor,
} from './TypeScriptify/abstracts.ts';

import type {
	Config,
	prepend_with_imports,
} from './TypeScriptify/types.ts';

import SpecifyTypes from './TypeScriptify/preprocessors/SpecifyTypes.ts';

// oxlint-disable-next-line @stylistic/max-len
import RemoveSchemaDeclaration from './TypeScriptify/modifiers/RemoveSchemaDeclaration.ts';

import ModifyValidate from './TypeScriptify/modifiers/ModifyValidate.ts';

import ModifyVErrors from './TypeScriptify/modifiers/ModifyVErrors.ts';

// oxlint-disable-next-line @stylistic/max-len
import TypecastEvalulated from './TypeScriptify/modifiers/TypecastEvalulated.ts';

import TypecastSetErrors from './TypeScriptify/modifiers/TypecastSetErrors.ts';

// oxlint-disable-next-line @stylistic/max-len
import AddErrorObjectType from './TypeScriptify/modifiers/AddErrorObjectType.ts';

// oxlint-disable-next-line @stylistic/max-len
import TypecastVErrorsPush from './TypeScriptify/modifiers/TypecastVErrorsPush.ts';

// oxlint-disable-next-line @stylistic/max-len
import QuestionableCondition from './TypeScriptify/modifiers/QuestionableCondition.ts';

// oxlint-disable-next-line @stylistic/max-len
import Ucs2LengthCorrection from './TypeScriptify/modifiers/Ucs2LengthCorrection.ts';

import PatchIsObject from './TypeScriptify/patchers/PatchIsObject.ts';

import PatchIsArray from './TypeScriptify/patchers/PatchIsArray.ts';

// oxlint-disable-next-line @stylistic/max-len
import SpecifyTypePredicate from './TypeScriptify/modifiers/SpecifyTypePredicate.ts';

export default class TypeScriptify {
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
				config || {},
				Object.freeze(specify_types),
			),
		]);

		code = createPrinter().printFile(result.transformed[0]);

		return code.replace('"use strict";\n', '');
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

	#sanity_check_preprocess(
		maybe: unknown[],
	): asserts maybe is ConditionalPreprocessor<Node>[] {
		if(!maybe.every((
			value,
		) => value instanceof ConditionalPreprocessor)) {
			throw new TypeError(`Array should consist entirely of ${
				ConditionalPreprocessor.name
			} instances`);
		}
	}

	#sanity_check_modifiers(
		maybe: unknown[],
	): asserts maybe is ConditionalModification<Node>[] {
		if(!maybe.every((
			value,
		) => value instanceof ConditionalModification)) {
			throw new TypeError(`Array should consist entirely of ${
				ConditionalModification.name
			} instances`);
		}
	}

	#generate_visitor(
		context: TransformationContext,
		config: Partial<Config> | undefined,
		preprocess: unknown[],
		modifiers: unknown[],
	) {
		this.#sanity_check_preprocess(preprocess);
		this.#sanity_check_modifiers(modifiers);

		const visitor: Visitor = (node: Node) => {
			for (const non_modifier of preprocess) {
				if (non_modifier.passes(node, config)) {
					non_modifier.visit(node, config);
				}
			}

			for (const maybe of modifiers) {
				if (maybe.passes(node, config)) {
					const action = maybe.visit(node, config);

					if (false === action) {
						continue;
					} else if (undefined === action) {
						return undefined;
					}

					return visitEachChild(
						action,
						visitor,
						context,
					);
				}
			}

			return visitEachChild(node, visitor, context);
		};

		return visitor;
	}

	#first_pass(
		context: TransformationContext,
		config: Partial<Config>,
		specify_types: {
			[key: string]: Config['specify_types'][string][0],
		},
	) {
		const prepend_with_imports: prepend_with_imports = {
			ajv: new Set<string>(),
		};

		let patch_with_is_array = false;
		let patch_with_is_object = false;

		const visitor = this.#generate_visitor(
			context,
			config,
			[
				new SpecifyTypes(prepend_with_imports, specify_types),
			],
			[
				new RemoveSchemaDeclaration(),
				new ModifyValidate(prepend_with_imports),
				new ModifyVErrors(prepend_with_imports),
				new TypecastEvalulated(prepend_with_imports),
				new TypecastSetErrors(prepend_with_imports),
				new AddErrorObjectType(prepend_with_imports),
				new TypecastVErrorsPush(prepend_with_imports),
				new QuestionableCondition(),
				new Ucs2LengthCorrection(),
				new PatchIsObject(() => {
					patch_with_is_object = true;
				}),
				new PatchIsArray(() => {
					patch_with_is_array = true;
				}),
			],
		);

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
		config: Partial<Config>,
		specify_types: Readonly<{
			[key: string]: Config['specify_types'][string][0],
		}>,
	) {
		if (Object.keys(specify_types).length < 1) {
			return (source: SourceFile) => source;
		}

		const visitor = this.#generate_visitor(
			context,
			config,
			[],
			[
				new SpecifyTypePredicate(specify_types),
			],
		);

		return (
			source: SourceFile,
		) => visitNode(source, visitor) as SourceFile;
	}
}
