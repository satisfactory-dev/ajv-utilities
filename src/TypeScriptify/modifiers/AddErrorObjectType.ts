import type {
	Identifier,
	VariableDeclaration,
} from 'typescript';
import {
	factory,
	isIdentifier,
	isVariableDeclaration,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

import type {
	prepend_with_imports,
} from '../TypeReferences.ts';

type AddErrorObjectTypeCandidate = (
	& VariableDeclaration
	& {
		name: (
			& Identifier
			& {
				text: `err${number}`,
			}
		),
	}
);

export default class AddErrorObjectType extends ConditionalModification<
	AddErrorObjectTypeCandidate
> {
	constructor(prepend_with_imports: prepend_with_imports) {
		super(
			(node): node is AddErrorObjectTypeCandidate => (
				isVariableDeclaration(node)
				&& isIdentifier(node.name)
				&& /^err\d+$/.test(node.name.text)
			),
			(node) => {
				prepend_with_imports.ajv.add('ErrorObject');

				return factory.updateVariableDeclaration(
					node,
					node.name,
					node.exclamationToken,
					factory.createTypeReferenceNode('ErrorObject'),
					node.initializer,
				);
			},
		);
	}
}
