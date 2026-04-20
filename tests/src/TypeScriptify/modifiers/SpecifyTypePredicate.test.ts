import assert from 'node:assert/strict';

import {
	describe,
	it,
} from 'node:test';

import {
	factory,
} from 'typescript';

// oxlint-disable-next-line @stylistic/max-len
import SpecifyTypePredicate from '../../../../src/TypeScriptify/modifiers/SpecifyTypePredicate.ts';

void describe(SpecifyTypePredicate.name, () => {
	void it('does not pass if an ajv_utilities__-prefixed function', () => {
		const instance = new SpecifyTypePredicate({});

		const func = factory.createFunctionDeclaration(
			undefined,
			undefined,
			'ajv_utilities__foo',
			undefined,
			[],
			undefined,
			undefined,
		);

		assert.ok(false === instance.passes(func));
	});

	void it(
		'does pass if not an ajv_utilities__-prefixed function',
		(t) => {
			const instance = new SpecifyTypePredicate({});

			const func = factory.createFunctionDeclaration(
				undefined,
				undefined,
				'foo',
				undefined,
				[],
				undefined,
				undefined,
			);

			assert.ok(instance.passes(func));

			void t.test('does nothing when function not specified', () => {
				assert.ok(false === instance.visit(func));
			});
		},
	);
});
