import type {
	Identifier,
	PropertyAccessExpression,
} from 'typescript';
import {
	factory,
	isIdentifier,
	isPropertyAccessExpression,
} from 'typescript';

import {
	ConditionalModification,
} from '../abstracts.ts';

type ucs2lengthCorrectionCandidate = (
	& PropertyAccessExpression
	& {
		expression: (
			& Identifier
			& {
				text: 'ucs2length',
			}
		),
		name: (
			& Identifier
			& {
				getText(): 'default',
			}
		),
	}
);

export default class Ucs2LengthCorrection extends ConditionalModification<
	ucs2lengthCorrectionCandidate
> {
	constructor() {
		super(
			(node): node is ucs2lengthCorrectionCandidate => (
				isPropertyAccessExpression(node)
				&& isIdentifier(node.expression)
				&& 'ucs2length' === node.expression.text
				&& isIdentifier(node.name)
				&& 'default' === node.name.getText()
			),
			() => factory.createIdentifier('ucs2length'),
		);
	}
}
