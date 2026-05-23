import type {
	ArrayTypeNode,
	ConditionalTypeNode,
	ImportSpecifier,
	IndexedAccessTypeNode,
	KeywordTypeNode,
	ParenthesizedTypeNode,
	TupleTypeNode,
	TypeReferenceNode,
} from 'typescript';

import type {
	as_array_config,
	specify_type_without_nested,
	specify_types_config,
} from './types.ts';

import type {
	ts,
} from '../TypeScriptify.ts';

export type prepend_with_imports = {
	[key: string]: Types,
	ajv: Types,
	'@satisfactory-dev/ajv-utilities': Types,
};

interface HasOutput<
	TypeResult extends (
		| TypeReferenceNode
		| IndexedAccessTypeNode
		| TupleTypeNode
		| ArrayTypeNode
		| ConditionalTypeNode
	) = (
		| TypeReferenceNode
		| IndexedAccessTypeNode
		| TupleTypeNode
		| ArrayTypeNode
		| ConditionalTypeNode
	),
> {
	readonly ts: ts;

	toTypeResult(): TypeResult;
}

export function to_string(
	ts: ts,
	instance: HasOutput,
) {
	const printer = ts.createPrinter({
		omitTrailingSemicolon: true,
	});

	return printer.printNode(
		ts.EmitHint.Unspecified,
		instance.toTypeResult(),
		ts.createSourceFile('foo.ts', '', ts.ScriptTarget.ESNext),
	);
}

abstract class AbstractOutput<
	TypeResult extends (
		| TypeReferenceNode
		| IndexedAccessTypeNode
		| TupleTypeNode
		| ArrayTypeNode
	),
> implements HasOutput<TypeResult> {
	readonly ts: ts;

	constructor(ts: ts) {
		this.ts = ts;
	}

	abstract toTypeResult(): TypeResult;

	withSubTypeChain(
		sub_type_chain: [string, ...string[]],
	): WithSubTypeChain {
		return new WithSubTypeChain(
			this,
			sub_type_chain,
		);
	}

	withArray(
		config: as_array_config,
	): WithArray {
		return new WithArray(
			this,
			config,
		);
	}
}

export class Type<
	As extends (
		Exclude<string, ''> | undefined
	) = (
		Exclude<string, ''> | undefined
	),
> extends AbstractOutput<TypeReferenceNode> {
	readonly name: Exclude<string, ''>;

	readonly args: [string, ...string[]] | undefined;

	readonly as: As;

	get id(): Exclude<string, ''> {
		return this.as ? `${this.name} as ${this.as}` : this.name;
	}

	constructor(
		ts: ts,
		name: Exclude<string, ''>,
		as: As,
		args?: [string, ...string[]],
	) {
		super(ts);

		this.name = name;
		this.as = as;
		this.args = args;
	}

	toImportSpecifier(): ImportSpecifier {
		if (this.as) {
			return this.ts.factory.createImportSpecifier(
				false,
				this.ts.factory.createIdentifier(this.name),
				this.ts.factory.createIdentifier(this.as),
			);
		}

		return this.ts.factory.createImportSpecifier(
			false,
			undefined,
			this.ts.factory.createIdentifier(this.name),
		);
	}

	toTypeResult(): TypeReferenceNode {
		return this.ts.factory.createTypeReferenceNode(
			this.as || this.name,
			this.args?.map((value) => this.ts.factory.createLiteralTypeNode(
				this.ts.factory.createStringLiteral(value),
			)),
		);
	}

	withArgs(args: [string, ...string[]]) {
		return new Type(this.ts, this.name, this.as, args);
	}
}

class WithSubTypeChain extends AbstractOutput<IndexedAccessTypeNode> {
	#parent: HasOutput;

	readonly sub_type_chain: [string, ...string[]];

	constructor(
		parent: HasOutput,
		sub_type_chain: [string, ...string[]],
	) {
		super(parent.ts);

		this.#parent = parent;
		this.sub_type_chain = sub_type_chain;
	}

	toTypeResult() {
		const [
			first,
			...remaining
		] = this.sub_type_chain;

		let access = this.ts.factory.createIndexedAccessTypeNode(
			this.#parent.toTypeResult(),
			this.ts.factory.createLiteralTypeNode(
				this.ts.factory.createStringLiteral(
					first,
				),
			),
		);

		for (const sub_type of remaining) {
			access = this.ts.factory.createIndexedAccessTypeNode(
				access,
				this.ts.factory.createLiteralTypeNode(
					this.ts.factory.createStringLiteral(
						sub_type,
					),
				),
			);
		}

		return access;
	}
}

class WithArray extends AbstractOutput<TupleTypeNode | ArrayTypeNode> {
	#parent: HasOutput;

	readonly as_array: as_array_config;

	constructor(
		parent: HasOutput,
		as_array: as_array_config,
	) {
		super(parent.ts);

		this.#parent = parent;
		this.as_array = as_array;
	}

	toTypeResult() {
		if (true === this.as_array || this.as_array.minimum < 1) {
			return this.ts.factory.createArrayTypeNode(
				this.#parent.toTypeResult(),
			);
		}

		const args: ReturnType<HasOutput['toTypeResult']>[] = [];

		const minimum = Math.max(1, this.as_array.minimum);

		for (let i = 0; i < minimum; ++i) {
			args.push(this.#parent.toTypeResult());
		}

		return this.ts.factory.createTupleTypeNode(
			[
				...args,
				this.ts.factory.createRestTypeNode(
					this.ts.factory.createArrayTypeNode(
						this.#parent.toTypeResult(),
					),
				),
			],
		);
	}
}

export class GenericT implements HasOutput<TypeReferenceNode> {
	readonly possibilities: [string, ...string[]];

	readonly ts: ts;

	constructor(
		ts: ts,
		possibilities: [string, ...string[]],
	) {
		this.ts = ts;

		this.possibilities = [
			...possibilities,
		].sort() as [string, ...string[]];
	}

	toTypeResult() {
		return this.ts.factory.createTypeReferenceNode('T');
	}
}

export class ConditionalPredicate implements HasOutput<ConditionalTypeNode> {
	readonly ts: ts;

	#property: 'parentDataProperty';

	#spec: {
		[key: string]: specify_type_without_nested,
	};

	constructor(
		ts: ts,
		property: 'parentDataProperty',
		spec: {
			[key: string]: specify_type_without_nested,
		},
	) {
		this.ts = ts;
		this.#property = property;
		this.#spec = spec;
	}

	toTypeResult() {
		const [
			first,
			...remaining
		] = Object.entries(this.#spec);

		const checkType = () => this.ts.factory.createTypeQueryNode(
			this.ts.factory.createIdentifier(this.#property),
		);

		let when_false: (
			| KeywordTypeNode
			| ParenthesizedTypeNode
		) = this.ts.factory.createKeywordTypeNode(
			this.ts.SyntaxKind.NeverKeyword,
		);

		for (const possibility of remaining) {
			when_false = this.ts.factory.createParenthesizedType(
				this.ts.factory.createConditionalTypeNode(
					checkType(),
					this.ts.factory.createLiteralTypeNode(
						this.ts.factory.createStringLiteral(
							possibility[0],
						),
					),
					Types.toObject(
						this.ts,
						possibility[1][0],
					).toTypeResult(),
					when_false,
				),
			);
		}

		return this.ts.factory.createConditionalTypeNode(
			checkType(),
			this.ts.factory.createLiteralTypeNode(
				this.ts.factory.createStringLiteral(
					first[0],
				),
			),
			Types.toObject(
				this.ts,
				first[1][0],
			).toTypeResult(),
			when_false,
		);
	}
}

export class Types {
	list_of_types: [
		(
			| Type<Exclude<string, ''>>
			| Type<undefined>
		),
		...(
			| Type<Exclude<string, ''>>
			| Type<undefined>
		)[],
	] | undefined = undefined;

	get size() {
		return this.list_of_types ? this.list_of_types.length : 0;
	}

	static #is_object_type(
		type: specify_types_config,
	): type is Exclude<specify_types_config, string> {
		return 'string' !== typeof type;
	}

	add<T extends specify_types_config>(
		ts: ts,
		type: T,
	) {
		return Types.toObject(
			ts,
			type,
			(as_object) => {
				if (undefined === this.list_of_types) {
					this.list_of_types = [as_object];
				} else {
					const maybe = this.list_of_types.find((
						maybe,
					) => maybe.id === as_object.id);

					if (!maybe) {
						this.list_of_types.push(as_object);
					} else {
						as_object = maybe;
					}
				}

				return as_object;
			},
		);
	}

	* [Symbol.iterator]() {
		if (!this.list_of_types) {
			return;
		}

		for (const type of this.list_of_types) {
			yield type;
		}
	}

	static toObject(
		ts: ts,
		type: specify_types_config,
		juggle?: (as_object: (
			| Type<Exclude<string, ''>>
			| Type<undefined>
		)) => (
			| Type<Exclude<string, ''>>
			| Type<undefined>
		),
	) {
		const is_object = this.#is_object_type(type);

		let as_object: (
			| Type<Exclude<string, ''>>
			| Type<undefined>
		) = (
			!is_object
				? new Type(ts, type, undefined)
				: (
					'as' in type && type.as
						? new Type(ts, type.name, type.as)
						: new Type(ts, type.name, undefined)
				)
		);

		if (juggle) {
			as_object = juggle(as_object);
		}

		if (is_object) {
			let result: (
				| Type
				| WithSubTypeChain
				| WithArray
			) = as_object;

			if ('args' in type) {
				result = result.withArgs(type.args);
			}

			if ('sub_type_chain' in type && !!type.sub_type_chain) {
				result = result.withSubTypeChain(type.sub_type_chain);
			}

			if ('as_array' in type && !!type.as_array) {
				result = result.withArray(type.as_array);
			}

			return result;
		}

		return as_object;
	}
}

export type {
	WithSubTypeChain,
	WithArray,
};
