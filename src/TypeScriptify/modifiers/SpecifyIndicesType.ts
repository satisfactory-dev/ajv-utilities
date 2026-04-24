import type {
	Identifier,
	VariableDeclaration,
} from 'typescript';
import {
	factory,
	isIdentifier,
	isVariableDeclaration,
	SyntaxKind,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

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
	constructor() {
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
