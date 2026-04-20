import type {
	Identifier,
	IfStatement,
	PropertyAccessExpression,
} from 'typescript';
import {
	factory,
	isIdentifier,
	isIfStatement,
	isPropertyAccessExpression,
	SyntaxKind,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

type QuestionableConditionCandidate = (
	& PropertyAccessExpression
	& {
		parent: (
			& IfStatement
			& {
				expression: (
					& Identifier
					& {
						getText(): `evaluated${number}`,
					}
				),
			}
		),
		questionDotToken: undefined,
	}
);

export default class QuestionableCondition extends ConditionalModification<
	QuestionableConditionCandidate
> {
	constructor() {
		super(
			(node): node is QuestionableConditionCandidate => (
				isPropertyAccessExpression(node)
				&& node.parent
				&& isIfStatement(node.parent)
				&& isIdentifier(node.expression)
				&& /^evaluated\d+$/.test(node.expression.getText())
				&& !node.questionDotToken
			),
			(node) => factory.createPropertyAccessChain(
				node.expression,
				factory.createToken(SyntaxKind.QuestionDotToken),
				node.name,
			),
		);
	}
}
