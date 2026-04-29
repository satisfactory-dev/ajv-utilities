import type {
	ArrayTypeNode,
	ImportSpecifier,
	IndexedAccessTypeNode,
	TupleTypeNode,
	TypeReferenceNode,
} from 'typescript';
import {
	createPrinter,
	createSourceFile,
	EmitHint,
	factory,
	ScriptTarget,
} from 'typescript';

import type {
	as_array_config,
	specify_types_config,
} from './types.ts';

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
	) = (
		| TypeReferenceNode
		| IndexedAccessTypeNode
		| TupleTypeNode
		| ArrayTypeNode
	),
> {
	toTypeResult(): TypeResult;

	toString(): string;
}

function to_string(instance: HasOutput) {
	const printer = createPrinter({
		omitTrailingSemicolon: true,
	});

	return printer.printNode(
		EmitHint.Unspecified,
		instance.toTypeResult(),
		createSourceFile('foo.ts', '', ScriptTarget.ESNext),
	);
}

abstract class Type {
	readonly name: Exclude<string, ''>;

	#id: Exclude<string, ''> | undefined;

	get id(): Exclude<string, ''> {
		if (!this.#id) {
			this.#id = this.toId();
		}

		return this.#id;
	}

	constructor(name: Exclude<string, ''>) {
		this.name = name;
	}

	protected abstract toId(): string;

	abstract toImportSpecifier(): ImportSpecifier;

	abstract withArgs(args: [string, ...string[]]): WithArgs;

	abstract withSubTypeChain(chain: [string, ...string[]]): WithSubTypeChain;

	abstract withArray(config: as_array_config): WithArray;
}

export class NameOnly extends Type implements HasOutput<TypeReferenceNode> {
	protected toId(): string {
		return this.name;
	}

	toImportSpecifier(): ImportSpecifier {
		return factory.createImportSpecifier(
			false,
			undefined,
			factory.createIdentifier(this.name),
		);
	}

	toTypeResult(): TypeReferenceNode {
		return factory.createTypeReferenceNode(this.name);
	}

	withArgs(args: [string, ...string[]]): WithArgs {
		return new WithArgs(this.name, args);
	}

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

	toString() {
		return to_string(this);
	}
}

export class Aliased extends Type implements HasOutput<TypeReferenceNode> {
	readonly as: Exclude<string, ''>;

	constructor(name: Aliased['name'], as: Aliased['as']) {
		super(name);

		this.as = as;
	}

	protected toId(): string {
		return `${this.name} as ${this.as}`;
	}

	toImportSpecifier(): ImportSpecifier {
		return factory.createImportSpecifier(
			false,
			factory.createIdentifier(this.name),
			factory.createIdentifier(this.as),
		);
	}

	toTypeResult(): TypeReferenceNode {
		return factory.createTypeReferenceNode(this.as);
	}

	withArgs(args: [string, ...string[]]): WithArgs {
		return new WithArgs(this.name, args, this.as);
	}

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

	toString() {
		return to_string(this);
	}
}

class WithArgs implements HasOutput<TypeReferenceNode> {
	readonly name: Exclude<string, ''>;

	readonly as: Exclude<string, ''> | undefined;

	readonly args: [string, ...string[]];

	constructor(
		name: WithArgs['name'],
		args: WithArgs['args'],
		as?: Exclude<WithArgs['as'], undefined>,
	) {
		this.name = name;
		this.args = args;
		this.as = as;
	}

	toTypeResult() {
		return factory.createTypeReferenceNode(
			this.as || this.name,
			this.args.map((value) => factory.createLiteralTypeNode(
				factory.createStringLiteral(value),
			)),
		);
	}

	toString() {
		return to_string(this);
	}

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

class WithSubTypeChain implements HasOutput<IndexedAccessTypeNode> {
	#parent: HasOutput;

	readonly sub_type_chain: [string, ...string[]];

	constructor(
		parent: HasOutput,
		sub_type_chain: [string, ...string[]],
	) {
		this.#parent = parent;
		this.sub_type_chain = sub_type_chain;
	}

	withArray(config: as_array_config): WithArray {
		return new WithArray(this.#parent, config);
	}

	toTypeResult() {
		const [
			first,
			...remaining
		] = this.sub_type_chain;

		let access = factory.createIndexedAccessTypeNode(
			this.#parent.toTypeResult(),
			factory.createLiteralTypeNode(factory.createStringLiteral(
				first,
			)),
		);

		for (const sub_type of remaining) {
			access = factory.createIndexedAccessTypeNode(
				access,
				factory.createLiteralTypeNode(factory.createStringLiteral(
					sub_type,
				)),
			);
		}

		return access;
	}
}

class WithArray implements HasOutput<TupleTypeNode | ArrayTypeNode> {
	#parent: HasOutput;

	readonly as_array: as_array_config;

	constructor(
		parent: HasOutput,
		as_array: as_array_config,
	) {
		this.#parent = parent;
		this.as_array = as_array;
	}

	toTypeResult() {
		if (true === this.as_array || this.as_array.minimum < 1) {
			return factory.createArrayTypeNode(this.#parent.toTypeResult());
		}

		const args: ReturnType<HasOutput['toTypeResult']>[] = [];

		const minimum = Math.max(1, this.as_array.minimum);

		for (let i = 0; i < minimum; ++i) {
			args.push(this.#parent.toTypeResult());
		}

		return factory.createTupleTypeNode(
			[
				...args,
				factory.createRestTypeNode(
					factory.createArrayTypeNode(this.#parent.toTypeResult()),
				),
			],
		);
	}
}

export class Types {
	list_of_types: [
		(
			| NameOnly
			| Aliased
		),
		...(
			| NameOnly
			| Aliased
		)[],
	] | undefined = undefined;

	get size() {
		return this.list_of_types ? this.list_of_types.length : 0;
	}

	#is_object_type(
		type: specify_types_config,
	): type is Exclude<specify_types_config, string> {
		return 'string' !== typeof type;
	}

	add<T extends specify_types_config>(type: T) {
		const is_object = this.#is_object_type(type);

		let as_object = (
			!is_object
				? new NameOnly(type)
				: (
					'as' in type && type.as
						? new Aliased(type.name, type.as)
						: new NameOnly(type.name)
				)
		);

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

		if (is_object) {
			let result: (
				| Aliased
				| NameOnly
				| WithArgs
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

	* [Symbol.iterator]() {
		if (!this.list_of_types) {
			return;
		}

		for (const type of this.list_of_types) {
			yield type;
		}
	}
}

export type {
	WithArgs,
	WithSubTypeChain,
	WithArray,
};
