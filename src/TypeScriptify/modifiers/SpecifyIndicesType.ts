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
				text: `indices${number}`,
			}
		),
	}
);

export default class SpecifyIndicesType extends ConditionalModification<
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
				&& /^indices\d+$/.test(maybe.name.text)
			),
			(node) => factory.updateVariableDeclaration(
				node,
				node.name,
				node.exclamationToken,
				factory.createTypeLiteralNode([factory.createIndexSignature(
					undefined,
					[
						factory.createParameterDeclaration(
							undefined,
							undefined,
							'key',
							undefined,
							factory.createKeywordTypeNode(
								SyntaxKind.StringKeyword,
							),
						),
					],
					factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
				)]),
				node.initializer,
			),
		);
	}
}
