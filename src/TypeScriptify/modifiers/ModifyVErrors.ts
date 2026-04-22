// oxlint-disable @stylistic/max-len
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

type ConditionalPushCandidate<
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

export class ReplaceVErrorsPushIfElse extends ConditionalModification<
	ConditionalPushCandidate
> {
	constructor() {
		super(
			(maybe): maybe is ConditionalPushCandidate => (
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

type ConditionalLengthSetCandidate<
	T extends `_errs${number}` = `_errs${number}`,
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
						kind: SyntaxKind.ExclamationEqualsEqualsToken,
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
					& NodeArray<IfStatement>
					& {
						length: 1,
						0: (
							& IfStatement
							& {
								expression: (
									& Identifier
									& {
										text: T,
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
																				text: 'length',
																			}
																		),
																	}
																),
																operatorToken: (
																	& BinaryOperatorToken
																	& {
																		kind: SyntaxKind.EqualsToken,
																	}
																),
																right: (
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
																		kind: SyntaxKind.EqualsToken,
																	}
																),
																right: {
																	kind: SyntaxKind.NullKeyword,
																},
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
		elseStatement: undefined,
	}
);

export class ConditionalLengthSet extends ConditionalModification<
	ConditionalLengthSetCandidate
> {
	constructor() {
		super(
			(maybe): maybe is ConditionalLengthSetCandidate => (
				isIfStatement(maybe)
				&& isBinaryExpression(maybe.expression)
				&& isIdentifier(maybe.expression.left)
				&& 'vErrors' === maybe.expression.left.text
				&& SyntaxKind.ExclamationEqualsEqualsToken === maybe.expression.operatorToken.kind
				&& SyntaxKind.NullKeyword === maybe.expression.right.kind
				&& isBlock(maybe.thenStatement)
				&& 1 === maybe.thenStatement.statements.length
				&& isIfStatement(maybe.thenStatement.statements[0])
				&& isIdentifier(maybe.thenStatement.statements[0].expression)
				&& /^_errs\d+$/.test(
					maybe.thenStatement.statements[0].expression.text,
				)
				&& isBlock(maybe.thenStatement.statements[0].thenStatement)
				&& 1 === maybe.thenStatement.statements[
					0
				].thenStatement.statements.length
				&& isExpressionStatement(maybe.thenStatement.statements[
					0
				].thenStatement.statements[
					0
				])
				&& isBinaryExpression(maybe.thenStatement.statements[
					0
				].thenStatement.statements[
					0
				].expression)
				&& isPropertyAccessExpression(maybe.thenStatement.statements[
					0
				].thenStatement.statements[
					0
				].expression.left)
				&& isIdentifier(maybe.thenStatement.statements[
					0
				].thenStatement.statements[
					0
				].expression.left.expression)
				&& 'vErrors' === maybe.thenStatement.statements[
					0
				].thenStatement.statements[
					0
				].expression.left.expression.text
				&& isIdentifier(maybe.thenStatement.statements[
					0
				].thenStatement.statements[
					0
				].expression.left.name)
				&& 'length' === maybe.thenStatement.statements[
					0
				].thenStatement.statements[
					0
				].expression.left.name.text
				&& SyntaxKind.EqualsToken === maybe.thenStatement.statements[
					0
				].thenStatement.statements[
					0
				].expression.operatorToken.kind
				&& isIdentifier(maybe.thenStatement.statements[
					0
				].thenStatement.statements[
					0
				].expression.right)
				&& maybe.thenStatement.statements[
					0
				].thenStatement.statements[
					0
				].expression.right.text === maybe.thenStatement.statements[
					0
				].expression.text
				&& !!maybe.thenStatement.statements[0].elseStatement
				&& isBlock(maybe.thenStatement.statements[0].elseStatement)
				&& 1 === maybe.thenStatement.statements[
					0
				].elseStatement.statements.length
				&& isExpressionStatement(maybe.thenStatement.statements[
					0
				].elseStatement.statements[0])
				&& isBinaryExpression(maybe.thenStatement.statements[
					0
				].elseStatement.statements[0].expression)
				&& isIdentifier(maybe.thenStatement.statements[
					0
				].elseStatement.statements[0].expression.left)
				&& 'vErrors' === maybe.thenStatement.statements[
					0
				].elseStatement.statements[0].expression.left.text
				&& SyntaxKind.EqualsToken === maybe.thenStatement.statements[
					0
				].elseStatement.statements[0].expression.operatorToken.kind
				&& SyntaxKind.NullKeyword === maybe.thenStatement.statements[
					0
				].elseStatement.statements[0].expression.right.kind
			),
			(node) => factory.updateIfStatement(
				node,
				factory.createPropertyAccessExpression(
					factory.createIdentifier('vErrors'),
					'length',
				),
				factory.updateBlock(
					node.thenStatement,
					[
						factory.updateIfStatement(
							node.thenStatement.statements[0],
							node.thenStatement.statements[0].expression,
							node.thenStatement.statements[0].thenStatement,
							factory.createBlock([factory.createExpressionStatement(
								factory.createBinaryExpression(
									factory.createIdentifier('vErrors'),
									SyntaxKind.EqualsToken,
									factory.createArrayLiteralExpression(),
								),
							)]),
						),
					],
				),
				undefined,
			),
		);
	}
}
