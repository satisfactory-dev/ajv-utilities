import type {
	EmptyStatement,
	FunctionDeclaration,
	Identifier,
} from 'typescript';
import {
	isEmptyStatement,
	isFunctionDeclaration,
} from 'typescript';

import {
	ConditionalPreprocessor,
} from '../abstracts.ts';

import type {
	Config,
	specify_types_instance,
} from '../types.ts';

import type {
	prepend_with_imports,
} from '../TypeReferences.ts';
import {
	Types,
} from '../TypeReferences.ts';

type SpecifyTypesCandidate = (
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

type config = (
	& Omit<Partial<Config>, 'specify_types'>
	& Pick<Config, 'specify_types'>
);

export class SpecifyTypesBySourceURL extends ConditionalPreprocessor<
	SpecifyTypesCandidate,
	config
> {
	#configEntry(
		config: config['specify_types'],
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

	constructor(
		prepend_with_imports: prepend_with_imports,
		specify_types: specify_types_instance,
	) {
		super(
			(node, config): node is SpecifyTypesCandidate => (
				!!config
				&& !!config.specify_types
				&& isEmptyStatement(node)
				&& isFunctionDeclaration(node.parent.parent)
				&& !!node.parent.parent.name
				&& this.validate_function_name.test(
					node.parent.parent.name.text,
				)
			),
			(node, config) => {
				const maybe = this.#configEntry(config.specify_types, node);

				if (maybe) {
					if (!(maybe[1] in prepend_with_imports)) {
						prepend_with_imports[maybe[1]] = new Types();
					}

					specify_types[
						node.parent.parent.name.text
					] = prepend_with_imports[maybe[1]].add(maybe[0]);
				}
			},
		);
	}
}

export class SpecifyTypesByValidateFunction extends ConditionalPreprocessor<
	SpecifyTypesCandidate['parent']['parent']
> {
	constructor(
		prepend_with_imports: prepend_with_imports,
		specify_types: specify_types_instance,
	) {
		super(
			(maybe): maybe is SpecifyTypesCandidate['parent']['parent'] => (
				isFunctionDeclaration(maybe)
				&& !!maybe.name
				&& this.validate_function_name.test(
					maybe.name.text,
				)
			),
			(node, config) => {
				if (
					!config.specify_types_by_validate_function_name

					// oxlint-disable-next-line @stylistic/max-len
					|| !(node.name.text in config.specify_types_by_validate_function_name)
				) {
					return;
				}

				// oxlint-disable-next-line @stylistic/max-len
				const type_config = config.specify_types_by_validate_function_name[
					node.name.text
				];

				if (!(type_config[1] in prepend_with_imports)) {
					prepend_with_imports[type_config[1]] = new Types();
				}

				specify_types[
					node.name.text
				] = prepend_with_imports[type_config[1]].add(type_config[0]);
			},
		);
	}
}
