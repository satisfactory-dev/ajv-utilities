import type {
	FunctionDeclaration,
	Identifier,
	NodeArray,
	VariableDeclaration,
	VariableDeclarationList,
	VariableStatement,
} from '@typescript/typescript6';

import {
	ConditionalModification,
} from '../abstracts.ts';

import type {
	ts,
} from '../../TypeScriptify.ts';

import type {
	prepend_with_imports,
} from '../TypeReferences.ts';

import KnownImports from '../known_imports.ts';

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
										text: `props${number}`,
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
	constructor(
		{
			factory,
			isFunctionDeclaration,
			isIdentifier,
			isVariableDeclaration,
			isVariableStatement,
			SyntaxKind,
		}: ts,
		hoist_candidates: hoist_candidates,
	) {
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
							].name.text,
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
	#createHoistedType(
		{
			factory,
			SyntaxKind,
		}: ts,
	) {
		return factory.createParenthesizedType(factory.createUnionTypeNode([
			factory.createTypeReferenceNode('EvaluatedProperties'),
			factory.createKeywordTypeNode(SyntaxKind.UndefinedKeyword),
		]));
	}

	constructor(
		ts: ts,
		hoist_candidates: Readonly<hoist_candidates>,
		prepend_with_imports: prepend_with_imports,
	) {
		const {
			factory,
			isFunctionDeclaration,
			isIdentifier,
			NodeFlags,
		} = ts;

		super(
			(maybe): maybe is HoistingToHereCandidate => (
				isFunctionDeclaration(maybe)
				&& !!maybe.name
				&& isIdentifier(maybe.name)
				&& maybe.name.text in hoist_candidates
				&& undefined !== maybe.body
			),
			(node) => {
				KnownImports.EvaluatedProperties(ts, prepend_with_imports);

				return factory.updateFunctionDeclaration(
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
										this.#createHoistedType(ts),
										factory.createIdentifier('undefined'),
									)),
								NodeFlags.Let,
							),
						),
						...node.body.statements,
					],
				),
			)},
		);
	}
}
