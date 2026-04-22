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
	SyntaxKind,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

import type {
	prepend_with_imports,
} from '../TypeReferences.ts';

import KnownImports from '../known_imports.ts';

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
		right: (
			| (
				& Identifier
				& {
					getText(): 'vErrors',
				}
			)
			| {
				kind: SyntaxKind.NullKeyword,
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
				&& (
					(
						isIdentifier(node.right)
						&& 'vErrors' === node.right.getText()
					)
					|| SyntaxKind.NullKeyword === node.right.kind
				)
			),
			(node) => {
				KnownImports.Is(prepend_with_imports);

				return factory.updateBinaryExpression(
					node,
					factory.updatePropertyAccessExpression(
						node.left,
						factory.createAsExpression(
							node.left.expression,
							factory.createTypeReferenceNode(
								'Is',
							),
						),
						node.left.name,
					),
					factory.createToken(SyntaxKind.EqualsToken),
					SyntaxKind.NullKeyword === node.right.kind
						? factory.createNull()
						: factory.createConditionalExpression(
							factory.createPropertyAccessExpression(
								factory.createIdentifier(node.right.getText()),
								'length',
							),
							factory.createToken(SyntaxKind.QuestionToken),
							node.right,
							factory.createToken(SyntaxKind.ColonToken),
							factory.createNull(),
						),
				);
			},
		);
	}
}
