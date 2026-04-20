import type {
	Node,
} from 'typescript';

import type {
	Config,
} from './types.ts';

abstract class ConditionalVisitor<
	TNode extends Node,
	TReturn extends (
		| void
		| (
			| Node // replace the node
			| false // no action needed
			| undefined // remove the node
		)
	),
> {
	protected validate_function_name = /^validate\d+$/;

	readonly visit: ((
		node: TNode,
		config?: Partial<Config>,
	) => TReturn);

	readonly passes: ((
		maybe: Node,
		config?: Partial<Config>,
	) => maybe is TNode);

	constructor(
		passes: ConditionalVisitor<TNode, TReturn>['passes'],
		visit: ConditionalVisitor<TNode, TReturn>['visit'],
	) {
		this.passes = passes;
		this.visit = visit;
	}
}

abstract class ConditionalPreprocessor<
	T extends Node,
> extends ConditionalVisitor<T, void> {
}

abstract class ConditionalModification<
	T extends Node,
> extends ConditionalVisitor<T, (Node | false | undefined)> {
}

export {
	ConditionalPreprocessor,
	ConditionalModification,
};
