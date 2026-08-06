import type {
	Node,
	Statement,
} from '@typescript/typescript6';

import type {
	ts,
} from '../../TypeScriptify.ts';

import {
	ConditionalModification,
} from '../abstracts.ts';

import type {
	Collected,
	ContainingCandidate,
	Match,
	PropertyCandidate,
} from '../preprocessors/CollectEvaluatedProperties.ts';

import type {
	prepend_with_imports,
} from '../TypeReferences.ts';
import {
	Types,
} from '../TypeReferences.ts';

// oxlint-disable-next-line @stylistic/max-len
export default class TypecastEvalulatedProperties extends ConditionalModification<
	ContainingCandidate
> {
	constructor(
		ts: ts,
		prepend_with_imports: prepend_with_imports,
		collected: Collected,
		patch_needed: () => void,
	) {
		const {
			factory,
		} = ts;

		super(
			(
				node,
			): node is ContainingCandidate => {
				return (
					collected as unknown as Map<Node, unknown>
				).has(node);
			},
			(node) => {
				const config = collected.get(node) as Match;

				function is_property(
					maybe: Statement,
				): maybe is PropertyCandidate {
					return (config.properties as Set<Statement>).has(maybe);
				}

				return factory.updateIfStatement(
					node,
					node.expression,
					factory.updateBlock(
						node.thenStatement,
						node.thenStatement.statements.map((e): Statement => {
							if (!is_property(e)) {
								return e;
							}

							if (
								!(config.config.from in prepend_with_imports)
							) {
								prepend_with_imports[
									config.config.from
								] = new Types();
							}

							// oxlint-disable-next-line @stylistic/max-len
							const replacement = factory.createParenthesizedExpression(
								factory.createAsExpression(
									factory.createIdentifier(
										e.expression.left.expression.getText(),
									),
									factory.createTypeReferenceNode(
										'ajv_EvaluatedProperties',
										[
											prepend_with_imports[
												config.config.from
											].add(
												ts,
												config.config.type,
											).toTypeResult(),
										],
									),
								),
							);

							patch_needed();

							return factory.updateExpressionStatement(
								e,
								factory.updateBinaryExpression(
									e.expression,
									factory.updatePropertyAccessExpression(
										e.expression.left,
										replacement,
										e.expression.left.name,
									),
									e.expression.operatorToken,
									e.expression.right,
								),
							);
						}),
					),
					node.elseStatement,
				);
			},
		);
	}
}
