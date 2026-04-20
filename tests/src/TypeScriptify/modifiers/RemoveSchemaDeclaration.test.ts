import assert from 'node:assert/strict';

import {
	describe,
	it,
} from 'node:test';

import {
	factory,
	isIdentifier,
	isVariableStatement,
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

	void it('returns undefined when expected', () => {
		const instance = new RemoveSchemaDeclaration();

		const declaration = factory.createVariableStatement(
			undefined,
			[
				factory.createVariableDeclaration('schema1'),
			],
		);

		assert.ok(instance.passes(declaration, {remove_schema: true}));
		assert.equal(
			instance.visit(declaration),
			undefined,
		);
	});

	void it('returns statement when expected', () => {
		const instance = new RemoveSchemaDeclaration();

		const declaration = factory.createVariableStatement(
			undefined,
			[
				factory.createVariableDeclaration('schema1'),
				factory.createVariableDeclaration('foo'),
			],
		);

		assert.ok(instance.passes(declaration, {remove_schema: true}));

		assert.equal(declaration.declarationList.declarations.length, 2);
		assert.ok(isIdentifier(
			declaration.declarationList.declarations[1].name,
		));
		assert.equal(
			declaration.declarationList.declarations[1].name.text,
			'foo',
		);

		const result = instance.visit(declaration);

		assert.ok(result && isVariableStatement(result));
		assert.equal(result.declarationList.declarations.length, 1);
		assert.ok(isIdentifier(result.declarationList.declarations[0].name));
		assert.equal(result.declarationList.declarations[0].name.text, 'foo');
	});
});
