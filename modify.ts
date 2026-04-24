import {
	createHash,
} from 'node:crypto';

import {
	readFile,
	writeFile,
} from 'node:fs/promises';

// oxlint-disable-next-line @stylistic/max-len
const ucs2length_expected = '9acd307d9f81b95a4e5f541ab1d753d9de0c3807053ef2ff6987c4c9ac409b289e446fd0a52fc694ac932acbafe8acd3734b67fd14479525d1d65df8d96a7c28';

const ucs2length_contents = await readFile(`${
	import.meta.dirname
}/node_modules/ajv/lib/runtime/ucs2length.ts`);

const hash = createHash('sha512');
hash.update(ucs2length_contents);

const digest = hash.digest('hex');

hash.destroy();

if (digest !== ucs2length_expected) {
	throw new Error(`File has changed!`);
}

await writeFile(
	`${import.meta.dirname}/modified/ucs2length.ts`,
	ucs2length_contents.subarray(0, 561),
);
