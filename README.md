[![Coverage Status](https://coveralls.io/repos/github/satisfactory-dev/ajv-utilities/badge.svg?branch=main)](https://coveralls.io/github/satisfactory-dev/ajv-utilities?branch=main)
[![Workflow Status](https://github.com/satisfactory-dev/ajv-utilities/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/satisfactory-dev/ajv-utilities/actions/workflows/node.js.yml?query=branch%3Amain)

# Installation

`npm install --save-dev @satisfactory-dev/ajv-utilities`

# Usage

## `compile`

```ts
import Ajv from 'ajv/dist/2020';
import {compile, FailedToCompileSchema} from '@satisfactory-dev/ajv-utilities';

const schema = {type: 'string'};

try {
	const check = compile(new Ajv(), schema);
} catch (err) {
	if (err instanceof FailedToCompileSchema) {
		console.error('failed to compile', err);
	} else {
		console.error('unknown error', err);
	}
}
```

## `esmify`

```ts
import Ajv from 'ajv/dist/2020';
import standalone from 'ajv/dist/standalone';
import {compile, esmify} from '@satisfactory-dev/ajv-utilities';

const ajv = new Ajv();

await writeFile(
	'./standalone-validator.mjs',
	esmify(standalone(ajv, compile(ajv, schema)))
);
```

## `typescriptify`

```ts
import {writeFile} from 'node:fs/promises';

import {typescriptify} from '@satisfactory-dev/ajv-utilities';

import Ajv2020 from 'ajv/dist/2020.js';

import standaloneCode from 'ajv/dist/standalone/index.js';

// oxlint-disable-next-line @stylistic/max-len
import ConstString from './schema/lib/PropertySchemaToRegex/ConstString.schema.json' with {type: 'json'};

// oxlint-disable-next-line @stylistic/max-len
import EnumString from './schema/lib/PropertySchemaToRegex/EnumString.schema.json' with {type: 'json'};

// oxlint-disable-next-line @stylistic/max-len
import NamedList from './schema/lib/PropertySchemaToRegex/NamedList.schema.json' with {type: 'json'};
import {
	FlexibleArray_generate_schema_definition__items,
	FlexibleArray_generate_schema_definition__prefixItems,
} from './src/version-specific/0.3.7.7/TypedString/FlexibleArray.ts';

const FlexibleArray__items = {
	$id: 'docs.json.ts--lib--PropertySchemaToRegex--FlexibleArray--items',
	...FlexibleArray_generate_schema_definition__items(),
};

const FlexibleArray__prefixItems = {
	$id: 'docs.json.ts--lib--PropertySchemaToRegex--FlexibleArray--prefixItems',
	...FlexibleArray_generate_schema_definition__prefixItems(),
};

const ajv = new Ajv2020({
	verbose: true,
	logger: false,
	allErrors: true,
	code: {
		source: true,
		esm: true,
		lines: true,
		optimize: 2,
	},
	schemas: [ConstString, EnumString, NamedList],
});

const code = `// oxlint-disable @stylistic/max-len${'\n'}${typescriptify(
	standaloneCode(ajv, {
		PropertySchemaToRegex_ConstString: ConstString.$id,
		PropertySchemaToRegex_EnumString: EnumString.$id,
		PropertySchemaToRegex_NamedList: NamedList.$id,
		FlexibleArray__items: FlexibleArray__items.$id,
		FlexibleArray__prefixItems: FlexibleArray__prefixItems.$id,
	}),
	{
		remove_dataCtxKeys: [
			'parentData',
			'parentDataProperty',
			'rootData',
			'dynamicAnchors',
		],
		specify_types: {
			[ConstString.$id]: [
				'ConstString',

				// oxlint-disable-next-line @stylistic/max-len
				'../src/version-specific/0.3.7.7/TypedString/PropertySchemaToRegex/ConstString.ts',
			],
			[EnumString.$id]: [
				'EnumString',

				// oxlint-disable-next-line @stylistic/max-len
				'../src/version-specific/0.3.7.7/TypedString/PropertySchemaToRegex/EnumString.ts',
			],
			[NamedList.$id]: [
				'NamedList_type',

				// oxlint-disable-next-line @stylistic/max-len
				'../src/version-specific/0.3.7.7/NamedList.ts',
			],
			[FlexibleArray__items.$id]: [
				{name: 'FlexibleArray_type', args: ['items']},
			],
			[FlexibleArray__prefixItems.$id]: [
				{name: 'FlexibleArray_type', args: ['prefixItems']},
			],
		},
	}
)}`;

await writeFile(`${import.meta.dirname}/generated-types/lib.ts`, code);
```
