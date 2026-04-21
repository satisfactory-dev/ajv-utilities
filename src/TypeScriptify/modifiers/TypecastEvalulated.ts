import type {
	BinaryExpression,
	Identifier,
	ObjectLiteralExpression,
	PropertyAccessExpression,
} from 'typescript';
import {
	factory,
	isBinaryExpression,
	isIdentifier,
	isObjectLiteralExpression,
	isPropertyAccessExpression,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

import type {
	prepend_with_imports,
} from '../TypeReferences.ts';

type TypecastEvalulatedCandidate = (
	& BinaryExpression
	& {
		left: (
			& PropertyAccessExpression
			& {
				expression: (
					& Identifier
					& {
						getText(): 'evaluated',
					}
				),
			}
		),
		right: ObjectLiteralExpression,
	}
);

export default class TypecastEvalulated extends ConditionalModification<
	TypecastEvalulatedCandidate
> {
	constructor(prepend_with_imports: prepend_with_imports) {
		super(
			(node): node is TypecastEvalulatedCandidate => (
				isBinaryExpression(node)
				&& isPropertyAccessExpression(node.left)
				&& isIdentifier(node.left.expression)
				&& !!this.validate_function_name.test(
					node.left.expression.getText(),
				)
				&& 'evaluated' === node.left.name.getText()
				&& isObjectLiteralExpression(node.right)
			),
			(node) => {
				prepend_with_imports[
					'@satisfactory-dev/ajv-utilities'
				].add('Is');

				return factory.updateBinaryExpression(
					node,
					node.left,
					node.operatorToken,
					factory.createAsExpression(
						node.right,
						factory.createIndexedAccessTypeNode(
							factory.createTypeReferenceNode(
								'Is',
							),
							factory.createLiteralTypeNode(
								factory.createStringLiteral('evaluated'),
							),
						),
					),
				);
			},
		);
	}
}
