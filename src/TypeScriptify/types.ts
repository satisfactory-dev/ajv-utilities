import type {
	ValidateFunction,
} from 'ajv';

import type {
	Type,
	WithArray,
	WithSubTypeChain,
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

export type as_array_config = (
	| true
	| {
		minimum: number,
	}
);

export type specify_types_config = (
	| Exclude<string, ''>
	| {
		name: Exclude<string, ''>,
		as: Exclude<string, ''>,
		sub_type_chain?: [string, ...string[]],
		as_array?: as_array_config,
	}
	| {
		name: Exclude<string, ''>,
		as_array: as_array_config,
	}
	| {
		name: Exclude<string, ''>,
		sub_type_chain: [string, ...string[]],
		as_array?: as_array_config,
	}
	| {
		name: Exclude<string, ''>,
		as?: Exclude<string, ''>,
		args: [string, ...string[]],
		sub_type_chain?: [string, ...string[]],
		as_array?: as_array_config,
	}
);

export type specify_types_instance = {
	[key: string]: (
		| Type
		| WithSubTypeChain
		| WithArray
	),
};

export type remove_dataCtxKeys = [
	keyof Exclude<Parameters<ValidateFunction>[1], undefined>,
	...(keyof Exclude<
		Parameters<ValidateFunction>[1],
		undefined
	>)[],
];

type specify_type_without_nested = [
	specify_types_config, // actual type information
	string, // path to source relative to destination file or npm module
];

export type specify_type_with_nested = [
	...specify_type_without_nested,
	[
		specify_type_nested,
		...specify_type_nested[],
	],
];

type specify_type = (
	| specify_type_without_nested
	| specify_type_with_nested
);

export type specify_type_nested = (
	| [
		specify_types_config,
		string,
		Partial<{
			instancePath: string,
			instancePath_partial: string,
			parentDataProperty: string,
		}>,
	]
	| [
		specify_types_config,
		string,
		Partial<{
			instancePath: string,
			instancePath_partial: string,
			parentDataProperty: string,
		}>,
		[
			specify_type_nested,
			...specify_type_nested[],
		],
	]
);

export type Config = {
	remove_schema: boolean,
	remove_dataCtxKeys: (
		| remove_dataCtxKeys
		| {[key: string]: remove_dataCtxKeys}
	),
	specify_types: {
		[key: string]: specify_type,
	},
	specify_types_by_validate_function_name: {
		[key: `validate${number}`]: specify_type,
	},
	specify_types_by_export_name: {
		[key: string]: specify_type,
	},
};
