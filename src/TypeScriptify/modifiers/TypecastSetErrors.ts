import type {
	BinaryExpression,
	Identifier,
	PropertyAccessExpression,
} from 'typescript';
import {
	factory,
	isBinaryExpression,
	isIdentifier,
	isPropertyAccessExpression,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

import type {
	prepend_with_imports,
} from '../types.ts';

type TypecastSetErrorsCandidate = (
	& BinaryExpression
	& {
		left: (
			& PropertyAccessExpression
			& {
				expression: (
					& Identifier
					& {
						getText(): `validate${number}`,
					}
				),
				name: (
					& Identifier
					& {
						getText(): 'errors',
					}
				),
			}
		),
	}
);

export default class TypecastSetErrors extends ConditionalModification<
	TypecastSetErrorsCandidate
> {
	constructor(prepend_with_imports: prepend_with_imports) {
		super(
			(node): node is TypecastSetErrorsCandidate => (
				isBinaryExpression(node)
				&& isPropertyAccessExpression(node.left)
				&& isIdentifier(node.left.expression)
				&& this.validate_function_name.test(
					node.left.expression.getText(),
				)
				&& isIdentifier(node.left.name)
				&& 'errors' === node.left.name.getText()
			),
			(node) => {
				prepend_with_imports.ajv.add('ValidateFunction');

				return factory.updateBinaryExpression(
					node,
					factory.updatePropertyAccessExpression(
						node.left,
						factory.createAsExpression(
							node.left.expression,
							factory.createTypeReferenceNode(
								'ValidateFunction',
							),
						),
						node.left.name,
					),
					node.operatorToken,
					node.right,
				);
			},
		);
	}
}
