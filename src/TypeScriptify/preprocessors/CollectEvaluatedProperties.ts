import type {
	BinaryExpression,
	Block,
	ExpressionStatement,
	Identifier,
	IfStatement,
	Node,
	ObjectLiteralExpression,
	PropertyAccessExpression,
	Statement,
	SyntaxKind,
	VariableDeclaration,
	VariableStatement,
} from '@typescript/typescript6';

import {
	ConditionalPreprocessor,
} from '../abstracts.ts';

import type {
	ts,
} from '../../TypeScriptify.ts';

import type {
	specify_types_config,
} from '../types.ts';

export type Collected = Map<
	ContainingCandidate,
	Match
>;

export type Config = {
	type: specify_types_config,
	from: `${string}.ts`,
	properties: [string, ...string[]],
};

export type PropertyCandidate<
	Prop extends `props${number}` = `props${number}`,
> = (
	& ExpressionStatement
	& {
		expression: (
			& BinaryExpression
			& {
				left: (
					& PropertyAccessExpression
					& {
						name: Identifier,
						expression: (
							& Identifier
							& {
								getText(): Prop,
							}
						),
					}
				),
				operatorToken: {
					kind: SyntaxKind.EqualsToken,
				},
				right: {
					kind: SyntaxKind.TrueKeyword,
				},
			}
		),
	}
);

type PropIdentifier<
	Prop extends `props${number}` = `props${number}`,
> = (
	& Identifier
	& {
		getText(): Prop,
	}
);

type EmptyObject = (
	& ObjectLiteralExpression
	& {
		properties: [],
	}
);

type EmptyObjectVariableDeclaration<
	Prop extends `props${number}` = `props${number}`,
> = (
	& VariableDeclaration
	& {
		name: PropIdentifier<Prop>,
		initializer: EmptyObject,
	}
);

type AssignmentCandidate<
	Prop extends `props${number}` = `props${number}`,
> = (
	& ExpressionStatement
	& {
		expression: (
			& BinaryExpression
			& {
				left: PropIdentifier<Prop>,
				operatorToken: {
					kind: SyntaxKind.EqualsToken,
				},
				right: EmptyObject,
			}
		),
	}
);

type ReassignmentCandidate<
	Prop extends `props${number}` = `props${number}`,
> = (
	& ExpressionStatement
	& {
		expression: (
			& BinaryExpression
			& {
				left: (
					& Identifier
					& {
						getText(): Prop,
					}
				),
				operatorToken: {
					kind: SyntaxKind.EqualsToken,
				},
				right: (
					& BinaryExpression
					& {
						left: PropIdentifier<Prop>,
						operatorToken: {
							kind: SyntaxKind.BarBarToken,
						},
						right: EmptyObject,
					}
				),
			}
		),
	}
);

type VariableDeclarationCandidate<
	Prop extends `props${number}` = `props${number}`,
> = (
	& VariableStatement
	& {
		declarationList: {
			declarations: [
				EmptyObjectVariableDeclaration<Prop>,
			],
		},
	}
);

type PossiblyContainingCandidate<
	T extends (
		& Statement[]
		& {
			length: Exclude<number, 0|1>,
		}
	) = (
		& Statement[]
		& {
			length: Exclude<number, 0|1>,
		}
	),
> = (
	& IfStatement
	& {
		thenStatement: (
			& Block
			& {
				statements: T,
			}
		),
	}
);

// we can't currently use leading and trailing rest so this is pretend
export type ContainingCandidate = PossiblyContainingCandidate<[
	ReassignmentCandidate,
	...[PropertyCandidate, ...PropertyCandidate[]],
]>;

export class Match {
	readonly config: Config;

	readonly properties: Set<PropertyCandidate>;

	constructor(
		config: Match['config'],
		properties: Match['properties'],
	) {
		this.config = config;
		this.properties = properties;
	}
}

// oxlint-disable-next-line @stylistic/max-len
export default class CollectEvaluatedProperties extends ConditionalPreprocessor<
	ContainingCandidate
> {
	constructor(
		ts: ts,
		configs: Config[],
		collected: Collected,
	) {
		super(
			(maybe): maybe is ContainingCandidate => {
				if (!CollectEvaluatedProperties.#isPossiblyContainingCandidate(
					maybe,
					ts,
				)) {
					return false;
				}

				let variable_index = -1;
				let assignment_index = -1;
				let reassignment_index = -1;


				variable_index = maybe.thenStatement.statements
					.findLastIndex((maybe) => {
						// oxlint-disable-next-line @stylistic/max-len
						return CollectEvaluatedProperties.#isVariableDeclarationCandidate(
							maybe,
							ts,
						);
					});

				if (-1 === variable_index) {
					assignment_index = maybe.thenStatement.statements
						.findLastIndex((maybe) => {
							// oxlint-disable-next-line @stylistic/max-len
							return CollectEvaluatedProperties.#isAssignmentCandidate(
								maybe,
								ts,
							);
						});
				}

				if (
					-1 === variable_index
					&& -1 === assignment_index
				) {
					reassignment_index = maybe.thenStatement.statements
						.findLastIndex((maybe) => {
							// oxlint-disable-next-line @stylistic/max-len
							return CollectEvaluatedProperties.#isReassignmentCandidate(
								maybe,
								ts,
							);
						});
				}

				if (
					(
						-1 === reassignment_index
						|| reassignment_index === (
							maybe.thenStatement.statements.length - 1
						)
					)
					&& (
						-1 === assignment_index
						|| assignment_index === (
							maybe.thenStatement.statements.length - 1
						)
					)
					&& (
						-1 === variable_index
						|| variable_index === (
							maybe.thenStatement.statements.length
						)
					)
				) {
					return false;
				}

				const use_index = -1 === reassignment_index
					? (
						-1 === assignment_index
							? variable_index
							: assignment_index
					)
					: reassignment_index;

				const maybe_properties = maybe.thenStatement.statements.slice(
					use_index + 1,
				) as [Statement, ...Statement[]];

				let prop: `props${number}`;

				if (-1 === variable_index) {
					prop = (
						maybe.thenStatement.statements[
							use_index
						] as (
							| ReassignmentCandidate
							| AssignmentCandidate
						)
					).expression.left.getText() as `props${number}`;
				} else {
					prop = (
						maybe.thenStatement.statements[
							use_index
						] as VariableDeclarationCandidate
					).declarationList.declarations[
						0
					].name.getText() as `props${number}`;
				}

				if (
					!maybe_properties.every((
						maybe,
					) => CollectEvaluatedProperties.#isPropertyCandidate(
						maybe,
						prop,
						ts,
					))
				) {
					return false;
				}

				const maybe_property_names = maybe_properties.map((
					e,
				) => e.expression.left.name.getText());

				const config = configs.find((maybe) => {
					return (
						maybe.properties.length === maybe_properties.length
						&& maybe.properties.every((possibly, i) => (
							possibly === maybe_property_names[i]
						))
					);
				});

				if (!config) {
					return false;
				}

				collected.set(maybe as ContainingCandidate, new Match(
					config,
					new Set(maybe_properties),
				));

				return true;
			},
			() => {
				return false;
			},
		);
	}

	static #isPossiblyContainingCandidate(
		maybe: Node,
		ts: ts,
	): maybe is PossiblyContainingCandidate {
		const {
			isBlock,
			isIfStatement,
		} = ts;

		return (
			isIfStatement(maybe)
			&& isBlock(maybe.thenStatement)
			&& maybe.thenStatement.statements.length >= 2
		);
	}

	static #isAssignmentCandidate(
		maybe: Node,
		ts: ts,
	): maybe is AssignmentCandidate {
		const {
			isExpressionStatement,
			isBinaryExpression,
			isIdentifier,
			isObjectLiteralExpression,
		} = ts;

		return (
			isExpressionStatement(maybe)
			&& isBinaryExpression(maybe.expression)
			&& isIdentifier(maybe.expression.left)
			&& /^prop\d+/.test(
				maybe.expression.left.text,
			)
			&& (
				ts.SyntaxKind
					.EqualsToken === maybe.expression
					.operatorToken.kind
			)
			&& isObjectLiteralExpression(
				maybe.expression.right,
			)
			&& 0 === (
				maybe.expression.right.properties.length
			)
		);
	}

	static #isReassignmentCandidate(
		maybe: Node,
		ts: ts,
	): maybe is ReassignmentCandidate {
		const {
			isExpressionStatement,
			isBinaryExpression,
			isIdentifier,
			isObjectLiteralExpression,
		} = ts;

		return (
			isExpressionStatement(maybe)
			&& isBinaryExpression(maybe.expression)
			&& isIdentifier(maybe.expression.left)
			&& /^prop\d+/.test(
				maybe.expression.left.text,
			)
			&& (
				ts.SyntaxKind
					.EqualsToken === maybe.expression
					.operatorToken.kind
			)
			&& isBinaryExpression(maybe.expression.right)
			&& isIdentifier(maybe.expression.right.left)
			&& (
				maybe.expression.left
					.text === maybe.expression.right.left
					.getText()
			)
			&& (
				ts.SyntaxKind
					.BarBarToken === maybe.expression
					.right.operatorToken.kind
			)
			&& isObjectLiteralExpression(
				maybe.expression.right.right,
			)
			&& 0 === (
				maybe.expression.right.right.properties.length
			)
		);
	}

	static #isVariableDeclarationCandidate(
		maybe: Node,
		ts: ts,
	): maybe is VariableDeclarationCandidate {
		return (
			ts.isVariableStatement(maybe)
			&& 1 === maybe.declarationList.declarations.length
			&& ts.isIdentifier(maybe.declarationList.declarations[0].name)
			&& /^props\d+/.test(
				maybe.declarationList.declarations[0].name.getText(),
			)
		);
	}

	static #isPropertyCandidate<
		Prop extends `props${number}`,
	>(
		maybe: Node,
		expecting: Prop,
		{
			isBinaryExpression,
			isExpressionStatement,
			isIdentifier,
			isPropertyAccessExpression,
			SyntaxKind,
		}: ts,
	): maybe is PropertyCandidate<Prop> {
		return (
			isExpressionStatement(maybe)
			&& isBinaryExpression(maybe.expression)
			&& isPropertyAccessExpression(maybe.expression.left)
			&& isIdentifier(maybe.expression.left.name)
			&& isIdentifier(maybe.expression.left.expression)
			&& expecting === maybe.expression.left.expression.getText()
			&& SyntaxKind.EqualsToken === maybe.expression.operatorToken.kind
			&& SyntaxKind.TrueKeyword === maybe.expression.right.kind
		);
	}
}
