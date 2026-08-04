import type {
	BinaryExpression,
	IfStatement,
	SyntaxKind,
} from '@typescript/typescript6';

import {
	ConditionalModification,
} from '../abstracts.ts';

import type {
	ts,
} from '../../TypeScriptify.ts';

type PatchIsDefinitelyNotTrueCandidate = (
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
		{
			factory,
			isIfStatement,
			isBinaryExpression,
			SyntaxKind,
		}: ts,
		patch_needed: () => void,
	) {
		super(
			(node): node is PatchIsDefinitelyNotTrueCandidate => (
				isIfStatement(node)
				&& isBinaryExpression(node.expression)
				&& SyntaxKind.ExclamationEqualsEqualsToken === (
					node.expression.operatorToken.kind
				)
				&& SyntaxKind.TrueKeyword === node.expression.right.kind
			),
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
