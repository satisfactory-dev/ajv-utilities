import type {
	Identifier,
	VariableDeclaration,
} from 'typescript';
import {
	factory,
	isIdentifier,
	isVariableDeclaration,
	SyntaxKind,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

import type {
	prepend_with_imports,
} from '../TypeReferences.ts';

type VErrors = (
	& VariableDeclaration
	& {
		name: (
			& Identifier
			& {
				getText(): 'vErrors',
			}
		),
		initializer: {
			kind?: SyntaxKind.NullKeyword,
		},
	}
);

export default class ModifyVErrors extends ConditionalModification<
	VErrors
> {
	constructor(
		prepend_with_imports: prepend_with_imports,
	) {
		super(
			(node): node is VErrors => (
				isVariableDeclaration(node)
				&& isIdentifier(node.name)
				&& 'vErrors' === node.name.getText()
				&& node.initializer?.kind === SyntaxKind.NullKeyword
			),
			(node) => {
				prepend_with_imports.ajv.add('ErrorObject');

				return factory.updateVariableDeclaration(
					node,
					node.name,
					node.exclamationToken,
					factory.createUnionTypeNode([
						factory.createArrayTypeNode(
							factory.createTypeReferenceNode('ErrorObject'),
						),
						factory.createLiteralTypeNode(factory.createNull()),
					]),
					node.initializer,
				);
			},
		);
	}
}
