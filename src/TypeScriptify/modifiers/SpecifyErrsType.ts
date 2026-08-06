import type {
	Identifier,
	VariableDeclaration,
} from '@typescript/typescript6';

import {
	ConditionalModification,
} from '../abstracts.ts';

import type {
	ts,
} from '../../TypeScriptify.ts';

type Candidate = (
	& VariableDeclaration
	& {
		name: (
			& Identifier
			& {
				text: `_errs${number}`,
			}
		),
		initializer: (
			& Identifier
			& {
				text: 'errors',
			}
		),
		type: undefined
	}
);

export default class SpecifyErrsType extends ConditionalModification<
	Candidate
> {
	constructor({
		factory,
		isIdentifier,
		isVariableDeclaration,
		SyntaxKind,
	}: ts) {
		super(
			(maybe): maybe is Candidate => (
				isVariableDeclaration(maybe)
				&& isIdentifier(maybe.name)
				&& /^_errs\d+$/.test(maybe.name.text)
				&& !!maybe.initializer
				&& isIdentifier(maybe.initializer)
				&& 'errors' === maybe.initializer.text
				&& undefined === maybe.type
			),
			(node) => factory.updateVariableDeclaration(
				node,
				node.name,
				node.exclamationToken,
				factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
				node.initializer,
			),
		);
	}
}
