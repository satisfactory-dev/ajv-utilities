import type {
	Block,
	Identifier,
	IfStatement,
	Node,
	NodeArray,
	VariableDeclaration,
	VariableDeclarationList,
} from 'typescript';
import {
	factory,
	isBlock,
	isIdentifier,
	isIfStatement,
	isVariableStatement,
	NodeFlags,
	SyntaxKind,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

type HoistDeclarationAsZeroCandidateDeclaration = (
	& VariableDeclaration
	& {
		name: (
			& Identifier
			& {
				text: `items${number}`,
			}
		),
		initializer: {
			kind: SyntaxKind.TrueKeyword,
		},
	}
);

type HoistDeclarationAsZeroCandidateBlock<
	Declaration extends HoistDeclarationAsZeroCandidateDeclaration,
> = (
	& Block
	& {
		statements: (
			& NodeArray<Node>
			& {
				0: (
					& IfStatement
					& {
						expression: (
							& Identifier
							& {
								text: `_valid${number}`,
							}
						),
						thenStatement: (
							& Block
							& {
								statements: (
									& NodeArray<Node>
									& {
										length: 3,
										2: (
											& VariableDeclaration
											& {
												declarationList: (
													& VariableDeclarationList
													& {
														declarations: {
															length: 1,
															0: Declaration,
														},
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
				),
			}
		),
	}
);

type HoistDeclarationAsZeroCandidate<
	T extends HoistDeclarationAsZeroCandidateBlock<
		HoistDeclarationAsZeroCandidateDeclaration
	> = HoistDeclarationAsZeroCandidateBlock<
		HoistDeclarationAsZeroCandidateDeclaration
	>,
> = (
	& T
	& {
		parent: (
			& IfStatement
			& {
				elseStatement: T,
			}
		),
	}
);

export default class HoistDeclarationAsZero extends ConditionalModification<
	HoistDeclarationAsZeroCandidate
> {
	constructor() {
		super(
			(maybe): maybe is HoistDeclarationAsZeroCandidate => (
				isBlock(maybe)
				&& !!maybe.parent
				&& isIfStatement(maybe.parent)
				&& maybe.parent.elseStatement === maybe
				&& maybe.statements.length > 1
				&& isIfStatement(maybe.statements[0])
				&& isIdentifier(maybe.statements[0].expression)
				&& /^_valid\d+$/.test(maybe.statements[0].expression.text)
				&& isBlock(maybe.statements[0].thenStatement)
				&& 3 === maybe.statements[0].thenStatement.statements.length
				&& isVariableStatement(
					maybe.statements[0].thenStatement.statements[2],
				)
				&& 1 === maybe.statements[
					0
				].thenStatement.statements[
					2
				].declarationList.declarations.length
				&& isIdentifier(maybe.statements[
					0
				].thenStatement.statements[
					2
				].declarationList.declarations[
					0
				].name)
				&& /^items\d+$/.test(maybe.statements[
					0
				].thenStatement.statements[
					2
				].declarationList.declarations[
					0
				].name.text)
				&& !!maybe.statements[
					0
				].thenStatement.statements[
					2
				].declarationList.declarations[
					0
				].initializer
				&& SyntaxKind.TrueKeyword === maybe.statements[
					0
				].thenStatement.statements[
					2
				].declarationList.declarations[
					0
				].initializer.kind
			),
			(node) => {
				const [if_statement, ...remaining] = node.statements;

				return factory.updateBlock(
					node,
					[
						factory.createVariableStatement(
							undefined,
							factory.createVariableDeclarationList(
								[factory.createVariableDeclaration(
									node.statements[
										0
									].thenStatement.statements[
										2
									].declarationList.declarations[
										0
									].name.text,
									undefined,
									factory.createUnionTypeNode([
										factory.createKeywordTypeNode(
											SyntaxKind.NumberKeyword,
										),
										factory.createLiteralTypeNode(
											factory.createToken(
												SyntaxKind.TrueKeyword,
											),
										),
									]),
									factory.createNumericLiteral(0),
								)],
								NodeFlags.Let,
							),
						),
						factory.updateIfStatement(
							if_statement,
							if_statement.expression,
							factory.updateBlock(if_statement.thenStatement, [
								if_statement.thenStatement.statements[0],
								if_statement.thenStatement.statements[1],
								factory.createExpressionStatement(
									factory.createBinaryExpression(
										factory.createIdentifier(
											node.statements[
												0
											].thenStatement.statements[
												2
											].declarationList.declarations[
												0
											].name.text,
										),
										SyntaxKind.EqualsToken,
										factory.createToken(
											SyntaxKind.TrueKeyword,
										),
									),
								),
							]),
							undefined,
						),
						...remaining,
					],
				);
			},
		);
	}
}
