import type {
	CallExpression,
	Expression,
	Identifier,
	IfStatement,
	NodeArray,
	PropertyAccessExpression,
} from 'typescript';
import {
	factory,
	isCallExpression,
	isIdentifier,
	isIfStatement,
	isPropertyAccessExpression,
	SyntaxKind,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

type PatchIsArrayCandidate = (
	& IfStatement
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
								getText(): 'Array',
							}
						),
						name: (
							& Identifier
							& {
								getText(): 'isArray',
							}
						),
					}
				),
			}
		),
	}
);

export default class PatchIsArray extends ConditionalModification<
	PatchIsArrayCandidate
> {
	#replace_is_array(
		args?: Expression[]|NodeArray<Expression>,
	) {
		return factory.createCallExpression(
			factory.createIdentifier('ajv_utilities__is_probably_array'),
			undefined,
			args,
		);
	}

	constructor(patch_needed: () => void) {
		super(
			(node): node is PatchIsArrayCandidate => (
				isIfStatement(node)
				&& isCallExpression(node.expression)
				&& isPropertyAccessExpression(node.expression.expression)
				&& isIdentifier(node.expression.expression.expression)
				&& isIdentifier(node.expression.expression.name)
				&& 'Array.isArray' === `${
					node.expression.expression.expression.getText()
				}.${
					node.expression.expression.name.getText()
				}`
			),
			(node) => {
				patch_needed();

				return (
					factory.updateIfStatement(
						node,
						this.#replace_is_array(node.expression.arguments),
						node.thenStatement,
						node.elseStatement,
					)
				);
			},
		);
	}

	static patch() {
		return factory.createFunctionDeclaration(
			undefined,
			undefined,
			'ajv_utilities__is_probably_array',
			undefined,
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
				factory.createArrayTypeNode(
					factory.createKeywordTypeNode(
						SyntaxKind.UnknownKeyword,
					),
				),
			),
			factory.createBlock([
				factory.createReturnStatement(
					factory.createCallExpression(
						factory.createPropertyAccessExpression(
							factory.createIdentifier('Array'),
							factory.createIdentifier('isArray'),
						),
						undefined,
						[
							factory.createIdentifier('maybe'),
						],
					),
				),
			]),
		);
	}
}
