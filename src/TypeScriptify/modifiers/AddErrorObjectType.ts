import type {
	Identifier,
	VariableDeclaration,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

import type {
	prepend_with_imports,
} from '../TypeReferences.ts';
import KnownImports from '../known_imports.ts';

import type {
	ts,
} from '../../TypeScriptify.ts';

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
	constructor(
		{
			factory,
			isIdentifier,
			isVariableDeclaration,
		}: ts,
		prepend_with_imports: prepend_with_imports,
	) {
		super(
			(node): node is AddErrorObjectTypeCandidate => (
				isVariableDeclaration(node)
				&& isIdentifier(node.name)
				&& /^err\d+$/.test(node.name.text)
			),
			(node) => {
				KnownImports.ErrorObject(prepend_with_imports);

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
