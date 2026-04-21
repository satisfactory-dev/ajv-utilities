import type {
	BindingPattern,
	FunctionDeclaration,
	Identifier,
	ParameterDeclaration,
} from 'typescript';
import {
	factory,
	isFunctionDeclaration,
	isIdentifier,
	isObjectBindingPattern,
	SyntaxKind,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

import type {
	Config,
} from '../types.ts';

import type {
	prepend_with_imports,
} from '../TypeReferences.ts';

import KnownImports from '../known_imports.ts';

type ValidateFunctionDeclaration = (
	& FunctionDeclaration
	& {
		name: (
			& Identifier
			& {
				getText(): `validate${number}`,
			}
		),
		parameters: [
			ParameterDeclaration,
			ParameterDeclaration,
		],
	}
);

export default class ModifyValidate extends ConditionalModification<
	ValidateFunctionDeclaration
> {
	#prepend_with_imports: prepend_with_imports;

	constructor(prepend_with_imports: prepend_with_imports) {
		super(
			(node): node is ValidateFunctionDeclaration => (
				isFunctionDeclaration(node)
				&& !!node.name
				&& this.validate_function_name.test(
					node.name.getText(),
				)
				&& 2 === node.parameters.length
			),
			(node, config) => this.#modify_validate(node, config),
		);

		this.#prepend_with_imports = prepend_with_imports;
	}

	#shim_DataValidationCxt() {
		KnownImports.ValidateFunction(this.#prepend_with_imports);

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
		config?: Partial<Config>,
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
			config
			&& config.remove_dataCtxKeys
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
}
