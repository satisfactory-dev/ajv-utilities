import type {
	CallExpression,
	Expression,
	Identifier,
	IfStatement,
	NodeArray,
	PropertyAccessExpression,
} from 'typescript';
import {
	factory,
	isCallExpression,
	isIdentifier,
	isIfStatement,
	isPropertyAccessExpression,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

type PatchIsArrayCandidate = (
	& IfStatement
	& {
		expression: (
			& CallExpression
			& {
				expression: (
					& PropertyAccessExpression
					& {
						expression: (
							& Identifier
							& {
								getText(): 'Array',
							}
						),
						name: (
							& Identifier
							& {
								getText(): 'isArray',
							}
						),
					}
				),
			}
		),
	}
);

export default class PatchIsArray extends ConditionalModification<
	PatchIsArrayCandidate
> {
	#replace_is_array(
		args?: Expression[]|NodeArray<Expression>,
	) {
		return factory.createCallExpression(
			factory.createIdentifier('ajv_utilities__is_probably_array'),
			undefined,
			args,
		);
	}

	constructor(patch_needed: () => void) {
		super(
			(node): node is PatchIsArrayCandidate => (
				isIfStatement(node)
				&& isCallExpression(node.expression)
				&& isPropertyAccessExpression(node.expression.expression)
				&& isIdentifier(node.expression.expression.expression)
				&& isIdentifier(node.expression.expression.name)
				&& 'Array.isArray' === `${
					node.expression.expression.expression.getText()
				}.${
					node.expression.expression.name.getText()
				}`
			),
			(node) => {
				patch_needed();

				return (
					factory.updateIfStatement(
						node,
						this.#replace_is_array(node.expression.arguments),
						node.thenStatement,
						node.elseStatement,
					)
				);
			},
		);
	}
}
