import type {
	BinaryExpression,
	IfStatement,
	Node,
	SyntaxKind,
} from '@typescript/typescript6';

import {
	ConditionalModification,
} from '../abstracts.ts';

import type {
	ts,
} from '../../TypeScriptify.ts';

export type PatchIsDefinitelyNotTrueCandidate = (
	& IfStatement
	& {
		expression: (
			& BinaryExpression
			& {
				operatorToken: SyntaxKind.ExclamationEqualsEqualsToken,
				right: SyntaxKind.TrueKeyword,
			}
		),
	}
);

export default class PatchIsDefinitelyNotTrue extends ConditionalModification<
	PatchIsDefinitelyNotTrueCandidate
> {
	#replace_comparison(
		factory: ts['factory'],
		arg: BinaryExpression['left'],
	) {
		return factory.createCallExpression(
			factory.createIdentifier('ajv_utilities__is_definitely_not_true'),
			undefined,
			[arg],
		);
	}

	constructor(
		ts: ts,
		patch_needed: () => void,
	) {
		const {factory} = ts;

		super(
			(node): node is PatchIsDefinitelyNotTrueCandidate => {
				return PatchIsDefinitelyNotTrue.isCandidate(node, ts);
			},
			(node) => {
				patch_needed();

				return factory.updateIfStatement(
					node,
					this.#replace_comparison(factory, node.expression.left),
					node.thenStatement,
					node.elseStatement,
				);
			},
		);
	}

	static isCandidate(
		maybe: Node,
		{
			isIfStatement,
			isBinaryExpression,
			SyntaxKind,
		}: ts,
	): maybe is PatchIsDefinitelyNotTrueCandidate {
		return (
			isIfStatement(maybe)
			&& isBinaryExpression(maybe.expression)
			&& SyntaxKind.ExclamationEqualsEqualsToken === (
				maybe.expression.operatorToken.kind
			)
			&& SyntaxKind.TrueKeyword === maybe.expression.right.kind
		);
	}

	static patch({
		factory,
		SyntaxKind,
	}: ts) {
		return factory.createFunctionDeclaration(
			undefined,
			undefined,
			'ajv_utilities__is_definitely_not_true',
			[
				factory.createTypeParameterDeclaration(
					undefined,
					'T',
				),
			],
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
					'Exclude',
					[
						factory.createTypeReferenceNode('T'),
						factory.createLiteralTypeNode(factory.createTrue()),
					],
				),
			),
			factory.createBlock([
				factory.createReturnStatement(
					factory.createBinaryExpression(
						factory.createIdentifier('maybe'),
						SyntaxKind.ExclamationEqualsEqualsToken,
						factory.createTrue(),
					),
				),
			]),
		);
	}
}
