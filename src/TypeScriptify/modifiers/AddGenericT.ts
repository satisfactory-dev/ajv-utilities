import type {
	FunctionDeclaration,
	Identifier,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

import type {
	specify_types_instance,
} from '../types.ts';

import {
	GenericT,
} from '../TypeReferences.ts';

import type {
	ts,
} from '../../TypeScriptify.ts';

type Candidate = (
	& FunctionDeclaration
	& {
		name: (
			& Identifier
			& {
				text: `validate${number}`,
			}
		),
	}
);

export default class AddGenericT extends ConditionalModification<
	Candidate
> {
	constructor(
		{
			factory,
			isFunctionDeclaration,
		}: ts,
		specified_types: specify_types_instance,
	) {
		super(
			(maybe): maybe is Candidate => (
				isFunctionDeclaration(maybe)
				&& !!maybe.name
				&& this.validate_function_name.test(maybe.name.text)
				&& maybe.name.text in specified_types
			),
			(node) => {
				const function_name = node.name.text;

				if (
					!(function_name in specified_types)
					|| !(specified_types[function_name] instanceof GenericT)
				) {
					return false;
				}

				return factory.updateFunctionDeclaration(
					node,
					node.modifiers,
					node.asteriskToken,
					node.name,
					[factory.createTypeParameterDeclaration(
						undefined,
						'T',
						factory.createUnionTypeNode(specified_types[
							function_name
						].possibilities.map((
							possibility,
						) => factory.createTypeReferenceNode(possibility))),
						factory.createUnionTypeNode(specified_types[
							function_name
						].possibilities.map((
							possibility,
						) => factory.createTypeReferenceNode(possibility))),
					)],
					node.parameters,
					node.type,
					node.body,
				);
			},
		);
	}
}
