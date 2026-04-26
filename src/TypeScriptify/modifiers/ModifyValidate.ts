import type {
	EmptyStatement,
	FunctionDeclaration,
	Identifier,
	ObjectBindingPattern,
	ParameterDeclaration,
} from 'typescript';
import {
	factory,
	isEmptyStatement,
	isFunctionDeclaration,
	isIdentifier,
	isObjectBindingPattern,
	SyntaxKind,
} from 'typescript';

import {
	ConditionalModification,
	ConditionalPreprocessor,
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

type config = (
	& Omit<Partial<Config>, 'remove_dataCtxKeys'>
	& Pick<Config, 'remove_dataCtxKeys'>
);

type SpecifyModifyCandidate = (
	& EmptyStatement
	& {
		parent: (
			& Node
			& {
				parent: (
					& FunctionDeclaration
					& {
						name: (
							& Identifier
							& {
								text: `validate${number}`,
							}
						),
					}
				),
			}
		),
	}
);

export type specify_modify_options_name_config = {
	[key: string]: remove_dataCtxKeys,
};

export class SpecifyModifyCandidates extends ConditionalPreprocessor<
	SpecifyModifyCandidate,
	config
> {
	#configEntry(
		config: config['remove_dataCtxKeys'],
		node: EmptyStatement,
	): remove_dataCtxKeys | undefined {
		if (Array.isArray(config)) {
			return;
		}

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

	constructor(
		specify_config: specify_modify_options_name_config,
	) {
		super(
			(node, config): node is SpecifyModifyCandidate => (
				!!config
				&& !!config.remove_dataCtxKeys
				&& isEmptyStatement(node)
				&& !!node.parent
				&& !!node.parent.parent
				&& isFunctionDeclaration(node.parent.parent)
				&& !!node.parent.parent.name
				&& this.validate_function_name.test(
					node.parent.parent.name.text,
				)
			),
			(node, config) => {
				const maybe = this.#configEntry(
					config.remove_dataCtxKeys,
					node,
				);

				if (maybe) {
					specify_config[
						node.parent.parent.name.text
					] = maybe;
				}
			},
		);
	}
}

export class ModifyValidateOptionsByConfig extends ModifyValidate {
	constructor(
		specify_modify_options_name_config: specify_modify_options_name_config,
	) {
		super(
			(node): node is ValidateFunctionDeclaration => (
				isFunctionDeclaration(node)
				&& !!node.name
				&& this.validate_function_name.test(
					node.name.text,
				)
				&& node.name.text in specify_modify_options_name_config
				&& 2 === node.parameters.length
				&& isObjectBindingPattern(node.parameters[1].name)
			),
			(node) => this.#modify_validate(
				node,
				specify_modify_options_name_config,
			),
		);
	}

	#modify_validate(
		node: ValidateFunctionDeclaration,
		config: specify_modify_options_name_config,
	) {
		const [
			data,
			options,
		] = node.parameters;

		const options_name = this.maybe_modify_name(
			options.name,
			config[node.name.text],
		);

		const new_options = factory.updateParameterDeclaration(
			options,
			options.modifiers,
			options.dotDotDotToken,
			options_name,
			options.questionToken,
			options.type,
			options.initializer,
		);

		return factory.updateFunctionDeclaration(
			node,
			node.modifiers,
			node.asteriskToken,
			node.name,
			node.typeParameters,
			[
				data,
				new_options,
			],
			node.type,
			node.body,
		);
	}
}
