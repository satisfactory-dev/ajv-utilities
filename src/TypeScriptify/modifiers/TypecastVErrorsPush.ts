import type {
	CallExpression,
	Identifier,
	PropertyAccessExpression,
} from 'typescript';
import {
	factory,
	isCallExpression,
	isIdentifier,
	isPropertyAccessExpression,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

import type {
	prepend_with_imports,
} from '../types.ts';
type TypecastVErrorsPushCandidate = (
	& CallExpression
	& {
		expression: (
			& PropertyAccessExpression
			& {
				expression: (
					& Identifier
					& {
						getText(): 'vErrors',
					}
				),
				name: (
					& Identifier
					& {
						getText(): 'push',
					}
				),
			}
		),
	}
);

export default class TypecastVErrorsPush extends ConditionalModification<
	TypecastVErrorsPushCandidate
> {
	constructor(prepend_with_imports: prepend_with_imports) {
		super(
			(node): node is TypecastVErrorsPushCandidate => (
				isCallExpression(node)
				&& isPropertyAccessExpression(node.expression)
				&& isIdentifier(node.expression.expression)
				&& 'vErrors' === node.expression.expression.getText()
				&& isIdentifier(node.expression.name)
				&& 'push' === node.expression.name.getText()
			),
			(node) => {
				prepend_with_imports.ajv.add('ErrorObject');

				return factory.updateCallExpression(
					node,
					factory.updatePropertyAccessExpression(
						node.expression,
						factory.createAsExpression(
							node.expression.expression,
							factory.createArrayTypeNode(
								factory.createTypeReferenceNode('ErrorObject'),
							),
						),
						node.expression.name,
					),
					node.typeArguments,
					node.arguments,
				);
			},
		);
	}
}
