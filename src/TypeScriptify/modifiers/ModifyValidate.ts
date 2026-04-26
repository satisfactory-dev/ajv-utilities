import type {
	FunctionDeclaration,
	Identifier,
	ObjectBindingPattern,
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
	remove_dataCtxKeys,
} from '../types.ts';

import type {
	prepend_with_imports,
} from '../TypeReferences.ts';

import KnownImports from '../known_imports.ts';

type options = (
	ParameterDeclaration
	& {
		name: ObjectBindingPattern,
	}
);

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
			options,
		],
	}
);

abstract class ModifyValidate extends ConditionalModification<
	ValidateFunctionDeclaration
> {
	protected maybe_modify_name(
		options_name: ValidateFunctionDeclaration['parameters'][1]['name'],
		config?: remove_dataCtxKeys,
	) {
		if (
			Array.isArray(config)
			&& 'string' !== typeof options_name
			&& options_name.elements.length > 0
		) {
			const elements = options_name.elements.filter((
				maybe,
			) => {
				return (
					isIdentifier(maybe.name)
					&& !(
						config as string[]
					).includes(maybe.name.getText())
				);
			});

			return factory.updateObjectBindingPattern(
				options_name,
				elements,
			);
		}

		return 'string' === typeof options_name
			? factory.createIdentifier(options_name)
			: options_name;
	}
}


export class ModifyValidateOptions extends ModifyValidate {
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
				&& isObjectBindingPattern(node.parameters[1].name)
			),
			(node, config) => this.#modify_validate(node, config),
		);

		this.#prepend_with_imports = prepend_with_imports;
	}

	#shim_DataValidationCxt() {
		KnownImports.ValidateFunction(this.#prepend_with_imports);

		return factory.createIntersectionTypeNode([
			factory.createTypeReferenceNode(
				'Omit',
				[
					factory.createTypeReferenceNode(
						'Exclude',
						[
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
							factory.createToken(SyntaxKind.UndefinedKeyword),
						],
					),
					factory.createLiteralTypeNode(
						factory.createStringLiteral('rootData'),
					),
				],
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
		node: ValidateFunctionDeclaration,
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

		const options_name = this.maybe_modify_name(
			options.name,
			(config && Array.isArray(config.remove_dataCtxKeys))
				? config.remove_dataCtxKeys
				: undefined,
		);

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
