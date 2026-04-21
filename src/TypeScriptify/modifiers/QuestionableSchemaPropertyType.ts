import type {
	Identifier,
	PropertyAccessExpression,
	PropertyAssignment,
} from 'typescript';
import {
	factory,
	isIdentifier,
	isPropertyAccessExpression,
	isPropertyAssignment,
	SyntaxKind,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

type Candidate = (
	& PropertyAccessExpression
	& {
		parent: PropertyAssignment,
		expression: PropertyAccessExpression,
		name: (
			& Identifier
			& {
				getText(): 'type',
			}
		),
	}
);

// oxlint-disable-next-line @stylistic/max-len
export default class QuestionableSchemaPropertyType extends ConditionalModification<
	Candidate
> {
	constructor() {
		super(
			(maybe): maybe is Candidate => (
				isPropertyAccessExpression(maybe)
				&& !!maybe.parent
				&& isPropertyAssignment(maybe.parent)
				&& isPropertyAccessExpression(maybe.expression)
				&& isIdentifier(maybe.name)
				&& 'type' === maybe.name.getText()
			),
			(node) => factory.createPropertyAccessChain(
				node.expression,
				factory.createToken(SyntaxKind.QuestionDotToken),
				node.name,
			),
		);
	}
}
