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

import type {
	Collected,
	ContainingCandidate,
} from '../preprocessors/CollectEvaluatedProperties.ts';

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

// oxlint-disable-next-line @stylistic/max-len
export default class PatchEvaluatedPropertiesLike extends ConditionalModification<
	ContainingCandidate
> {
	constructor(
		ts: ts,
		patch_needed: () => void,
		collected_properties: Collected,
	) {
		super(
			(node): node is ContainingCandidate => {
				return (collected_properties as Map<Node, unknown>).has(node);
			},
			(node) => {
				patch_needed();

				return node;
			},
		);
	}

	static patch({
		factory,
		SyntaxKind,
	}: ts) {
		return factory.createTypeAliasDeclaration(
			undefined,
			'ajv_EvaluatedProperties',
			[
				factory.createTypeParameterDeclaration(
					undefined,
					'T',
					factory.createTypeLiteralNode([
						factory.createIndexSignature(
							undefined,
							[
								factory.createParameterDeclaration(
									undefined,
									undefined,
									'key',
									undefined,
									factory.createKeywordTypeNode(
										SyntaxKind.StringKeyword,
									),
								),
							],
							factory.createKeywordTypeNode(
								SyntaxKind.UnknownKeyword,
							),
						),
					]),
				),
			],
			factory.createMappedTypeNode(
				undefined,
				factory.createTypeParameterDeclaration(
					undefined,
					'k',
					factory.createTypeOperatorNode(
						SyntaxKind.KeyOfKeyword,
						factory.createTypeReferenceNode('T'),
					),
				),
				undefined,
				undefined,
				factory.createLiteralTypeNode(
					factory.createTrue(),
				),
				factory.createNodeArray([]),
			),
		);
	}
}
