import type {
	ArrayLiteralExpression,
	PropertyAssignment,
} from 'typescript';
import {
	factory,
	isArrayLiteralExpression,
	isPropertyAssignment,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

type Candidate = (
	& PropertyAssignment
	& {
		initializer: ArrayLiteralExpression,
	}
);

export default class TypecastArrayAsConst extends ConditionalModification<
	Candidate
> {
	constructor() {
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
