type const_string = {type: 'string', const: string};

type enum_string<
    T0 extends string = string,
    T1 extends string = string,
> = {
	type: 'string',
	enum: [T0, T1, ...string[]],
};

// actual type is too big to stuff into the library as a fixture
type FlexibleArray_type<T extends 'items'|'prefixItems'> = T[];

export type {
	const_string,
	enum_string,
	FlexibleArray_type,
};
