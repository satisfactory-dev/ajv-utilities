import type {
	ArrayLiteralExpression,
	PropertyAssignment,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

import type {
	ts,
} from '../../TypeScriptify.ts';

type Candidate = (
	& PropertyAssignment
	& {
		initializer: ArrayLiteralExpression,
	}
);

export default class TypecastArrayAsConst extends ConditionalModification<
	Candidate
> {
	constructor({
		factory,
		isArrayLiteralExpression,
		isPropertyAssignment,
	}: ts) {
		super(
			(maybe): maybe is Candidate => (
				isPropertyAssignment(maybe)
				&& isArrayLiteralExpression(maybe.initializer)
			),
			(node) => factory.updatePropertyAssignment(
				node,
				node.name,
				factory.createAsExpression(
					node.initializer,
					factory.createTypeReferenceNode(
						factory.createIdentifier('const'),
					),
				),
			),
		);
	}
}
