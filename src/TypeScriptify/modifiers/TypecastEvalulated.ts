import type {
	Identifier,
	PropertyAccessExpression,
	VariableDeclaration,
} from '@typescript/typescript6';

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
	constructor({
		factory,
		isIdentifier,
		isPropertyAccessExpression,
		SyntaxKind,
	}: ts) {
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
		parent: Exclude<Node, VariableDeclaration>,
	}
);

export class TypecastEvalulated extends ConditionalModification<
	TypecastEvalulatedCandidate
> {
	constructor(
		ts: ts,
		prepend_with_imports: prepend_with_imports,
	) {
		const {
			factory,
			isIdentifier,
			isPropertyAccessExpression,
			isVariableDeclaration,
		} = ts;

		super(
			(node): node is TypecastEvalulatedCandidate => (
				isPropertyAccessExpression(node)
				&& isIdentifier(node.expression)
				&& !!this.validate_function_name.test(
					node.expression.text,
				)
				&& 'evaluated' === node.name.text
				&& (
					!node.parent
					|| !isVariableDeclaration(node.parent)
				)
			),
			(node) => {
				KnownImports.IsStandalone(ts, prepend_with_imports);

				return factory.createPropertyAccessExpression(
					factory.createParenthesizedExpression(
						factory.createAsExpression(
							factory.createIdentifier(node.expression.text),
							factory.createTypeReferenceNode('IsStandalone'),
						),
					),
					factory.createIdentifier(node.name.text),
				);
			},
		);
	}
}
