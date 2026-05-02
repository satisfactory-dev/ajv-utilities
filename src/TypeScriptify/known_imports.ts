import type {
	prepend_with_imports,
} from './TypeReferences.ts';

export default class KnownImports {
	static SchemaObject(prepend_with_imports: prepend_with_imports) {
		prepend_with_imports.ajv.add('SchemaObject');
	}

	static ValidateFunction(prepend_with_imports: prepend_with_imports) {
		prepend_with_imports.ajv.add('ValidateFunction');
	}

	static Is(prepend_with_imports: prepend_with_imports) {
		prepend_with_imports['@satisfactory-dev/ajv-utilities'].add('Is');
	}

	static IsStandalone(prepend_with_imports: prepend_with_imports) {
		prepend_with_imports['@satisfactory-dev/ajv-utilities'].add(
			'IsStandalone',
		);
	}

	static StandaloneDataValidationCxt(
		prepend_with_imports: prepend_with_imports,
	) {
		prepend_with_imports['@satisfactory-dev/ajv-utilities'].add(
			'StandaloneDataValidationCxt',
		);
	}
}
