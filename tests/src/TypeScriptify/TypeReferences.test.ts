import {
	describe,
	it,
} from 'node:test';

import assert from 'node:assert/strict';

import {
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

				assert.equal(first.toString(), expected_first_as_string);
				assert.equal(second.toString(), expected_second_as_string);
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
