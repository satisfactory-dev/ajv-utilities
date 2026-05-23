import ts from 'typescript';
import type {
	prepend_with_imports,
} from './TypeReferences.ts';

export default class KnownImports {
	static ErrorObject(prepend_with_imports: prepend_with_imports) {
		prepend_with_imports.ajv.add(ts, 'ErrorObject');
	}

	static IsStandalone(prepend_with_imports: prepend_with_imports) {
		prepend_with_imports['@satisfactory-dev/ajv-utilities'].add(
			ts,
			'IsStandalone',
		);
	}

	static StandaloneDataValidationCxt(
		prepend_with_imports: prepend_with_imports,
	) {
		prepend_with_imports['@satisfactory-dev/ajv-utilities'].add(
			ts,
			'StandaloneDataValidationCxt',
		);
	}
}
