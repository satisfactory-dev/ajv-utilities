import type {
	Identifier,
	PropertyAccessExpression,
	VariableDeclaration,
} from 'typescript';
import {
	factory,
	isIdentifier,
	isPropertyAccessExpression,
	isVariableDeclaration,
	SyntaxKind,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

type Candidate_hasOwnProperty = (
	& VariableDeclaration
	& {
		name: (
			& Identifier
			& {
				text: `func${number}`,
			}
		),
		initializer: (
			& PropertyAccessExpression
			& {
				expression: (
					& PropertyAccessExpression
					& {
						expression: (
							& Identifier
							& {
								text: 'Object',
							}
						),
						name: (
							& Identifier
							& {
								text: 'prototype',
							}
						),
					}
				),
				name: (
					& Identifier
					& {
						text: 'hasOwnProperty',
					}
				),
			}
		),
	}
);

// oxlint-disable-next-line @stylistic/max-len
export default class UnboundThis_hasOwnProperty extends ConditionalModification<
	Candidate_hasOwnProperty
> {
	constructor() {
		super(
			(maybe): maybe is Candidate_hasOwnProperty => (
				isVariableDeclaration(maybe)
				&& isIdentifier(maybe.name)
				&& /^func\d+$/.test(maybe.name.text)
				&& !!maybe.initializer
				&& isPropertyAccessExpression(maybe.initializer)
				&& isPropertyAccessExpression(maybe.initializer.expression)
				&& isIdentifier(maybe.initializer.expression.expression)
				&& 'Object' === maybe.initializer.expression.expression.text
				&& isIdentifier(maybe.initializer.expression.name)
				&& 'prototype' === maybe.initializer.expression.name.text
				&& isIdentifier(maybe.initializer.name)
				&& 'hasOwnProperty' === maybe.initializer.name.text
			),
			(node) => factory.updateVariableDeclaration(
				node,
				node.name,
				node.exclamationToken,
				node.type,
				factory.createObjectLiteralExpression([
					factory.createPropertyAssignment(
						'call',
						factory.createArrowFunction(
							undefined,
							undefined,
							[
								factory.createParameterDeclaration(
									undefined,
									undefined,
									'instance',
									undefined,
									factory.createKeywordTypeNode(
										SyntaxKind.ObjectKeyword,
									),
								),
								factory.createParameterDeclaration(
									undefined,
									undefined,
									'property',
									undefined,
									factory.createKeywordTypeNode(
										SyntaxKind.StringKeyword,
									),
								),
							],
							undefined,
							factory.createToken(
								SyntaxKind.EqualsGreaterThanToken,
							),
							factory.createCallExpression(
								factory.createPropertyAccessExpression(
									factory.updatePropertyAccessExpression(
										node.initializer,
										node.initializer.expression,
										node.initializer.name,
									),
									factory.createIdentifier('call'),
								),
								undefined,
								[
									factory.createIdentifier('instance'),
									factory.createIdentifier('property'),
								],
							),
						),
					),
				]),
			),
		);
	}
}
