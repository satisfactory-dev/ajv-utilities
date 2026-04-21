import type {
	ImportSpecifier,
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
	specify_types_config,
} from './types.ts';

export type prepend_with_imports = {
	[key: string]: Types,
	ajv: Types,
	'@satisfactory-dev/ajv-utilities': Types,
};

interface HasOutput {
	toTypeReferenceNode(): TypeReferenceNode;

	toString(): string;
}

function to_string(instance: HasOutput) {
	const printer = createPrinter({
		omitTrailingSemicolon: true,
	});

	return printer.printNode(
		EmitHint.Unspecified,
		instance.toTypeReferenceNode(),
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
}

export class NameOnly extends Type implements HasOutput {
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

	toTypeReferenceNode(): TypeReferenceNode {
		return factory.createTypeReferenceNode(this.name);
	}

	withArgs(args: [string, ...string[]]): WithArgs {
		return new WithArgs(this.name, args);
	}

	toString() {
		return to_string(this);
	}
}

export class Aliased extends Type {
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

	toTypeReferenceNode(): TypeReferenceNode {
		return factory.createTypeReferenceNode(this.as);
	}

	withArgs(args: [string, ...string[]]): WithArgs {
		return new WithArgs(this.name, args, this.as);
	}

	toString() {
		return to_string(this);
	}
}

class WithArgs implements HasOutput {
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

	toTypeReferenceNode(): TypeReferenceNode {
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

		return is_object && 'args' in type
			? as_object.withArgs(type.args)
			: as_object;
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
};
