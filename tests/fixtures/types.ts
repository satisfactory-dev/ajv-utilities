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

type stub_recipe_selection = {
	[key: string]: `${'Recipe'|'Build'}_${string}_C`,
};

type stub_production_input = {
	[key: string]: number|`${number}`,
};

type stub_production_output = {
	[key: string]: number|`${number}`,
};

type stub_production_request = {
	input?: stub_production_input,
	recipe_selection?: stub_recipe_selection,
	pool: stub_production_output,
};

type stub_IntermediaryNumber = {
	type: 'IntermediaryNumber',
	value: number|`${number}`,
};

type stub_amount_string = `${number}`;

type stub_amount_string_alt1 = `${number}`;

type stub_amount_string_alt2 = `${number}`;

type stub_amount_string_flexible = (
	| stub_amount_string
	| stub_amount_string_alt1
	| stub_amount_string_alt2
)

type stub_numeric = number|`${number}`;

type stub_IntermediaryCalculation = {
	type: 'IntermediaryCalculation',
	left: unknown, // being lazy here
	operation: string, // ditto
	right: unknown, // ditto
};

type stub_TokenScan = {
	type: 'TokenScan',
	value: string,
};

type stub_CanConvertJson = (
	| stub_IntermediaryNumber
	| stub_IntermediaryCalculation
	| stub_TokenScan
);

type stub_Pool_json_output_amounts = {
	[key in `${string}_C`]: (
		| string
		| stub_CanConvertJson
	);
};

type stub_Destination_json_item<
	Destination extends 'pool'|'sink' = 'pool'|'sink',
> = {
	amount: stub_CanConvertJson,
	destination: {
		type: Destination,
		id: number,
	},
};

type stub_Distributor_json = {
	instructions: {
		[key: `${string}_C`]: [
			stub_Destination_json_item,
			...stub_Destination_json_item[],
		]
	}
}

type stub_Pool = (
	& {
		id: number,
	}
	& Partial<{
		name: string,
		production: stub_Pool_json_output_amounts,
		manual_input: stub_Pool_json_output_amounts,
		outputs: stub_Distributor_json,
		recipe_selection: stub_recipe_selection,
	}>
);

type stub_Settings = (
	& {
		auto_follow_current_pool: boolean,
		calculator_display_mode: boolean,
		current_pool_id: number,
		show_full_pool_button_list: boolean,
		auto_recalculate: {
			recipe_selection_ui_change: boolean,
		}
	}
	& Partial<{
		recipe_selection: stub_recipe_selection,
	}>
);

type stub_Collection = (
	& {
		id: number,
	}
	& Partial<{
		name: string,
		items: [number, ...number[]],
		recipe_selection: stub_recipe_selection,
	}>
);

type stub_State_Json = (
	& {
		settings: stub_Settings,
		version: 6,
	}
	& Partial<{
		pools: [stub_Pool, ...stub_Pool[]],
		groups: [stub_Collection, ...stub_Collection[]],
		collections: [stub_Collection, ...stub_Collection[]],
	}>
);

export type {
	const_string,
	enum_string,
	FlexibleArray_type,
	stub_recipe_selection,
	stub_production_request,
	stub_IntermediaryNumber,
	stub_amount_string,
	stub_amount_string_alt1,
	stub_amount_string_alt2,
	stub_amount_string_flexible,
	stub_production_output,
	stub_numeric,
	stub_IntermediaryCalculation,
	stub_TokenScan,
	stub_CanConvertJson,
	stub_State_Json,
	stub_Settings,
	stub_Collection,
	stub_Pool,
	stub_Distributor_json,
};
