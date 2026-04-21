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
		parent: (
			| PropertyAssignment
			| PropertyAccessExpression
		),
		expression: (
			& PropertyAccessExpression
			& {
				name: (
					& Identifier
					& {
						getText(): (
							| 'properties'
							| 'allOf'
						),
					}
				),
			}
		),
	}
);

// oxlint-disable-next-line @stylistic/max-len
export default class QuestionableSchemaPropertyAccessExpression extends ConditionalModification<
	Candidate
> {
	constructor() {
		super(
			(maybe): maybe is Candidate => (
				!!maybe.parent
				&& (
					isPropertyAssignment(maybe.parent)
					|| isPropertyAccessExpression(maybe.parent)
				)
				&& isPropertyAccessExpression(maybe)
				&& isPropertyAccessExpression(maybe.expression)
				&& isIdentifier(maybe.expression.name)
				&& [
					'properties',
					'allOf',
				].includes(maybe.expression.name.getText())
			),
			(node) => factory.createPropertyAccessChain(
				node.expression,
				factory.createToken(SyntaxKind.QuestionDotToken),
				node.name,
			),
		);
	}
}
