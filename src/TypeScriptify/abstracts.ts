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
	TVisitConfig extends Partial<Config> = Partial<Config>,
> {
	protected validate_function_name = /^validate\d+$/;

	readonly visit: ((
		node: TNode,
		config: TVisitConfig,
	) => TReturn);

	readonly passes: ((
		maybe: Node,
		config: Partial<Config>,
	) => maybe is TNode);

	constructor(
		passes: ConditionalVisitor<TNode, TReturn>['passes'],
		visit: ConditionalVisitor<TNode, TReturn, TVisitConfig>['visit'],
	) {
		this.passes = passes;
		this.visit = visit;
	}
}

abstract class ConditionalPreprocessor<
	T extends Node,
	TVisitConfig extends Partial<Config> = Partial<Config>,
> extends ConditionalVisitor<T, void, TVisitConfig> {
	static check(
		maybe: unknown[],
	): asserts maybe is ConditionalPreprocessor<Node>[] {
		if(!maybe.every((
			value,
		) => value instanceof ConditionalPreprocessor)) {
			throw new TypeError(`Array should consist entirely of ${
				ConditionalPreprocessor.name
			} instances`);
		}
	}
}

abstract class ConditionalModification<
	T extends Node,
> extends ConditionalVisitor<T, (Node | false | undefined)> {
	static check(
		maybe: unknown[],
	): asserts maybe is ConditionalModification<Node>[] {
		if(!maybe.every((
			value,
		) => value instanceof ConditionalModification)) {
			throw new TypeError(`Array should consist entirely of ${
				ConditionalModification.name
			} instances`);
		}
	}
}

export {
	ConditionalPreprocessor,
	ConditionalModification,
};
