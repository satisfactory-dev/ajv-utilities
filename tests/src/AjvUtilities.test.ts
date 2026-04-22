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
					'function validate20(data: unknown, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} }: Partial<Parameters<ValidateFunction>[1] & {',
					'    rootData: unknown;',
					'}> = {}) {',
					'    /*# sourceURL="foo" */ ;',
					'    (validate20 as Is).errors = null;',
					'    return true;',
					'}',

					// oxlint-disable-next-line @stylistic/max-len
					'validate20.evaluated = { "dynamicProps": false, "dynamicItems": false } as Is["evaluated"];',
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
					'function validate20(data: unknown, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} }: Partial<Parameters<ValidateFunction>[1] & {',
					'    rootData: unknown;',
					'}> = {}) {',
					'    /*# sourceURL="foo" */ ;',
					'    (validate20 as Is).errors = null;',
					'    return true;',
					'}',

					// oxlint-disable-next-line @stylistic/max-len
					'validate20.evaluated = { "dynamicProps": false, "dynamicItems": false } as Is["evaluated"];',
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
