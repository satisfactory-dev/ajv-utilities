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
