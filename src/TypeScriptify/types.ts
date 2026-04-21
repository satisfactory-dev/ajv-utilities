import type {
	ValidateFunction,
} from 'ajv';

export type Is<T = unknown> = (
	| ValidateFunction<T>
	| Pick<ValidateFunction<T>, (
		| 'errors'
		| 'evaluated'
	)>
);

export type specify_types_type = (
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
		[key: string]: [specify_types_type, string],
	},
};
