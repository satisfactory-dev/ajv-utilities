// oxlint-disable @stylistic/max-len
import {
	readFile,
	writeFile,
} from 'node:fs/promises';

import {
	describe,
	it,
} from 'node:test';

import assert from 'node:assert/strict';

import type {
	SchemaObject,
} from 'ajv/dist/2020.js';
import Ajv from 'ajv/dist/2020.js';

import standaloneCode from 'ajv/dist/standalone/index.js';

import type {
	TypeScriptifyConfig,
} from '../../index.ts';
import {
	compile,
	esmify,
	typescriptify,
} from '../../index.ts';

import ConstString from '../fixtures/ConstString.schema.json' with {
	type: 'json',
};

import EnumString from '../fixtures/EnumString.schema.json' with {
	type: 'json',
};

// oxlint-disable-next-line @stylistic/max-len
import FlexibleArray__items from '../fixtures/FlexibleArray__items.schema.json' with {
	type: 'json',
};

// oxlint-disable-next-line @stylistic/max-len
import FlexibleArray__prefixItems from '../fixtures/FlexibleArray__prefixItems.schema.json' with {
	type: 'json',
};

import TemplatedString from '../fixtures/TemplatedString.schema.json' with {
	type: 'json',
};

// oxlint-disable-next-line @stylistic/max-len
import recipe_selection from '../fixtures/recipe-selection.update8.schema.json' with {
	type: 'json',
};

// oxlint-disable-next-line @stylistic/max-len
import production_request from '../fixtures/production-request.update8.schema.json' with {
	type: 'json',
};

// oxlint-disable-next-line @stylistic/max-len
import CanConvertTypeJsonDefs from '../fixtures/CanConvertTypeJsonDefs.schema.json' with {
	type: 'json',
};

import version_6 from '../fixtures/version_6.schema.json' with {type: 'json'};

void describe('AjvUtilities', () => {
	void describe('compile', () => {
		const ajv = new Ajv();
		const data_sets: (
			| [unknown, {[key: string]: unknown}]
			| [SchemaObject, true, [unknown, boolean][]]
		)[] = [
			[{type: 'string'}, true, [
				[1, false],
				['1', true],
			]],
			[{type: 'string'}, true, [ // duplicated for caching branches
				[1, false],
				['1', true],
			]],
			[null, {
				message: 'Failed to compile schema',
			}],
		];

		for (const data_set of data_sets) {
			const [schema, expectation, trigger_cache] = data_set;

			void it(
				`compile(ajv:Ajv, ${
					JSON.stringify(schema)
				}) ${
					true === expectation
						? 'behaves'
						: 'throws'
				}`,
				() => {
					const get_result = () => compile(
						ajv,
						schema as SchemaObject,
					);

					if (true === expectation) {
						assert.doesNotThrow(get_result);

						for (const test_to_trigger_cache of trigger_cache) {
							const [
								input,
								input_expectation,
							] = test_to_trigger_cache;
							assert.strictEqual(
								!!get_result()(input),
								input_expectation,
							);
						}
					} else {
						assert.throws(
							get_result,
							expectation,
						);
					}
				},
			);
		}
	});

	void describe('esmify', () => {
		const data_sets: [string, string][] = [
			['', ''],
			[
				'require("ajv/dist/runtime/equal").default',

				// no import because there's no "use strict;" header
				'fast_deep_equal',
			],
			[
				'"use strict";',

				// nothing to modify
				'"use strict";',
			],
			[
				'"use strict";require("ajv/dist/runtime/equal").default',
				[
					'"use strict";',
					'import fast_deep_equal from \'fast-deep-equal\';',
					'fast_deep_equal',
				].join(''),
			],
		];

		for (const data_set of data_sets) {
			const [input, expectation] = data_set;

			void it(
				`esmify(${
					JSON.stringify(input)
				}) returns ${
					JSON.stringify(expectation)
				}`,
				() => {
					assert.equal(
						esmify(input),
						expectation,
					);
				},
			);
		}
	});

	void describe('typescriptify', async () => {
		const ConstStringCode = await readFile(
			`${import.meta.dirname}/../fixtures/ConstString.ts`,
		);
		const ConstStringCode_with_types = await readFile(
			`${import.meta.dirname}/../fixtures/ConstString.with-types.ts`,
		);
		const ConstStringCode_with_aliased_types = await readFile(
			`${
				import.meta.dirname
			}/../fixtures/ConstString.with-aliased-types.ts`,
		);
		const ConstStringCode_without_schema = await readFile(
			`${import.meta.dirname}/../fixtures/ConstString.without-schema.ts`,
		);
		const ConstStringCode_without_schema_or_unused_keys = await readFile(
			`${
				import.meta.dirname
			}/../fixtures/ConstString.without-schema-or-unused-keys.ts`,
		);
		const ConstStringCode_verbose = await readFile(
			`${import.meta.dirname}/../fixtures/ConstString.verbose.ts`,
		);
		const EnumStringCode = await readFile(
			`${import.meta.dirname}/../fixtures/EnumString.ts`,
		);
		const EnumStringCode_with_types = await readFile(
			`${import.meta.dirname}/../fixtures/EnumString.with-types.ts`,
		);
		const EnumStringCode_with_alias_and_generics = await readFile(
			`${
				import.meta.dirname
			}/../fixtures/EnumString.with-alias-and-generics.ts`,
		);
		const EnumStringCode_with_generics = await readFile(
			`${import.meta.dirname}/../fixtures/EnumString.with-generics.ts`,
		);
		const EnumStringCode_with_multiple_generics = await readFile(
			`${
				import.meta.dirname
			}/../fixtures/EnumString.with-multiple-generics.ts`,
		);
		const both = await readFile(
			`${import.meta.dirname}/../fixtures/both.ts`,
		);
		const both_with_generics = await readFile(
			`${import.meta.dirname}/../fixtures/both-with-generics.ts`,
		);
		const FlexibleArray__items_expectation = await readFile(
			`${import.meta.dirname}/../fixtures/FlexibleArray__items.ts`,
		);
		const FlexibleArray__prefixItems_expectation = await readFile(
			`${import.meta.dirname}/../fixtures/FlexibleArray__prefixItems.ts`,
		);
		const TemplatedString_expectation = await readFile(
			`${import.meta.dirname}/../fixtures/TemplatedString.ts`,
		);
		const production_planner_update8 = await readFile(
			`${import.meta.dirname}/../fixtures/production-planner.update8.ts`,
		);
		const version_6_expectation = await readFile(
			`${import.meta.dirname}/../fixtures/version_6.ts`,
		);
		const version_6_alt_expectation = await readFile(
			`${import.meta.dirname}/../fixtures/version_6.alt.ts`,
		);
		const version_6_alt2_expectation = await readFile(
			`${import.meta.dirname}/../fixtures/version_6.alt2.ts`,
		);
		const version_6_alt3_expectation = await readFile(
			`${import.meta.dirname}/../fixtures/version_6.alt3.ts`,
		);

		const data_sets: (
			| [string, string]
			| [string, string, Partial<TypeScriptifyConfig>]
		)[] = [
			['', ''],
			[
				'require("ajv/dist/runtime/equal").default',

				// no import because there's no "use strict;" header
				'fast_deep_equal;\n',
			],
			[
				'"use strict";',
				'',
			],
			[
				'"use strict";require("ajv/dist/runtime/equal").default',
				[
					'import fast_deep_equal from \'fast-deep-equal\';',
					'fast_deep_equal;',
					'',
				].join('\n'),
			],
			[
				standaloneCode(
					new Ajv({
						verbose: false,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							{
								$id: 'foo',
							},
						],
					}),
					{
						foo: 'foo',
					},
				),
				[
					// oxlint-disable-next-line @stylistic/max-len
					`import type { ValidateFunction } from 'ajv';`,

					// oxlint-disable-next-line @stylistic/max-len
					`import type { Is } from '@satisfactory-dev/ajv-utilities';`,
					'export const foo = validate20;',
					'const schema31 = { "$id": "foo" };',

					// oxlint-disable-next-line @stylistic/max-len
					'function validate20(data: unknown, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} }: Partial<Omit<Exclude<Parameters<ValidateFunction>[1], undefined>, "rootData"> & {',
					'    rootData: unknown;',
					'}> = {}) {',
					'    /*# sourceURL="foo" */ ;',
					'    (validate20 as Is).errors = null;',
					'    return true;',
					'}',

					// oxlint-disable-next-line @stylistic/max-len
					'(validate20 as Is).evaluated = { "dynamicProps": false, "dynamicItems": false };',
					'',
				].join('\n'),
			],
			[
				standaloneCode(
					new Ajv({
						verbose: false,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							{
								$id: 'foo',
							},
						],
					}),
					{
						foo: 'foo',
					},
				),
				[
					// oxlint-disable-next-line @stylistic/max-len
					`import type { ValidateFunction } from 'ajv';`,

					// oxlint-disable-next-line @stylistic/max-len
					`import type { Is } from '@satisfactory-dev/ajv-utilities';`,
					'export const foo = validate20;',

					// oxlint-disable-next-line @stylistic/max-len
					'function validate20(data: unknown, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} }: Partial<Omit<Exclude<Parameters<ValidateFunction>[1], undefined>, "rootData"> & {',
					'    rootData: unknown;',
					'}> = {}) {',
					'    /*# sourceURL="foo" */ ;',
					'    (validate20 as Is).errors = null;',
					'    return true;',
					'}',

					// oxlint-disable-next-line @stylistic/max-len
					'(validate20 as Is).evaluated = { "dynamicProps": false, "dynamicItems": false };',
					'',
				].join('\n'),
				{
					remove_schema: true,
				},
			],
			[
				standaloneCode(
					new Ajv({
						verbose: false,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							ConstString,
						],
					}),
					{
						// oxlint-disable-next-line @stylistic/max-len
						foo: ConstString.$id,
					},
				),
				ConstStringCode.toString(),
			],
			[
				standaloneCode(
					new Ajv({
						verbose: false,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							ConstString,
						],
					}),
					{
						// oxlint-disable-next-line @stylistic/max-len
						foo: ConstString.$id,
					},
				),
				ConstStringCode.toString(),
				{
					specify_types: {
						// empty on purpose for branch coverage
					},
				},
			],
			[
				standaloneCode(
					new Ajv({
						verbose: false,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							ConstString,
						],
					}),
					{
						// oxlint-disable-next-line @stylistic/max-len
						foo: ConstString.$id,
					},
				),
				ConstStringCode.toString(),
				{
					// doesn't include specify_types for branch coverage
					remove_schema: false,
				},
			],
			[
				standaloneCode(
					new Ajv({
						verbose: false,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							ConstString,
						],
					}),
					{
						// oxlint-disable-next-line @stylistic/max-len
						foo: ConstString.$id,
					},
				),
				ConstStringCode_with_types.toString(),
				{
					specify_types: {
						[ConstString.$id]: [
							'const_string',
							'./types.ts',
						],
					},
				},
			],
			[
				standaloneCode(
					new Ajv({
						verbose: false,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							ConstString,
						],
					}),
					{
						// oxlint-disable-next-line @stylistic/max-len
						foo: ConstString.$id,
					},
				),
				ConstStringCode_with_aliased_types.toString(),
				{
					specify_types: {
						[ConstString.$id]: [
							{name: 'const_string', as: 'bar'},
							'./types.ts',
						],
					},
				},
			],
			[
				standaloneCode(
					new Ajv({
						verbose: false,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							ConstString,
						],
					}),
					{
						// oxlint-disable-next-line @stylistic/max-len
						foo: ConstString.$id,
					},
				),
				ConstStringCode_without_schema.toString(),
				{
					remove_schema: true,
					specify_types: {
						[ConstString.$id]: [
							'const_string',
							'./types.ts',
						],
					},
				},
			],
			[
				standaloneCode(
					new Ajv({
						verbose: false,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							ConstString,
						],
					}),
					{
						// oxlint-disable-next-line @stylistic/max-len
						foo: ConstString.$id,
					},
				),
				ConstStringCode_without_schema_or_unused_keys.toString(),
				{
					remove_schema: true,
					remove_dataCtxKeys: [
						'parentData',
						'parentDataProperty',
						'rootData',
						'dynamicAnchors',
					],
					specify_types: {
						[ConstString.$id]: [
							'const_string',
							'./types.ts',
						],
					},
				},
			],
			[
				standaloneCode(
					new Ajv({
						verbose: true,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							ConstString,
						],
					}),
					{
						// oxlint-disable-next-line @stylistic/max-len
						foo: ConstString.$id,
					},
				),
				ConstStringCode_verbose.toString(),
				{
					specify_types: {
						[ConstString.$id]: [
							'const_string',
							'./types.ts',
						],
					},
				},
			],
			[
				standaloneCode(
					new Ajv({
						verbose: false,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							EnumString,
						],
					}),
					{
						// oxlint-disable-next-line @stylistic/max-len
						foo: EnumString.$id,
					},
				),
				EnumStringCode.toString(),
			],
			[
				standaloneCode(
					new Ajv({
						verbose: false,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							EnumString,
						],
					}),
					{
						// oxlint-disable-next-line @stylistic/max-len
						foo: EnumString.$id,
					},
				),
				EnumStringCode_with_types.toString(),
				{
					specify_types: {
						[EnumString.$id]: [
							'enum_string',
							'./types.ts',
						],
					},
				},
			],
			[
				standaloneCode(
					new Ajv({
						verbose: false,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							EnumString,
						],
					}),
					{
						// oxlint-disable-next-line @stylistic/max-len
						foo: EnumString.$id,
					},
				),
				EnumStringCode_with_alias_and_generics.toString(),
				{
					specify_types: {
						[EnumString.$id]: [
							{
								name: 'enum_string',
								as: 'bar',
								args: ['foo', 'bar'],
							},
							'./types.ts',
						],
					},
				},
			],
			[
				standaloneCode(
					new Ajv({
						verbose: false,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							EnumString,
						],
					}),
					{
						// oxlint-disable-next-line @stylistic/max-len
						foo: EnumString.$id,
					},
				),
				EnumStringCode_with_generics.toString(),
				{
					specify_types: {
						[EnumString.$id]: [
							{
								name: 'enum_string',
								args: ['foo', 'bar'],
							},
							'./types.ts',
						],
					},
				},
			],
			[
				standaloneCode(
					new Ajv({
						verbose: false,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							EnumString,
							{
								...EnumString,
								$id: `${EnumString.$id}_foo`,
							},
						],
					}),
					{
						// oxlint-disable-next-line @stylistic/max-len
						foo: EnumString.$id,
						bar: `${EnumString.$id}_foo`,
					},
				),
				EnumStringCode_with_multiple_generics.toString(),
				{
					specify_types: {
						[EnumString.$id]: [
							{
								name: 'enum_string',
								args: ['foo', 'bar'],
							},
							'./types.ts',
						],
						[`${EnumString.$id}_foo`]: [
							{
								name: 'enum_string',
								args: ['bar', 'foo'],
							},
							'./types.ts',
						],
					},
				},
			],
			[
				standaloneCode(
					new Ajv({
						verbose: false,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							ConstString,
							EnumString,
						],
					}),
					{
						validate_as_ConstString: ConstString.$id,
						validate_as_EnumString: EnumString.$id,
					},
				),
				both.toString(),
				{
					specify_types: {
						[ConstString.$id]: [
							'const_string',
							'./types.ts',
						],
						[EnumString.$id]: [
							'enum_string',
							'./types.ts',
						],
					},
				},
			],
			[
				standaloneCode(
					new Ajv({
						verbose: false,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							ConstString,
							EnumString,
						],
					}),
					{
						validate_as_ConstString: ConstString.$id,
						validate_as_EnumString: EnumString.$id,
					},
				),
				both_with_generics.toString(),
				{
					remove_dataCtxKeys: {
						[EnumString.$id]: [
							'parentData',
							'parentDataProperty',
							'rootData',
							'dynamicAnchors',
						],
					},
					specify_types: {
						[ConstString.$id]: [
							{
								name: 'const_string',
								as: 'bar',
							},
							'./types.ts',
						],
						[EnumString.$id]: [
							{
								name: 'enum_string',
								as: 'baz',
								args: ['foo', 'bar'],
							},
							'./types.ts',
						],
					},
				},
			],
			[
				standaloneCode(
					new Ajv({
						verbose: true,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							FlexibleArray__items,
						],
					}),
					{
						// oxlint-disable-next-line @stylistic/max-len
						FlexibleArray__items: FlexibleArray__items.$id,
					},
				),
				FlexibleArray__items_expectation.toString(),
				{
					remove_dataCtxKeys: [
						'parentData',
						'parentDataProperty',
						'rootData',
						'dynamicAnchors',
					],
					specify_types: {
						[FlexibleArray__items.$id]: [
							{
								name: 'FlexibleArray_type',
								args: ['items'],
							},
							'./types.ts',
						],
					},
				},

			],
			[
				standaloneCode(
					new Ajv({
						verbose: true,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							FlexibleArray__prefixItems,
						],
					}),
					{
						// oxlint-disable-next-line @stylistic/max-len
						FlexibleArray__prefixItems: FlexibleArray__prefixItems.$id,
					},
				),
				FlexibleArray__prefixItems_expectation.toString(),
				{
					remove_dataCtxKeys: [
						'parentData',
						'parentDataProperty',
						'rootData',
						'dynamicAnchors',
					],
					specify_types: {
						[FlexibleArray__prefixItems.$id]: [
							{
								name: 'FlexibleArray_type',
								args: ['prefixItems'],
							},
							'./types.ts',
						],
					},
				},
			],
			[
				standaloneCode(
					new Ajv({
						verbose: true,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							TemplatedString,
						],
					}),
					{
						// oxlint-disable-next-line @stylistic/max-len
						PropertySchemaToRegex_TemplatedString: TemplatedString.$id,
					},
				),
				TemplatedString_expectation.toString(),
				{
					specify_types: {
						[TemplatedString.$id]: [
							'templated_string_type',
							'@signpostmarv/json-schema-typescript-codegen/ajv',
						],
					},
				},
			],
			[
				standaloneCode(
					new Ajv({
						verbose: true,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							recipe_selection,
							production_request,
						],
					}),
					{
						recipe_selection_validator: recipe_selection.$id,
						production_request_validator: production_request.$id,
					},
				),
				production_planner_update8.toString(),
				{
					specify_types: {
						[recipe_selection.$id]: [
							'stub_recipe_selection',
							'./types.ts',
						],
						[production_request.$id]: [
							'stub_production_request',
							'./types.ts',
						],
					},
					specify_types_by_validate_function_name: {
						validate22: [
							'stub_numeric',
							'./types.ts',
						],
						validate23: [
							'stub_CanConvertJson',
							'./types.ts',
						],
						validate24: [
							'stub_IntermediaryNumber',
							'./types.ts',
						],
						validate25: [
							'stub_amount_string_alt1',
							'./types.ts',
						],
						validate28: [
							'stub_IntermediaryCalculation',
							'./types.ts',
						],
						validate32: [
							'stub_production_output',
							'./types.ts',
						],
					},
				},
			],
			[
				standaloneCode(
					new Ajv({
						verbose: true,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							CanConvertTypeJsonDefs,
							version_6,
						],
					}),
					{
						version_6_validator: version_6.$id,
					},
				),
				version_6_expectation.toString(),
				{
					specify_types: {
						[version_6.$id]: [
							'stub_State_Json',
							'./types.ts',
						],
					},
					specify_types_by_validate_function_name: {
						validate21: [
							'stub_Pool',
							'./types.ts',
						],
						validate22: [
							{
								name: 'stub_Pool',
								sub_type_chain: ['production'],
							},
							'./types.ts',
						],
						validate24: [
							'stub_CanConvertJson',
							'./types.ts',
						],
						validate25: [
							'stub_IntermediaryNumber',
							'./types.ts',
						],
						validate26: [
							'stub_amount_string_flexible',
							'./types.ts',
						],
						validate29: [
							'stub_IntermediaryCalculation',
							'./types.ts',
						],
						validate34: [
							'stub_Distributor_json',
							'./types.ts',
						],
						validate38: [
							{name: 'stub_Collection', as_array: {minimum: 1}},
							'./types.ts',
						],
						validate39: [
							'stub_Collection',
							'./types.ts',
						],
						validate43: [
							'stub_Settings',
							'./types.ts',
						],
					},
				},
			],
			[
				standaloneCode(
					new Ajv({
						verbose: true,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							CanConvertTypeJsonDefs,
							version_6,
						],
					}),
					{
						version_6_validator: version_6.$id,
					},
				),
				version_6_alt_expectation.toString(),
				{
					specify_types: {
						[version_6.$id]: [
							{name: 'stubs', sub_type_chain: ['State_Json']},
							'./types.ts',
						],
					},
					specify_types_by_validate_function_name: {
						validate21: [
							{name: 'stubs', sub_type_chain: ['Pool']},
							'./types.ts',
						],
						validate22: [
							{
								name: 'stubs',
								sub_type_chain: ['Pool', 'production'],
							},
							'./types.ts',
						],
						validate24: [
							{
								name: 'stubs',
								sub_type_chain: ['CanConvertJson'],
							},
							'./types.ts',
						],
						validate25: [
							{
								name: 'stubs',
								sub_type_chain: ['IntermediaryNumber'],
							},
							'./types.ts',
						],
						validate26: [
							{
								name: 'stubs',
								sub_type_chain: ['amount_string_flexible'],
							},
							'./types.ts',
						],
						validate29: [
							{
								name: 'stubs',
								sub_type_chain: ['IntermediaryCalculation'],
							},
							'./types.ts',
						],
						validate34: [
							{
								name: 'stubs',
								sub_type_chain: ['Distributor_json'],
							},
							'./types.ts',
						],
						validate38: [
							{
								name: 'stub_Collection',
								as_array: {minimum: 1},
							},
							'./types.ts',
						],
						validate39: [
							{
								name: 'stubs',
								sub_type_chain: ['Collection'],
							},
							'./types.ts',
						],
						validate43: [
							{
								name: 'stubs',
								sub_type_chain: ['Settings'],
							},
							'./types.ts',
						],
					},
				},
			],
			[
				standaloneCode(
					new Ajv({
						verbose: true,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							CanConvertTypeJsonDefs,
							version_6,
						],
					}),
					{
						version_6_validator: version_6.$id,
					},
				),
				version_6_alt2_expectation.toString(),
				{
					specify_types: {
						[version_6.$id]: [
							'stub_State_Json',
							'./types.ts',
						],
					},
					specify_types_by_validate_function_name: {
						validate21: [
							'stub_Pool',
							'./types.ts',
						],
						validate22: [
							{
								name: 'stub_Pool',
								sub_type_chain: ['production'],
							},
							'./types.ts',
						],
						validate24: [
							'stub_CanConvertJson',
							'./types.ts',
						],
						validate25: [
							'stub_IntermediaryNumber',
							'./types.ts',
						],
						validate26: [
							'stub_amount_string_flexible',
							'./types.ts',
						],
						validate29: [
							'stub_IntermediaryCalculation',
							'./types.ts',
						],
						validate34: [
							'stub_Distributor_json',
							'./types.ts',
						],
						validate38: [
							{name: 'stub_Collection', as_array: true},
							'./types.ts',
						],
						validate39: [
							'stub_Collection',
							'./types.ts',
						],
						validate43: [
							'stub_Settings',
							'./types.ts',
						],
					},
				},
			],
			[
				standaloneCode(
					new Ajv({
						verbose: true,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							CanConvertTypeJsonDefs,
							version_6,
						],
					}),
					{
						version_6_validator: version_6.$id,
					},
				),
				version_6_alt2_expectation.toString(),
				{
					specify_types: {
						[version_6.$id]: [
							'stub_State_Json',
							'./types.ts',
						],
					},
					specify_types_by_validate_function_name: {
						validate21: [
							'stub_Pool',
							'./types.ts',
						],
						validate22: [
							{
								name: 'stub_Pool',
								sub_type_chain: ['production'],
							},
							'./types.ts',
						],
						validate24: [
							'stub_CanConvertJson',
							'./types.ts',
						],
						validate25: [
							'stub_IntermediaryNumber',
							'./types.ts',
						],
						validate26: [
							'stub_amount_string_flexible',
							'./types.ts',
						],
						validate29: [
							'stub_IntermediaryCalculation',
							'./types.ts',
						],
						validate34: [
							'stub_Distributor_json',
							'./types.ts',
						],
						validate38: [
							{name: 'stub_Collection', as_array: {minimum: 0}},
							'./types.ts',
						],
						validate39: [
							'stub_Collection',
							'./types.ts',
						],
						validate43: [
							'stub_Settings',
							'./types.ts',
						],
					},
				},
			],
			[
				standaloneCode(
					new Ajv({
						verbose: true,
						logger: false,
						allErrors: true,
						code: {
							source: true,
							esm: true,
							lines: true,
							optimize: 2,
						},
						schemas: [
							CanConvertTypeJsonDefs,
							version_6,
						],
					}),
					{
						version_6_validator: version_6.$id,
						is_IntermediaryCalculation: `${
							CanConvertTypeJsonDefs.$id
						}#/$defs/IntermediaryCalculation`,
						is_CanConvertTypeJson: `${
							CanConvertTypeJsonDefs.$id
						}#/$defs/CanConvertTypeJson`,
					},
				),
				version_6_alt3_expectation.toString(),
				{
					specify_types: {
						[version_6.$id]: [
							'stub_State_Json',
							'./types.ts',
							[
								[
									'stub_Pool',
									'./types.ts',
									{
										instancePath_partial: '/pools/',
									},
									[
										[
											{
												name: 'stub_Pool',
												sub_type_chain: ['production'],
											},
											'./types.ts',
											{
												instancePath_partial: '/production',
												parentDataProperty: 'production',
											},
										],
										[
											'stub_Distributor_json',
											'./types.ts',
											{
												instancePath_partial: '/outputs',
												parentDataProperty: 'outputs',
											},
											[
												[
													'stub_CanConvertJson',
													'./types.ts',
													{
														instancePath_partial: '/instructions/',
														parentDataProperty: 'amount',
													},
												],
											],
										],
									],
								],
								[
									'stub_Settings',
									'./types.ts',
									{
										instancePath_partial: '/settings',
										parentDataProperty: 'settings',
									},
								],
								[
									{
										name: 'stub_Collection',
										as_array: {minimum: 0},
									},
									'./types.ts',
									{
										instancePath_partial: '/collections',
									},
									[
										[
											'stub_Collection',
											'./types.ts',
											{
												instancePath_partial: '/',
											},
										],
									],
								],
							],
						],
					},
					specify_types_by_export_name: {
						is_IntermediaryCalculation: [
							'stub_IntermediaryCalculation',
							'./types.ts',
						],
						is_CanConvertTypeJson: [
							'stub_CanConvertJson',
							'./types.ts',
						],
					},
				},
			],
		];

		let i = 0;
		for (const data_set of data_sets) {
			const [input, expectation, config] = data_set;

			if (process.env.DEBUG) {
				await writeFile(
					`${
						import.meta.dirname
					}/../debugging/typescriptify.${i}.ts`,
					typescriptify(input, config),
				);
			}

			void it(
				`typescriptify(data_sets[${
					i
				}][0], data_sets[${
					i
				}][2]) returns data_sets[${
					i
				}][1]`,
				() => {
					assert.equal(
						typescriptify(input, config),
						expectation,
					);
				},
			);

			++i;
		}
	});
});
