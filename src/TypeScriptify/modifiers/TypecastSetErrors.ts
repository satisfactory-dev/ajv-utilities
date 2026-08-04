import type {
	BinaryExpression,
	Identifier,
	PropertyAccessExpression,
	SyntaxKind,
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

type TypecastSetErrorsCandidate = (
	& BinaryExpression
	& {
		left: (
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
	constructor(
		ts: ts,
		prepend_with_imports: prepend_with_imports,
	) {
		const {
			factory,
			isBinaryExpression,
			isIdentifier,
			isPropertyAccessExpression,
			SyntaxKind,
		} = ts;

		super(
			(node): node is TypecastSetErrorsCandidate => (
				isBinaryExpression(node)
				&& isPropertyAccessExpression(node.left)
				&& isIdentifier(node.left.expression)
				&& this.validate_function_name.test(
					node.left.expression.text,
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
				KnownImports.IsStandalone(ts, prepend_with_imports);

				return factory.updateBinaryExpression(
					node,
					factory.updatePropertyAccessExpression(
						node.left,
						factory.createAsExpression(
							node.left.expression,
							factory.createTypeReferenceNode(
								'IsStandalone',
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
