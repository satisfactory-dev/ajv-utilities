import type {
	prepend_with_imports,
} from './TypeReferences.ts';

export default class KnownImports {
	static ValidateFunction(prepend_with_imports: prepend_with_imports) {
		prepend_with_imports.ajv.add('ValidateFunction');
	}

	static Is(prepend_with_imports: prepend_with_imports) {
		prepend_with_imports['@satisfactory-dev/ajv-utilities'].add('Is');
	}
}
