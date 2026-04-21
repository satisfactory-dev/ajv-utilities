type const_string = {type: 'string', const: string};

type enum_string<
    T0 extends string = string,
    T1 extends string = string,
> = {
	type: 'string',
	enum: [T0, T1, ...string[]],
};

export type {
	const_string,
	enum_string,
};
