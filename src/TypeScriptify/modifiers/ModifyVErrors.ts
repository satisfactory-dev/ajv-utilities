import type {
	ArrayLiteralExpression,
	BinaryExpression,
	BinaryOperatorToken,
	Block,
	CallExpression,
	ExpressionStatement,
	Identifier,
	IfStatement,
	NodeArray,
	PropertyAccessExpression,
	VariableDeclaration,
} from 'typescript';
import {
	factory,
	isArrayLiteralExpression,
	isBinaryExpression,
	isBlock,
	isCallExpression,
	isExpressionStatement,
	isIdentifier,
	isIfStatement,
	isPropertyAccessExpression,
	isToken,
	isVariableDeclaration,
	SyntaxKind,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

import type {
	prepend_with_imports,
} from '../TypeReferences.ts';

type VErrors = (
	& VariableDeclaration
	& {
		name: (
			& Identifier
			& {
				getText(): 'vErrors',
			}
		),
		initializer: {
			kind?: SyntaxKind.NullKeyword,
		},
	}
);

export class ModifyVErrors extends ConditionalModification<
	VErrors
> {
	constructor(
		prepend_with_imports: prepend_with_imports,
	) {
		super(
			(node): node is VErrors => (
				isVariableDeclaration(node)
				&& isIdentifier(node.name)
				&& 'vErrors' === node.name.getText()
				&& node.initializer?.kind === SyntaxKind.NullKeyword
			),
			(node) => {
				prepend_with_imports.ajv.add('ErrorObject');

				return factory.updateVariableDeclaration(
					node,
					node.name,
					node.exclamationToken,
					factory.createArrayTypeNode(
						factory.createTypeReferenceNode('ErrorObject'),
					),
					factory.createArrayLiteralExpression(),
				);
			},
		);
	}
}

type ConditionalCandidate<
	T extends `err${number}` = `err${number}`,
> = (
	& IfStatement
	& {
		expression: (
			& BinaryExpression
			& {
				left: (
					& Identifier
					& {
						text: 'vErrors',
					}
				),
				operatorToken: (
					& BinaryOperatorToken
					& {
						kind: SyntaxKind.EqualsEqualsEqualsToken,
					}
				),
				right: {
					kind: SyntaxKind.NullKeyword,
				},
			}
		),
		thenStatement: (
			& Block
			& {
				statements: (
					& NodeArray<ExpressionStatement>
					& {
						length: 1,
						0: (
							& ExpressionStatement
							& {
								expression: (
									& BinaryExpression
									& {
										left: (
											& Identifier
											& {
												text: 'vErrors',
											}
										),
										operator: (
											& BinaryOperatorToken
											& {
												token: SyntaxKind.EqualsToken,
											}
										),
										right: (
											& ArrayLiteralExpression
											& {
												elements: (
													& NodeArray<Identifier>
													& {
														length: 1,
														0: (
															& Identifier
															& {
																text: T,
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
				),
			}
		),
		elseStatement: (
			& Block
			& {
				statements: (
					& NodeArray<ExpressionStatement>
					& {
						length: 1,
						0: (
							& ExpressionStatement
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
														text: 'vErrors',
													}
												),
												name: (
													& Identifier
													& {
														text: 'push',
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
														text: T,
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
		),
	}
);

export class ReplaceVErrorsIfElse extends ConditionalModification<
	ConditionalCandidate
> {
	constructor() {
		super(
			(maybe): maybe is ConditionalCandidate => (
				isIfStatement(maybe)

				// #region condition
				&& isBinaryExpression(maybe.expression)
				&& isIdentifier(maybe.expression.left)
				&& 'vErrors' === maybe.expression.left.text

				// oxlint-disable-next-line @stylistic/max-len
				&& SyntaxKind.EqualsEqualsEqualsToken === maybe.expression.operatorToken.kind

				&& isToken(maybe.expression.right)
				&& SyntaxKind.NullKeyword === maybe.expression.right.kind

				// #endregion condition

				// #region then
				&& isBlock(maybe.thenStatement)
				&& 1 === maybe.thenStatement.statements.length
				&& isExpressionStatement(maybe.thenStatement.statements[0])
				&& isBinaryExpression(
					maybe.thenStatement.statements[0].expression,
				)
				&& isIdentifier(
					maybe.thenStatement.statements[0].expression.left,
				)
				&& 'vErrors' === maybe.thenStatement.statements[
					0
				].expression.left.text
				&& SyntaxKind.EqualsToken === maybe.thenStatement.statements[
					0
				].expression.operatorToken.kind
				&& isArrayLiteralExpression(maybe.thenStatement.statements[
					0
				].expression.right)
				&& 1 === maybe.thenStatement.statements[
					0
				].expression.right.elements.length
				&& isIdentifier(maybe.thenStatement.statements[
					0
				].expression.right.elements[0])
				&& /^err\d+$/.test(maybe.thenStatement.statements[
					0
				].expression.right.elements[0].text)

				// #endregion then

				// #region else
				&& !!maybe.elseStatement
				&& isBlock(maybe.elseStatement)
				&& 1 === maybe.elseStatement.statements.length
				&& isExpressionStatement(maybe.elseStatement.statements[0])
				&& isCallExpression(
					maybe.elseStatement.statements[0].expression,
				)
				&& isPropertyAccessExpression(
					maybe.elseStatement.statements[0].expression.expression,
				)
				&& isIdentifier(
					maybe.elseStatement.statements[
						0
					].expression.expression.expression,
				)
				&& 'vErrors' === maybe.elseStatement.statements[
					0
				].expression.expression.expression.text
				&& isIdentifier(
					maybe.elseStatement.statements[
						0
					].expression.expression.name,
				)
				&& 'push' === maybe.elseStatement.statements[
					0
				].expression.expression.name.text
				&& 1 === maybe.elseStatement.statements[
					0
				].expression.arguments.length
				&& isIdentifier(maybe.elseStatement.statements[
					0
				].expression.arguments[
					0
				])
				&& maybe.thenStatement.statements[
					0
				].expression.right.elements[
					0
				].text === maybe.elseStatement.statements[
					0
				].expression.arguments[
					0
				].text

				// #endregion else
			),
			(node) => factory.updateCallExpression(
				node.elseStatement.statements[0].expression,
				node.elseStatement.statements[0].expression.expression,
				node.elseStatement.statements[0].expression.typeArguments,
				node.elseStatement.statements[0].expression.arguments,
			),
		);
	}
}
