import type {
	VariableDeclarationList,
	VariableStatement,
} from 'typescript';
import {
	factory,
	isIdentifier,
	isVariableStatement,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

type RemoveSchemaDeclarationCandiate = (
	& VariableStatement
	& {
		modifiers: undefined,
		declarationList: (
			& VariableDeclarationList
			& {
				length: Exclude<number, 0>,
			}
		),
	}
);

export default class RemoveSchemaDeclaration extends ConditionalModification<
	RemoveSchemaDeclarationCandiate
> {
	constructor() {
		super(
			(node, config): node is RemoveSchemaDeclarationCandiate => (
				!!config
				&& !!config.remove_schema
				&& isVariableStatement(node)
				&& !node.modifiers
				&& node.declarationList.declarations.length > 0
			),
			(node) => {
				const was = node.declarationList.declarations.length;

				const declarartions = node.declarationList.declarations
					.filter((
						maybe,
					) => {
						return (
							!isIdentifier(maybe.name)
							|| !/^schema\d+$/.test(maybe.name.getText())
						);
					});

				if (was !== declarartions.length) {
					if (declarartions.length < 1) {
						return undefined;
					} else {
						return (
							factory.updateVariableStatement(
								node,
								node.modifiers,
								factory.updateVariableDeclarationList(
									node.declarationList,
									declarartions,
								),
							)
						);
					}
				}

				return false;
			},
		);
	}
}
