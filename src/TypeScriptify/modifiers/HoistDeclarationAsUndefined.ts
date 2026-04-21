import type {
	FunctionDeclaration,
	Identifier,
	NodeArray,
	VariableDeclaration,
	VariableDeclarationList,
	VariableStatement,
} from 'typescript';
import {
	factory,
	isFunctionDeclaration,
	isIdentifier,
	isVariableDeclaration,
	isVariableStatement,
	NodeFlags,
	SyntaxKind,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

type Candidate = (
	& VariableStatement
	& {
		declarationList: (
			& VariableDeclarationList
			& {
				declarations: (
					& NodeArray<VariableDeclaration>
					& {
						length: 1,
						0: (
							& VariableDeclaration
							& {
								name: (
									& Identifier
									& {
										getText(): `props${number}`,
									}
								),
								initializer: Exclude<
									VariableDeclaration['initializer'],
									undefined
								>,
							}
						),
					}
				),
			}
		),
	}
);

type HoistingToHereCandidate = (
	& FunctionDeclaration
	& {
		name: (
			& Identifier
			& {
				text: `validate${number}`,
			}
		),
		body: Exclude<FunctionDeclaration['body'], undefined>,
	}
);

export type hoist_candidates = {
	[key: string]: Set<string>,
};

export class FindHoistCandidate extends ConditionalModification<
	Candidate
> {
	constructor(hoist_candidates: hoist_candidates) {
		super(
			(maybe): maybe is Candidate => {
				if (
					!(
						isVariableStatement(maybe)
						&& 1 === maybe.declarationList.declarations.length
						&& isVariableDeclaration(
							maybe.declarationList.declarations[0],
						)
						&& isIdentifier(
							maybe.declarationList.declarations[0].name,
						)
						&& /^props\d+$/.test(
							maybe.declarationList.declarations[
								0
							].name.getText(),
						)
					)
				) {
					return false;
				}

				const variable_name = maybe.declarationList.declarations[
					0
				].name.getText();

				let checking = maybe.parent;

				while (checking) {
					if (
						isFunctionDeclaration(checking)
						&& !!checking.name
						&& isIdentifier(checking.name)
						&& this.validate_function_name.test(
							checking.name.getText(),
						)
					) {
						const name = checking.name.getText();

						if (!(name in hoist_candidates)) {
							hoist_candidates[name] = new Set([variable_name]);
						} else {
							hoist_candidates[name].add(variable_name);
						}

						return true;
					}

					checking = checking.parent;
				}

				return false;
			},
			(node) => {
				const variable_name = node.declarationList.declarations[
					0
				].name.getText();

				return factory.createExpressionStatement(
					factory.createBinaryExpression(
						factory.createIdentifier(variable_name),
						factory.createToken(SyntaxKind.EqualsToken),
						node.declarationList.declarations[0].initializer,
					),
				);
			},
		);
	}
}

export class HoistDeclarationsHere extends ConditionalModification<
	HoistingToHereCandidate
> {
	#createHoistedType() {
		return factory.createParenthesizedType(factory.createUnionTypeNode([
			factory.createLiteralTypeNode(factory.createTrue()),
			factory.createTypeLiteralNode([
				factory.createPropertySignature(
					undefined,
					'type',
					factory.createToken(SyntaxKind.QuestionToken),
					factory.createLiteralTypeNode(
						factory.createTrue(),
					),
				),
			]),
			factory.createKeywordTypeNode(SyntaxKind.UndefinedKeyword),
		]));
	}

	constructor(hoist_candidates: Readonly<hoist_candidates>) {
		super(
			(maybe): maybe is HoistingToHereCandidate => (
				isFunctionDeclaration(maybe)
				&& !!maybe.name
				&& isIdentifier(maybe.name)
				&& maybe.name.text in hoist_candidates
				&& undefined !== maybe.body
			),
			(node) => factory.updateFunctionDeclaration(
				node,
				node.modifiers,
				node.asteriskToken,
				node.name,
				node.typeParameters,
				node.parameters,
				node.type,
				factory.updateBlock(
					node.body,
					[
						factory.createVariableStatement(
							undefined,
							factory.createVariableDeclarationList(
								[...hoist_candidates[node.name.getText()]]
									.map((
										variable_name,
									) => factory.createVariableDeclaration(
										variable_name,
										undefined,
										this.#createHoistedType(),
										factory.createIdentifier('undefined'),
									)),
								NodeFlags.Let,
							),
						),
						...node.body.statements,
					],
				),
			),
		);
	}
}
