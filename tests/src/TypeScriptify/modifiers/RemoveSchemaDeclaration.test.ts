import assert from 'node:assert/strict';

import {
	describe,
	it,
} from 'node:test';

import {
	factory,
} from 'typescript';

// oxlint-disable-next-line @stylistic/max-len
import RemoveSchemaDeclaration from '../../../../src/TypeScriptify/modifiers/RemoveSchemaDeclaration.ts';

void describe(`${RemoveSchemaDeclaration.name}::visit()`, () => {
	void it('returns false when expected', () => {
		const instance = new RemoveSchemaDeclaration();

		const declaration = factory.createVariableStatement(
			undefined,
			[
				factory.createVariableDeclaration('foo'),
			],
		);

		assert.ok(instance.passes(declaration, {remove_schema: true}));
		assert.equal(
			instance.visit(declaration),
			false,
		);
	});
});
