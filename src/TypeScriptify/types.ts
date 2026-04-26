import type {
	ValidateFunction,
} from 'ajv';

import type {
	Aliased,
	NameOnly,
	WithArgs,
} from './TypeReferences.ts';

export type Is<T = unknown> = (
	| ValidateFunction<T>
	| {
		(
			data: unknown,
			dataCxt?: Parameters<ValidateFunction<T>>[1],
		): data is T,
		errors?: ValidateFunction<T>['errors'],
		evaluated?: ValidateFunction<T>['evaluated'],
	}
);

export type specify_types_config = (
	| Exclude<string, ''>
	| {
		name: Exclude<string, ''>,
		as: Exclude<string, ''>,
	}
	| {
		name: Exclude<string, ''>,
		as?: Exclude<string, ''>,
		args: [string, ...string[]],
	}
);

export type specify_types_instance = {
	[key: string]: (
		| NameOnly
		| Aliased
		| WithArgs
	),
};

export type remove_dataCtxKeys = [
	keyof Exclude<Parameters<ValidateFunction>[1], undefined>,
	...(keyof Exclude<
		Parameters<ValidateFunction>[1],
		undefined
	>)[],
];

export type Config = {
	remove_schema: boolean,
	remove_dataCtxKeys: remove_dataCtxKeys,
	specify_types: {
		[key: string]: [specify_types_config, string],
	},
};
