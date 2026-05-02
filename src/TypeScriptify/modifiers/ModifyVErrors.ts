// oxlint-disable @stylistic/max-len
import type {
	ArrayLiteralExpression,
	BinaryExpression,
	BinaryOperatorToken,
	Block,
	CallExpression,
	ConditionalExpression,
	ExpressionStatement,
	Identifier,
	IfStatement,
	Node,
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
	isConditionalExpression,
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
import KnownImports from '../known_imports.ts';

type VErrors = (
	& VariableDeclaration
	& {
		name: (
			& Identifier
			& {
				text: 'vErrors',
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
				&& 'vErrors' === node.name.text
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

type TernaryConcatCandidate<
	T extends PropertyAccessExpression,
> = (
	& ConditionalExpression
	& {
		condition: (
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
						kind: SyntaxKind.EqualsEqualsEqualsToken,
					}
				),
				right: {
					kind: SyntaxKind.NullKeyword,
				},
			}
		),
		whenTrue: T,
		whenFalse: (
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
								text: 'concat',
							}
						),
					}
				),
				arguments: (
					& NodeArray<PropertyAccessExpression>
					& {
						length: 1,
						0: T,
					}
				),
			}
		),
	}
);

abstract class TernaryConcat<
	T extends PropertyAccessExpression,
> extends ConditionalModification<TernaryConcatCandidate<T>> {
	constructor(
		prepend_with_imports: prepend_with_imports,
		is_property_access_expression: (maybe: Node) => maybe is T,
		accesses_match: (a: T, b: T) => boolean,
		visit: TernaryConcat<T>['visit'],
	) {
		super(
			(maybe): maybe is TernaryConcatCandidate<T> => (
				isConditionalExpression(maybe)
				&& isBinaryExpression(maybe.condition)
				&& isIdentifier(maybe.condition.left)
				&& 'vErrors' === maybe.condition.left.text
				&& SyntaxKind.EqualsEqualsEqualsToken === maybe.condition.operatorToken.kind
				&& SyntaxKind.NullKeyword === maybe.condition.right.kind
				&& is_property_access_expression(maybe.whenTrue)
				&& isCallExpression(maybe.whenFalse)
				&& isPropertyAccessExpression(maybe.whenFalse.expression)
				&& isIdentifier(maybe.whenFalse.expression.expression)
				&& 'vErrors' === maybe.whenFalse.expression.expression.text
				&& isIdentifier(maybe.whenFalse.expression.name)
				&& 'concat' === maybe.whenFalse.expression.name.text
				&& 1 === maybe.whenFalse.arguments.length
				&& is_property_access_expression(maybe.whenFalse.arguments[0])
				&& accesses_match(
					maybe.whenTrue,
					maybe.whenFalse.arguments[0],
				)
			),
			visit,
		);
	}
}

type DirectTernaryConcatPropertyAccessExpression<
	T extends `validate${number}` = `validate${number}`,
> = (
	& PropertyAccessExpression
	& {
		expression: (
			& Identifier
			& {
				text: T,
			}
		),
		name: (
			& Identifier
			& {
				text: 'errors',
			}
		),
	}
);

export class DirectTernaryConcat extends TernaryConcat<
	DirectTernaryConcatPropertyAccessExpression
> {
	constructor(
		prepend_with_imports: prepend_with_imports,
	) {
		super(
			prepend_with_imports,
			(maybe): maybe is DirectTernaryConcatPropertyAccessExpression => (
				isPropertyAccessExpression(maybe)
				&& isIdentifier(maybe.expression)
				&& this.validate_function_name.test(
					maybe.expression.text,
				)
				&& isIdentifier(maybe.name)
				&& 'errors' === maybe.name.text
			),
			(a, b) => (
				a.name.text === b.name.text
			),
			(node) => {
				KnownImports.IsStandalone(prepend_with_imports);

				return factory.createCallExpression(
					factory.updatePropertyAccessExpression(
						node.whenFalse.expression,
						node.whenFalse.expression.expression,
						node.whenFalse.expression.name,
					),
					undefined,
					[
						factory.createBinaryExpression(
							factory.createPropertyAccessExpression(
								factory.createParenthesizedExpression(
									factory.createAsExpression(
										factory.createIdentifier(
											node.whenTrue.expression.text,
										),
										factory.createTypeReferenceNode('IsStandalone'),
									),
								),
								factory.createIdentifier('errors'),
							),
							factory.createToken(SyntaxKind.BarBarToken),
							factory.createArrayLiteralExpression(),
						),
					],
				);
			},
		);
	}
}

type WrappedTernaryConcatPropertyAccessExpression<
	T extends `wrapper${number}` = `wrapper${number}`,
> = (
	& PropertyAccessExpression
	& {
		expression: (
			& PropertyAccessExpression
			& {
				expression: (
					& Identifier
					& {
						text: T,
					}
				),
				name: (
					& Identifier
					& {
						text: 'validate',
					}
				),
			}
		),
		name: (
			& Identifier
			& {
				text: 'errors',
			}
		),
	}
);

export class WrappedTernaryConcat extends TernaryConcat<
	WrappedTernaryConcatPropertyAccessExpression
> {
	constructor(
		prepend_with_imports: prepend_with_imports,
	) {
		super(
			prepend_with_imports,
			(maybe): maybe is WrappedTernaryConcatPropertyAccessExpression => (
				isPropertyAccessExpression(maybe)
				&& isPropertyAccessExpression(maybe.expression)
				&& isIdentifier(maybe.expression.expression)
				&& /^wrapper\d+$/.test(maybe.expression.expression.text)
				&& isIdentifier(maybe.expression.name)
				&& 'validate' === maybe.expression.name.text
				&& isIdentifier(maybe.name)
				&& 'errors' === maybe.name.text
			),
			(a, b) => (
				a.name.text === b.name.text
			),
			(node) => {
				return factory.createCallExpression(
					factory.updatePropertyAccessExpression(
						node.whenFalse.expression,
						node.whenFalse.expression.expression,
						node.whenFalse.expression.name,
					),
					undefined,
					[
						factory.createBinaryExpression(
							node.whenFalse.arguments[0],
							factory.createToken(SyntaxKind.BarBarToken),
							factory.createArrayLiteralExpression(),
						),
					],
				);
			},
		);
	}
}
