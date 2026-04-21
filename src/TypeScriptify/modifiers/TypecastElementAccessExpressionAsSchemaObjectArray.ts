import type {
	ElementAccessExpression,
	Identifier,
	NumericLiteral,
	PropertyAccessExpression,
} from 'typescript';
import {
	factory,
	isElementAccessExpression,
	isIdentifier,
	isNumericLiteral,
	isPropertyAccessExpression,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

import type {
	prepend_with_imports,
} from '../TypeReferences.ts';

import KnownImports from '../known_imports.ts';

type Candidate = (
	& ElementAccessExpression
	& {
		expression: (
			& PropertyAccessExpression
			& {
				expression: (
					& PropertyAccessExpression
					& {
						name: (
							& Identifier
							& {
								getText(): 'additionalProperties',
							}
						),
					}
				),
				name: (
					& Identifier
					& {
						getText(): 'oneOf',
					}
				),
			}
		),
		argumentExpression: NumericLiteral,
	}
);

// oxlint-disable-next-line @stylistic/max-len
export default class TypecastElementAccessExpressionAsSchemaObjectArray extends ConditionalModification<
	Candidate
> {
	constructor(prepend_with_imports: prepend_with_imports) {
		super(
			(maybe): maybe is Candidate => (
				isElementAccessExpression(maybe)
				&& isPropertyAccessExpression(maybe.expression)
				&& isPropertyAccessExpression(maybe.expression.expression)
				&& isIdentifier(maybe.expression.expression.name)

				// oxlint-disable-next-line @stylistic/max-len
				&& 'additionalProperties' === maybe.expression.expression.name.getText()
				&& isIdentifier(maybe.expression.name)
				&& 'oneOf' === maybe.expression.name.getText()
				&& isNumericLiteral(maybe.argumentExpression)
			),
			(node) => {
				KnownImports.SchemaObject(prepend_with_imports);

				return factory.updateElementAccessExpression(
					node,
					factory.createParenthesizedExpression(
						factory.createAsExpression(
							node.expression,
							factory.createArrayTypeNode(
								factory.createTypeReferenceNode(
									'SchemaObject',
								),
							),
						),
					),
					node.argumentExpression,
				);
			},
		);
	}
}
