import type {
	FunctionDeclaration,
	Identifier,
} from 'typescript';
import {
	factory,
	isFunctionDeclaration,
	isIdentifier,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

import type {
	Type,
} from '../TypeReferences.ts';

type SpecifyTypePredicateCandidate = (
	& FunctionDeclaration
	& {
		name: (
			& Identifier
			& {
				text: Exclude<string, `ajv_utilities__${string}`>,
			}
		),
	}
);

export default class SpecifyTypePredicate extends ConditionalModification<
	SpecifyTypePredicateCandidate
> {
	constructor(
		specify_types: Readonly<{
			[key: string]: Type,
		}>,
	) {
		super(
			(node): node is SpecifyTypePredicateCandidate => (
				isFunctionDeclaration(node)
				&& !!node.name
				&& isIdentifier(node.name)
				&& !node.name.text.startsWith('ajv_utilities__')
			),
			(node) => {
				const function_name = node.name.text;

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
							specify_types[function_name].toTypeReferenceNode(),
						),
						node.body,
					);
				}

				return false;
			},
		);
	}
}
