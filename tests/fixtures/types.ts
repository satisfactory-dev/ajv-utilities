type const_string = {type: 'string', const: string};

type enum_string = {
	type: 'string',
	enum: [string, string, ...string[]],
};

export type {
	const_string,
	enum_string,
};
