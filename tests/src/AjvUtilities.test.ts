import {
	readFile,
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
		const EnumStringCode = await readFile(
			`${import.meta.dirname}/../fixtures/EnumString.ts`,
		);
		const EnumStringCode_with_types = await readFile(
			`${import.meta.dirname}/../fixtures/EnumString.with-types.ts`,
		);
		const both = await readFile(
			`${import.meta.dirname}/../fixtures/both.ts`,
		);

		const data_sets: (
			| [string, string]
			| [string, string, TypeScriptifyConfig]
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
					'export const foo = validate20;',
					'const schema31 = { "$id": "foo" };',

					// oxlint-disable-next-line @stylistic/max-len
					'function validate20(data: unknown, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} }: Partial<Parameters<ValidateFunction>[1] & {',
					'    rootData: unknown;',
					'}> = {}) {',
					'    /*# sourceURL="foo" */ ;',
					'    (validate20 as ValidateFunction).errors = null;',
					'    return true;',
					'}',

					// oxlint-disable-next-line @stylistic/max-len
					'validate20.evaluated = { "dynamicProps": false, "dynamicItems": false } as ValidateFunction["evaluated"];',
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
		];

		let i = 0;
		for (const data_set of data_sets) {
			const [input, expectation, config] = data_set;

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
