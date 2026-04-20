import type {
	BinaryExpression,
	BinaryOperatorToken,
	CallExpression,
	Expression,
	Identifier,
	IfStatement,
	NodeArray,
	PrefixUnaryExpression,
	PropertyAccessExpression,
	Statement,
	StringLiteral,
	TypeOfExpression,
} from 'typescript';
import {
	factory,
	isBinaryExpression,
	isCallExpression,
	isIdentifier,
	isIfStatement,
	isPrefixUnaryExpression,
	isPropertyAccessExpression,
	isStringLiteral,
	isTypeOfExpression,
	SyntaxKind,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

type PatchIsObjectCandidate<
	IdentifierText extends string = string,
> = (
	& IfStatement
	& {
		expression: (
			& BinaryExpression
			& {
				left: (
					& BinaryExpression
					& {
						left: (
							& Identifier
							& {
								getText(): IdentifierText,
							}
						),
						operatorToken: (
							& BinaryOperatorToken
							& {
								kind: SyntaxKind.AmpersandAmpersandToken,
							}
						),
						right: (
							BinaryExpression
							& {
								left: (
									& TypeOfExpression
									& {
										expression: (
											& Identifier
											& {
												getText(): IdentifierText,
											}
										),
									}
								),
								operatorToken: (
									& BinaryOperatorToken
									& {
										kind: SyntaxKind.EqualsEqualsToken,
									}
								),
								right: (
									& StringLiteral
									& {
										text: 'object',
									}
								),
							}
						),
					}
				),
				operatorToken: (
					& BinaryOperatorToken
					& {
						kind: SyntaxKind.AmpersandAmpersandToken,
					}
				),
				right: (
					& PrefixUnaryExpression
					& {
						operator: SyntaxKind.ExclamationToken,
						operand: (
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
								arguments: (
									& NodeArray<Identifier>
									& {
										length: 1,
										0: (
											& Identifier
											& {
												getText(): IdentifierText,
											}
										),
									}
								),
							}
						),
					}
				),
			}
		),
	}
);

export default class PatchIsObject extends ConditionalModification<
	PatchIsObjectCandidate
> {
	#replace_is_object(
		name: Expression,
		then: Statement,
		else_statement?: Statement,
	) {
		return factory.createIfStatement(
			factory.createCallExpression(
				factory.createIdentifier('ajv_utilities__is_probably_object'),
				undefined,
				[name],
			),
			then,
			else_statement,
		);
	}

	constructor(patch_needed: () => void) {
		super(
			(node): node is PatchIsObjectCandidate => (
				isIfStatement(node)
				&& isBinaryExpression(node.expression)
				&& isBinaryExpression(node.expression.left)
				&& isIdentifier(node.expression.left.left)

				// oxlint-disable-next-line @stylistic/max-len
				&& SyntaxKind.AmpersandAmpersandToken === node.expression.left.operatorToken.kind

				&& isBinaryExpression(node.expression.left.right)
				&& isTypeOfExpression(node.expression.left.right.left)
				&& isIdentifier(node.expression.left.right.left.expression)

				// oxlint-disable-next-line @stylistic/max-len
				&& node.expression.left.left.getText() === node.expression.left.right.left.expression.getText()

				// oxlint-disable-next-line @stylistic/max-len
				&& SyntaxKind.EqualsEqualsToken === node.expression.left.right.operatorToken.kind
				&& isStringLiteral(node.expression.left.right.right)
				&& 'object' === node.expression.left.right.right.text

				// oxlint-disable-next-line @stylistic/max-len
				&& SyntaxKind.AmpersandAmpersandToken === node.expression.operatorToken.kind
				&& isPrefixUnaryExpression(node.expression.right)

				// oxlint-disable-next-line @stylistic/max-len
				&& SyntaxKind.ExclamationToken === node.expression.right.operator
				&& isCallExpression(node.expression.right.operand)
				&& isPropertyAccessExpression(
					node.expression.right.operand.expression,
				)
				&& isIdentifier(
					node.expression.right.operand.expression.expression,
				)
				&& isIdentifier(
					node.expression.right.operand.expression.name,
				)
				&& 'Array.isArray' === `${

					// oxlint-disable-next-line @stylistic/max-len
					node.expression.right.operand.expression.expression.getText()
				}.${
					node.expression.right.operand.expression.name.getText()
				}`
				&& 1 === node.expression.right.operand.arguments.length
				&& isIdentifier(
					node.expression.right.operand.arguments[0],
				)
				&& (
					node.expression.left.left.getText(
					) === node.expression.right.operand.arguments[0].getText()
				)
			),
			(node) => {
				patch_needed();

				return this.#replace_is_object(
					node.expression.left.left,
					node.thenStatement,
					node.elseStatement,
				);
			},
		);
	}

	static patch() {
		return factory.createFunctionDeclaration(
			undefined,
			undefined,
			'ajv_utilities__is_probably_object',
			undefined,
			[
				factory.createParameterDeclaration(
					undefined,
					undefined,
					'maybe',
					undefined,
					factory.createKeywordTypeNode(SyntaxKind.UnknownKeyword),
				),
			],
			factory.createTypePredicateNode(
				undefined,
				'maybe',
				factory.createTypeReferenceNode(
					'Record',
					[
						factory.createKeywordTypeNode(
							SyntaxKind.StringKeyword,
						),
						factory.createKeywordTypeNode(
							SyntaxKind.UnknownKeyword,
						),
					],
				),
			),
			factory.createBlock([
				factory.createReturnStatement(
					factory.createBinaryExpression(
						factory.createBinaryExpression(
							factory.createPrefixUnaryExpression(
								SyntaxKind.ExclamationToken,
								factory.createPrefixUnaryExpression(
									SyntaxKind.ExclamationToken,
									factory.createIdentifier('maybe'),
								),
							),
							factory.createToken(
								SyntaxKind.AmpersandAmpersandToken,
							),
							factory.createBinaryExpression(
								factory.createTypeOfExpression(
									factory.createIdentifier('maybe'),
								),
								factory.createToken(
									SyntaxKind.EqualsEqualsEqualsToken,
								),
								factory.createStringLiteral('object'),
							),
						),
						factory.createToken(
							SyntaxKind.AmpersandAmpersandToken,
						),
						factory.createPrefixUnaryExpression(
							SyntaxKind.ExclamationToken,
							factory.createCallExpression(
								factory.createPropertyAccessExpression(
									factory.createIdentifier('Array'),
									factory.createIdentifier('isArray'),
								),
								undefined,
								[
									factory.createIdentifier('maybe'),
								],
							),
						),
					),
				),
			]),
		);
	}
}
