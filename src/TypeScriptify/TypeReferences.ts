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
	specify_types_type,
} from './types.ts';

export type prepend_with_imports = {
	[key: string]: Types,
	ajv: Types,
	'@satisfactory-dev/ajv-utilities': Types,
};

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

	abstract toTypeReferenceNode(): TypeReferenceNode;

	toString() {
		const printer = createPrinter({
			omitTrailingSemicolon: true,
		});

		return printer.printNode(
			EmitHint.Unspecified,
			this.toTypeReferenceNode(),
			createSourceFile('foo.ts', '', ScriptTarget.ESNext),
		);
	}
}

class NameOnly extends Type {
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
}

class Aliased extends Type {
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
}

class WithArgs extends Type {
	readonly as: Exclude<string, ''> | undefined;

	readonly args: [string, ...string[]];

	constructor(
		name: WithArgs['name'],
		args: WithArgs['args'],
		as?: Exclude<WithArgs['as'], undefined>,
	) {
		super(name);

		this.args = args;
		this.as = as;
	}

	protected toId(): string {
		return `${
			this.as
				? `${this.name} as ${this.as}`
				: this.name
		}`;
	}

	toImportSpecifier(): ImportSpecifier {
		return factory.createImportSpecifier(
			false,
			(
				this.as
					? factory.createIdentifier(this.name)
					: undefined
			),
			factory.createIdentifier(this.as || this.name),
		);
	}

	toTypeReferenceNode(): TypeReferenceNode {
		return factory.createTypeReferenceNode(
			this.as || this.name,
			this.args.map((value) => factory.createLiteralTypeNode(
				factory.createStringLiteral(value),
			)),
		);
	}
}

export class Types {
	list_of_types: [
		Type,
		...Type[],
	] | undefined = undefined;

	get size() {
		return this.list_of_types ? this.list_of_types.length : 0;
	}

	add(type: specify_types_type): Type {
		let as_object: Type = (
			'string' === typeof type
				? new NameOnly(type)
				: (
					'args' in type
						? new WithArgs(type.name, type.args, type?.as)
						: new Aliased(type.name, type.as)
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
	Type,
};
