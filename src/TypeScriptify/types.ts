import type {
	ValidateFunction,
} from 'ajv';

export type prepend_with_imports = {
	[key: string]: Set<string>,
	ajv: Set<string>,
	'@satisfactory-dev/ajv-utilities': Set<string>,
};

export type Is<T = unknown> = (
	| ValidateFunction<T>
	| Pick<ValidateFunction<T>, (
		| 'errors'
		| 'evaluated'
	)>
);

export type Config = {
	remove_schema: boolean,
	remove_dataCtxKeys: [
		keyof Exclude<Parameters<ValidateFunction>[1], undefined>,
		...(keyof Exclude<
			Parameters<ValidateFunction>[1],
			undefined
		>)[],
	],
	specify_types: {
		[key: string]: [string, string],
	},
};
