import type {
	ts,
} from '../TypeScriptify.ts';

import type {
	prepend_with_imports,
} from './TypeReferences.ts';

export default class KnownImports {
	static ErrorObject(
		ts: ts,
		prepend_with_imports: prepend_with_imports,
	) {
		prepend_with_imports.ajv.add(ts, 'ErrorObject');
	}

	static EvaluatedProperties(
		ts: ts,
		prepend_with_imports: prepend_with_imports,
	) {
		prepend_with_imports[
			'ajv/dist/types/index.js'
		].add(ts, 'EvaluatedProperties');
	}

	static IsStandalone(
		ts: ts,
		prepend_with_imports: prepend_with_imports,
	) {
		prepend_with_imports['@satisfactory-dev/ajv-utilities'].add(
			ts,
			'IsStandalone',
		);
	}

	static StandaloneDataValidationCxt(
		ts: ts,
		prepend_with_imports: prepend_with_imports,
	) {
		prepend_with_imports['@satisfactory-dev/ajv-utilities'].add(
			ts,
			'StandaloneDataValidationCxt',
		);
	}
}
