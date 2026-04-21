import assert from 'node:assert/strict';

import {
	describe,
	it,
} from 'node:test';

import {
	ConditionalModification,
	ConditionalPreprocessor,
} from '../../../src/TypeScriptify/abstracts.ts';

// oxlint-disable-next-line @stylistic/max-len
import SpecifyTypes from '../../../src/TypeScriptify/preprocessors/SpecifyTypes.ts';

// oxlint-disable-next-line @stylistic/max-len
import Ucs2LengthCorrection from '../../../src/TypeScriptify/modifiers/Ucs2LengthCorrection.ts';

import {
	Types,
} from '../../../src/TypeScriptify/TypeReferences.ts';

void describe(`${ConditionalPreprocessor.name}::check()`, () => {
	void it('passes', () => {
		assert.doesNotThrow(() => ConditionalPreprocessor.check([]));
		assert.doesNotThrow(() => ConditionalPreprocessor.check([
			new SpecifyTypes({
				ajv: new Types(),
				'@satisfactory-dev/ajv-utilities': new Types(),
			}, {}),
		]));
	});

	void it('fails', () => {
		assert.throws(() => ConditionalPreprocessor.check([1]));
		assert.throws(() => ConditionalPreprocessor.check([
			new SpecifyTypes({
				ajv: new Types(),
				'@satisfactory-dev/ajv-utilities': new Types(),
			}, {}),
			new Ucs2LengthCorrection(),
		]));
	});
});

void describe(`${ConditionalModification.name}::check()`, () => {
	void it('passes', () => {
		assert.doesNotThrow(() => ConditionalModification.check([]));
		assert.doesNotThrow(() => ConditionalModification.check([
			new Ucs2LengthCorrection(),
		]));
	});

	void it('fails', () => {
		assert.throws(() => ConditionalModification.check([1]));
		assert.throws(() => ConditionalModification.check([
			new SpecifyTypes({
				ajv: new Types(),
				'@satisfactory-dev/ajv-utilities': new Types(),
			}, {}),
			new Ucs2LengthCorrection(),
		]));
	});
});
