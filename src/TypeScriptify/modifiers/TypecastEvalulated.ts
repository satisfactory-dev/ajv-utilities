import type {
	Identifier,
	PropertyAccessExpression,
} from 'typescript';
import {
	factory,
	isIdentifier,
	isPropertyAccessExpression,
	SyntaxKind,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

import type {
	prepend_with_imports,
} from '../TypeReferences.ts';

type QuestionableEvaluatedPropertyCandidate = (
	& PropertyAccessExpression
	& {
		expression: (
			& PropertyAccessExpression
			& {
				expression: (
					& Identifier
					& {
						text: `validate${number}`,
					}
				),
				name: (
					& Identifier
					& {
						text: 'evaluated',
					}
				),
			}
		),
		questionDotToken: undefined,
		name: Identifier,
	}
);

export class QuestionableEvaluatedProperty extends ConditionalModification<
	QuestionableEvaluatedPropertyCandidate
> {
	constructor() {
		super(
			(maybe): maybe is QuestionableEvaluatedPropertyCandidate => (
				isPropertyAccessExpression(maybe)
				&& isPropertyAccessExpression(maybe.expression)
				&& isIdentifier(maybe.expression.expression)
				&& this.validate_function_name.test(
					maybe.expression.expression.text,
				)
				&& isIdentifier(maybe.expression.name)
				&& 'evaluated' === maybe.expression.name.text
				&& undefined === maybe.questionDotToken
				&& isIdentifier(maybe.name)
			),
			(node) => factory.createPropertyAccessChain(
				node.expression,
				factory.createToken(SyntaxKind.QuestionDotToken),
				node.name,
			),
		);
	}
}

type TypecastEvalulatedCandidate = (
	& PropertyAccessExpression
	& {
		expression: (
			& Identifier
			& {
				text: `validate${number}`,
			}
		),
		name: (
			& Identifier
			& {
				text: 'evaluated',
			}
		),
	}
);

export class TypecastEvalulated extends ConditionalModification<
	TypecastEvalulatedCandidate
> {
	constructor(prepend_with_imports: prepend_with_imports) {
		super(
			(node): node is TypecastEvalulatedCandidate => (
				isPropertyAccessExpression(node)
				&& isIdentifier(node.expression)
				&& !!this.validate_function_name.test(
					node.expression.text,
				)
				&& 'evaluated' === node.name.text
			),
			(node) => {
				prepend_with_imports[
					'@satisfactory-dev/ajv-utilities'
				].add('Is');

				return factory.createPropertyAccessExpression(
					factory.createParenthesizedExpression(
						factory.createAsExpression(
							factory.createIdentifier(node.expression.text),
							factory.createTypeReferenceNode('Is'),
						),
					),
					factory.createIdentifier(node.name.text),
				);
			},
		);
	}
}
