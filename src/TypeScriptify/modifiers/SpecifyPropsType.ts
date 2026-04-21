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
				getText(): `indices${number}`,
			}
		),
	}
);

export default class SpecifyPropsType extends ConditionalModification<
	Candidate
> {
	constructor() {
		super(
			(maybe): maybe is Candidate => (
				isVariableDeclaration(maybe)
				&& isIdentifier(maybe.name)
				&& /^props\d+$/.test(maybe.name.getText())
			),
			(node) => factory.updateVariableDeclaration(
				node,
				node.name,
				node.exclamationToken,
				factory.createParenthesizedType(factory.createUnionTypeNode([
					factory.createLiteralTypeNode(factory.createTrue()),
					factory.createTypeLiteralNode([
						factory.createPropertySignature(
							undefined,
							'type',
							factory.createToken(SyntaxKind.QuestionToken),
							factory.createLiteralTypeNode(
								factory.createTrue(),
							),
						),
					]),
				])),
				node.initializer,
			),
		);
	}
}
