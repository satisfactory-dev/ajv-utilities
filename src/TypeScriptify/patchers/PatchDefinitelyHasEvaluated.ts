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

import type {
	prepend_with_imports,
} from '../TypeReferences.ts';
import KnownImports from '../known_imports.ts';

type Candidate = (
	& PropertyAccessExpression
	& {
		expression: (
			& Identifier
			& {
				text: `validate${number}`,
			}
		),
		name: (
			& Identifier
			& {
				text: 'evaluated',
			}
		),
		parent: VariableDeclaration,
	}
);

// oxlint-disable-next-line @stylistic/max-len
export default class PatchDefinitelyHasEvaluated extends ConditionalModification<
	Candidate
> {
	constructor(
		prepend_with_imports: prepend_with_imports,
		patch_needed: () => void,
	) {
		super(
			(maybe): maybe is Candidate => (
				isPropertyAccessExpression(maybe)
				&& isIdentifier(maybe.expression)
				&& !!this.validate_function_name.test(
					maybe.expression.text,
				)
				&& 'evaluated' === maybe.name.text
				&& !!maybe.parent
				&& isVariableDeclaration(maybe.parent)
			),
			(node) => {
				KnownImports.Is(prepend_with_imports);
				patch_needed();

				return factory.createCallExpression(
					factory.createIdentifier(
						'ajv_utiltiies__definitely_evaluated',
					),
					undefined,
					[
						node.expression,
					],
				);
			},
		);
	}

	static patch() {
		return factory.createFunctionDeclaration(
			undefined,
			undefined,
			factory.createIdentifier('ajv_utiltiies__definitely_evaluated'),
			[factory.createTypeParameterDeclaration(
				undefined,
				factory.createIdentifier('T'),
			)],
			[factory.createParameterDeclaration(
				undefined,
				undefined,
				factory.createIdentifier('maybe'),
				undefined,
				factory.createTypeReferenceNode(
					factory.createIdentifier('Is'),
					[factory.createTypeReferenceNode('T')],
				),
			)],
			factory.createTypeReferenceNode(
				factory.createIdentifier('Exclude'),
				[
					factory.createIndexedAccessTypeNode(
						factory.createTypeReferenceNode(
							factory.createIdentifier('Is'),
							[factory.createTypeReferenceNode('T')],
						),
						factory.createLiteralTypeNode(
							factory.createStringLiteral('evaluated'),
						),
					),
					factory.createKeywordTypeNode(SyntaxKind.UndefinedKeyword),
				],
			),
			factory.createBlock([
				factory.createIfStatement(
					factory.createBinaryExpression(
						factory.createIdentifier('undefined'),
						factory.createToken(
							SyntaxKind.EqualsEqualsEqualsToken,
						),
						factory.createPropertyAccessExpression(
							factory.createIdentifier('maybe'),
							factory.createIdentifier('evaluated'),
						),
					),
					factory.createThrowStatement(
						factory.createNewExpression(
							factory.createIdentifier('Error'),
							undefined,
							[factory.createTemplateExpression(
								factory.createTemplateHead('', ''),
								[factory.createTemplateSpan(
									factory.createPropertyAccessExpression(
										factory.createIdentifier('maybe'),
										factory.createIdentifier('name'),
									),
									factory.createTemplateTail(
										'.evaluated not set!',
										'.evaluated not set!',
									),
								)],
							)],
						),
					),
				),
				factory.createReturnStatement(
					factory.createPropertyAccessExpression(
						factory.createIdentifier('maybe'),
						factory.createIdentifier('evaluated'),
					),
				),
			]),
		);
	}
}
