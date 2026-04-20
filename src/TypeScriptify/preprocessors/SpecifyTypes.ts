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
	prepend_with_imports,
} from '../types.ts';

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
								getText(): `validate${number}`,
							}
						),
					}
				),
			}
		),
	}
);

export default class SpecifyTypes extends ConditionalPreprocessor<
	SpecifyTypesCandidate
> {
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

	constructor(
		prepend_with_imports: prepend_with_imports,
		specify_types: {
			[key: string]: Config['specify_types'][string][0],
		},
	) {
		super(
			(node, config): node is SpecifyTypesCandidate => (
				!!config
				&& !!config.specify_types
				&& isEmptyStatement(node)
				&& isFunctionDeclaration(node.parent.parent)
				&& !!node.parent.parent.name
				&& this.validate_function_name.test(
					node.parent.parent.name.getText(),
				)
			),
			(node, config) => {
				const maybe = this.#configEntry(
					config?.specify_types || {},
					node,
				);

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
			},
		);
	}
}
