import type {
	Identifier,
	NodeArray,
	ObjectLiteralExpression,
	PropertyAssignment,
	VariableDeclaration,
} from 'typescript';
import {
	factory,
	isIdentifier,
	isObjectLiteralExpression,
	isPropertyAssignment,
	isVariableDeclaration,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';
import KnownImports from '../known_imports.ts';

import type {
	prepend_with_imports,
} from '../TypeReferences.ts';

type Candidate = (
	& VariableDeclaration
	& {
		name: (
			& Identifier
			& {
				text: `wrapper${number}`,
			}
		),
		initializer: (
			& ObjectLiteralExpression
			& {
				properties: (
					& NodeArray<PropertyAssignment>
					& {
						length: 1,
						0: (
							& PropertyAssignment
							& {
								name: (
									& Identifier
									& {
										text: 'validate',
									}
								),
								initializer: (
									& Identifier
									& {
										text: `validate${number}`,
									}
								),
							}
						),
					}
				),
			}
		),
	}
);

export default class ModifyValidateWrapper extends ConditionalModification<
	Candidate
> {
	constructor(prepend_with_imports: prepend_with_imports) {
		super(
			(maybe): maybe is Candidate => (
				isVariableDeclaration(maybe)
				&& isIdentifier(maybe.name)
				&& /^wrapper\d+$/.test(maybe.name.text)
				&& !!maybe.initializer
				&& isObjectLiteralExpression(maybe.initializer)
				&& 1 === maybe.initializer.properties.length
				&& isPropertyAssignment(maybe.initializer.properties[0])
				&& isIdentifier(
					maybe.initializer.properties[0].name,
				)
				&& 'validate' === maybe.initializer.properties[0].name.text
				&& isIdentifier(
					maybe.initializer.properties[0].initializer,
				)
				&& this.validate_function_name.test(
					maybe.initializer.properties[0].initializer.text,
				)
			),
			(node) => {
				KnownImports.Is(prepend_with_imports);

				return factory.updateVariableDeclaration(
					node,
					node.name,
					node.exclamationToken,
					factory.createTypeLiteralNode([
						factory.createPropertySignature(
							undefined,
							'validate',
							undefined,
							factory.createTypeReferenceNode('Is'),
						),
					]),
					node.initializer,
				);
			},
		);
	}
}
