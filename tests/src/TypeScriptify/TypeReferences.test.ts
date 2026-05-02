import {
	describe,
	it,
} from 'node:test';

import assert from 'node:assert/strict';

import {
	to_string,
	Types,
} from '../../../src/TypeScriptify/TypeReferences.ts';

import type {
	specify_types_config,
} from '../../../src/TypeScriptify/types.ts';

void describe(Types.name, () => {
	void describe('::add()', () => {
		const first_added_instance_dataset: [
			specify_types_config,
			specify_types_config,
			string,
			string,
		][] = [
			['foo', 'foo', 'foo', 'foo'],
			[
				{name: 'foo', as: 'bar'},
				'foo',
				'bar',
				'foo',
			],
			[
				'foo',
				{name: 'foo', as: 'bar'},
				'foo',
				'bar',
			],
			[
				{name: 'foo', as: 'bar'},
				{name: 'foo', as: 'bar', args: ['baz', 'bat', 'bag']},
				'bar',
				'bar<"baz", "bat", "bag">',
			],
			[
				{name: 'foo', as: 'bar', args: ['baz', 'bat', 'bag']},
				{name: 'foo', as: 'bar'},
				'bar<"baz", "bat", "bag">',
				'bar',
			],
			[
				'foo',
				{name: 'foo', args: ['baz', 'bat', 'bag']},
				'foo',
				'foo<"baz", "bat", "bag">',
			],
			[
				{name: 'foo', args: ['baz', 'bat', 'bag']},
				'foo',
				'foo<"baz", "bat", "bag">',
				'foo',
			],
			[
				{name: 'foo', args: ['baz', 'bat', 'bag']},
				{name: 'foo', args: ['bat', 'bag', 'baz']},
				'foo<"baz", "bat", "bag">',
				'foo<"bat", "bag", "baz">',
			],
		];

		const expectations_dataset: [
			specify_types_config,
			string,
		][] = [
			[
				{name: 'foo', as_array: true},
				'foo[]',
			],
			[
				{name: 'foo', as_array: {minimum: 0}},
				'foo[]',
			],
			[
				{name: 'foo', as_array: {minimum: -1}},
				'foo[]',
			],
			[
				{name: 'foo', as_array: {minimum: -1234567890}},
				'foo[]',
			],
			[
				{name: 'foo', as_array: {minimum: 1}},
				`[${
					'\n    '
				}${
					['foo', '...foo[]'].join(',\n    ')
				}${
					'\n'
				}]`,
			],
			[
				{name: 'foo', as_array: {minimum: 2}},
				`[${
					'\n    '
				}${
					['foo', 'foo', '...foo[]'].join(',\n    ')
				}${
					'\n'
				}]`,
			],
			[
				{name: 'foo', as_array: {minimum: 3}},
				`[${
					'\n    '
				}${
					['foo', 'foo', 'foo', '...foo[]'].join(',\n    ')
				}${
					'\n'
				}]`,
			],
			[
				{name: 'foo', sub_type_chain: ['bar']},
				'foo["bar"]',
			],
			[
				{name: 'foo', sub_type_chain: ['bar', 'baz']},
				'foo["bar"]["baz"]',
			],
		];

		for (let i = 0; i < first_added_instance_dataset.length; ++i) {
			const [
				a,
				b,
				expected_first_as_string,
				expected_second_as_string,
			] = first_added_instance_dataset[i];

			void it(`behaves with first_added_instance_dataset[${
				i
			}]`, () => {
				const instance = new Types();

				const first = instance.add(a);
				const second = instance.add(b);

				assert.equal(to_string(first), expected_first_as_string);
				assert.equal(to_string(second), expected_second_as_string);
			});
		}

		for (let i = 0; i < expectations_dataset.length; ++i) {
			const [input, expectation] = expectations_dataset[i];

			void it(`behaves with expectations_dataset[${i}]`, () => {
				const instance = new Types();

				const result = instance.add(input);

				assert.equal(to_string(result), expectation);
			});
		}
	});

	void it('iterates to an empty array if nothing added', () => {
		assert.deepEqual(
			[...new Types()],
			[],
		);
	});
});
