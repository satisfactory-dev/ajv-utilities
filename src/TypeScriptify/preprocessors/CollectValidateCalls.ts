import type {
} from '@signpostmarv/js-types';

import type {
	BinaryExpression,
	CallExpression,
	ElementAccessExpression,
	Identifier,
	Node,
	NodeArray,
	ObjectLiteralExpression,
	PropertyAccessExpression,
	PropertyAssignment,
	ShorthandPropertyAssignment,
	StringLiteral,
} from 'typescript';
import {
	isBinaryExpression,
	isCallExpression,
	isElementAccessExpression,
	isFunctionDeclaration,
	isIdentifier,
	isObjectLiteralExpression,
	isPropertyAccessExpression,
	isPropertyAssignment,
	isShorthandPropertyAssignment,
	isStringLiteral,
	SyntaxKind,
} from 'typescript';

import {
	ConditionalPreprocessor,
} from '../abstracts.ts';

import type {
	Config,
	specify_type_nested,
	specify_type_with_nested,
	specify_types_instance,
	validate_call_argument_1_match,
} from '../types.ts';

import type {
	prepend_with_imports,
} from '../TypeReferences.ts';
import {
	to_string,
	Types,
} from '../TypeReferences.ts';

type CandidateBinaryExpressionString = (
	& BinaryExpression
	& {
		left: Identifier,
		operatorToken: {
			kind: SyntaxKind.PlusToken,
		},
		right: StringLiteral,
	}
);

type CandidateBinaryExpressionStringConcat = (
	& BinaryExpression
	& {
		left: CandidateBinaryExpressionString,
		operatorToken: {
			kind: SyntaxKind.PlusToken,
		},
		right: (
			| Identifier
			| PropertyAccessExpression
			| CallExpression
		),
	}
);

type instancePath_initializer = (
	| StringLiteral
	| CandidateBinaryExpressionString
	| CandidateBinaryExpressionStringConcat
);

type argument_1_property_instancePath = (
	& (
		| ShorthandPropertyAssignment
		| (
			& PropertyAssignment
			& {
				initializer: instancePath_initializer,
			}
		)
	)
	& {
		name: (
			& Identifier
			& {
				text: 'instancePath',
			}
		),
	}
);

type Candidate = (
	& CallExpression
	& {
		expression: (
			& Identifier
			& {
				text: `validate${number}`,
			}
		),
		arguments: (
			& NodeArray<(
				| Identifier
				| PropertyAccessExpression
				| ObjectLiteralExpression
				| ElementAccessExpression
			)>
			& {
				length: 2,
				0: (
					| Identifier
					| PropertyAccessExpression
					| ElementAccessExpression
				),
				1: (
					& ObjectLiteralExpression
					& {
						properties: (
							& NodeArray<PropertyAssignment>
							& {
								length: 5,
								0: argument_1_property_instancePath,
								2: (
									& PropertyAssignment
									& {
										name: (
											& Identifier
											& {
												text: 'parentDataProperty',
											}
										),
										initializer: (
											| StringLiteral
											| Identifier
										),
									}
								),
							}
						),
					}
				),
			}
		),
	}
);

const unique_id = Symbol('unique_id');

export type ValidateCallInfo = {
	name: string,

	// we're using null here as a placeholder for stuff we're not supporting
	instancePath: (
		| null
		| [string]
		| [string | null, ...(string | null)[]]
	),

	parentDataProperty: string | null,

	[unique_id]: string,
};

export default class CollectValidateCalls extends ConditionalPreprocessor<
	Candidate
> {
	constructor(validate_calls: {
		[key: string]: [
			ValidateCallInfo,
			...ValidateCallInfo[],
		],
	}) {
		super(
			(maybe): maybe is Candidate => (
				isCallExpression(maybe)
				&& isIdentifier(maybe.expression)
				&& this.validate_function_name.test(maybe.expression.text)
				&& 2 === maybe.arguments.length
				&& (
					isIdentifier(maybe.arguments[0])
					|| isPropertyAccessExpression(maybe.arguments[0])
					|| isElementAccessExpression(maybe.arguments[0])
				)
				&& isObjectLiteralExpression(maybe.arguments[1])
				&& 5 === maybe.arguments[1].properties.length
				&& (
					(
						isShorthandPropertyAssignment(
							maybe.arguments[1].properties[0],
						)
						|| (
							isPropertyAssignment(
								maybe.arguments[1].properties[0],
							)
							&& this.#is_instancePath_initializer(
								maybe.arguments[
									1
								].properties[
									0
								].initializer,
							)
						)
					)
					&& isIdentifier(
						maybe.arguments[1].properties[0].name,
					)
					&& 'instancePath' === maybe.arguments[
						1
					].properties[
						0
					].name.text
				)
				&& (
					isShorthandPropertyAssignment(maybe.arguments[1].properties[2])
					|| (
						isPropertyAssignment(maybe.arguments[1].properties[2])
				&& (
					isStringLiteral(
						maybe.arguments[1].properties[2].initializer,
					)
					|| isIdentifier(
						maybe.arguments[1].properties[2].initializer,
					)
				)
					)
				)
				&& isIdentifier(maybe.arguments[1].properties[2].name)
				&& 'parentDataProperty' === (
					maybe.arguments[1].properties[2].name.text
				)
			),
			(node) => {
				let checking: Node | undefined = node.parent;

				while (checking) {
					if (
						isFunctionDeclaration(checking)
						&& !!checking.name
						&& isIdentifier(checking.name)
						&& this.validate_function_name.test(
							checking.name.text,
						)
					) {
						const called_in = checking.name.getText();

						let instancePath: ValidateCallInfo['instancePath'];

						if (isShorthandPropertyAssignment(
							node.arguments[1].properties[0],
						)) {
							instancePath = null;
						} else if (isStringLiteral(
							node.arguments[1].properties[0].initializer,
						)) {
							instancePath = [
								node.arguments[
									1
								].properties[
									0
								].initializer.text,
							];
						} else {
							// oxlint-disable-next-line @stylistic/max-len
							instancePath = this.#unpack_CandidateBinaryExpression(
								node.arguments[1].properties[0].initializer,
							);
						}

						const info: Omit<
							ValidateCallInfo,
							typeof unique_id
						> = {
							name: node.expression.text,
							instancePath,
							parentDataProperty: (
								(
									isPropertyAssignment(
										node.arguments[
											1
										].properties[
											2
										]
									)
									&& isStringLiteral(
									node.arguments[
										1
									].properties[
										2
									].initializer,
								)
								)
									? node.arguments[
										1
									].properties[
										2
									].initializer.text
									: null
							),
						};

						const with_id: ValidateCallInfo = {
							...info,
							[unique_id]: JSON.stringify(info),
						};

						if (!(called_in in validate_calls)) {
							validate_calls[called_in] = [with_id];
						} else if (!validate_calls[called_in].find((
							maybe,
						) => maybe[unique_id] === with_id[unique_id])) {
							validate_calls[called_in].push(with_id);
						}

						return true;
					}

					checking = checking.parent;
				}

				return false;
			},
		);
	}

	#is_CandidateBinaryExpressionString(
		maybe: Node,
	): maybe is CandidateBinaryExpressionString {
		return (
			isBinaryExpression(maybe)
			&& (
				isIdentifier(maybe.left)
				|| this.#is_CandidateBinaryExpressionStringConcat(maybe.left)
			)
			&& SyntaxKind.PlusToken === maybe.operatorToken.kind
			&& isStringLiteral(maybe.right)
		);
	}

	#is_CandidateBinaryExpressionStringConcat(
		maybe: Node,
	): maybe is CandidateBinaryExpressionStringConcat {
		return (
			isBinaryExpression(maybe)
			&& (
				this.#is_CandidateBinaryExpressionString(maybe.left)
			)
			&& SyntaxKind.PlusToken === maybe.operatorToken.kind
			&& (
				isIdentifier(maybe.right)
				|| isPropertyAccessExpression(maybe.right)
				|| isCallExpression(maybe.right)
			)
		);
	}

	#is_instancePath_initializer(
		maybe: Node,
	): maybe is instancePath_initializer {
		return (
			isStringLiteral(maybe)
			|| this.#is_CandidateBinaryExpressionString(maybe)
			|| this.#is_CandidateBinaryExpressionStringConcat(maybe)
		);
	}

	#unpack_CandidateBinaryExpression(
		from: (
			| CandidateBinaryExpressionString
			| CandidateBinaryExpressionStringConcat
		),
		current: (null | string)[] = [],
	): [
		(string | null),
		...(string | null)[],
	] {
		if (isIdentifier(from.left)) {
			return [
				null,
				(
					isStringLiteral(from.right)
						? from.right.text
						: null
				),
				...current,
			];
		}

		return this.#unpack_CandidateBinaryExpression(from.left, [null]);
	}

	static specify_types_from_collected(
		info: {
			[key: string]: [
				ValidateCallInfo,
				...ValidateCallInfo[],
			],
		},
		config: Partial<Config>,
		existing: specify_types_instance,
		prepend_with_imports: prepend_with_imports,
	) {
		this.#specify_types_from_collected_inside_out(
			info,
			config,
			existing,
			prepend_with_imports,
		);
		this.#specify_types_from_collected_outside_in(
			info,
			config,
			existing,
			prepend_with_imports,
		);
	}

	static #specify_types_from_collected_outside_in(
		info: {
			[key: string]: [
				ValidateCallInfo,
				...ValidateCallInfo[],
			],
		},
		config: Partial<Config>,
		existing: specify_types_instance,
		prepend_with_imports: prepend_with_imports,
	) {
		const configurable = Object.entries(config.specify_types || {})
			.filter((maybe): maybe is [
				string,
				specify_type_with_nested,
			] => 3 === maybe[1].length)
			.map(([key, not_object]): [
				string,
				[
					ReturnType<(typeof Types)['toObject']>,
					(typeof not_object)[1],
					(typeof not_object)[2],
					string,
				],
			] => {
				const as_object = Types.toObject(not_object[0]);

				return [
					key,
					[
						as_object,
						not_object[1],
						not_object[2],
						to_string(as_object),
					],
				];
			});

		if (configurable.length < 1) {
			return;
		}

		const existing_entries = Object.entries(existing);

		for (const [
			,
			[
				,,
				sub_types,
				as_string,
			],
		] of configurable) {
			const found = existing_entries.find((maybe) => (
				to_string(maybe[1]) === as_string
			));

			if (!found) {
				continue;
			}

			const [function_name] = found;

			if (!(function_name in info)) {
				continue;
			}

			this.#specify_types_from_collected_outside_in_deep_dive(
				info,
				function_name,
				sub_types,
				existing,
				prepend_with_imports,
			);
		}
	}

	static #specify_types_from_collected_inside_out(
		info: {
			[key: string]: [
				ValidateCallInfo,
				...ValidateCallInfo[],
			],
		},
		config: Partial<Config>,
		existing: specify_types_instance,
		prepend_with_imports: prepend_with_imports,
	) {
		const configurable = config.specify_types_by_inside_out_match || [];

		if (configurable.length < 1) {
			return;
		}

		const info_entries = Object.entries(info);

		for (const [
			sub_type,
			source,
			match_with,
			parent_is,
		] of configurable) {
			for (const [parent_function, has_calls] of info_entries) {
				const checking = this.#filter_info(
					match_with,
					has_calls,
				);

				if (1 === checking.length) {
					if (!(source in prepend_with_imports)) {
						prepend_with_imports[source] = new Types();
					}

					if (!(parent_is[1] in prepend_with_imports)) {
						prepend_with_imports[parent_is[1]] = new Types();
					}

					existing[checking[0].name] = prepend_with_imports[
						source
					].add(sub_type);

					existing[parent_function] = prepend_with_imports[
						parent_is[1]
					].add(parent_is[0]);
				}
			}
		}
	}

	static #filter_info(
		{
			instancePath,
			instancePath_partial,
			parentDataProperty,
		}: validate_call_argument_1_match,
		checking: ValidateCallInfo[],
	) {
		if (undefined !== instancePath_partial) {
			checking = checking.filter((maybe) => (
				maybe.instancePath
				&& maybe.instancePath.includes(
					instancePath_partial,
				)
			));
		} else if (undefined !== instancePath) {
			checking = checking.filter((maybe) => (
				(
				maybe.instancePath
				&& 1 === maybe.instancePath.length
				&& maybe.instancePath[0] === instancePath
				)
				|| (
					maybe.instancePath === null
					&& instancePath === null
				)
			));
		}

		if (parentDataProperty) {
			checking = checking.filter((maybe) => (
				maybe.parentDataProperty === parentDataProperty
			));
		}

		return checking;
	}

	static #specify_types_from_collected_outside_in_deep_dive(
		info: {
			[key: string]: [
				ValidateCallInfo,
				...ValidateCallInfo[],
			],
		},
		function_name: keyof typeof info,
		sub_types: [specify_type_nested, ...specify_type_nested[]],
		existing: specify_types_instance,
		prepend_with_imports: prepend_with_imports,
	) {
		for (const sub_type of sub_types) {
			const [,, match_with] = sub_type;

			const checking = this.#filter_info(
				match_with,
				info[function_name],
			).filter((maybe) => !(maybe.name in existing));

			if (1 === checking.length) {
				if (!(sub_type[1] in prepend_with_imports)) {
					prepend_with_imports[sub_type[1]] = new Types();
				}

				existing[checking[0].name] = prepend_with_imports[
					sub_type[1]
				].add(sub_type[0]);

				if (4 === sub_type.length && checking[0].name in info) {
					this.#specify_types_from_collected_outside_in_deep_dive(
						info,
						checking[0].name,
						sub_type[3],
						existing,
						prepend_with_imports,
					);
				}
			} else if (checking.length > 0) {
				throw new Error('Unexpected matches found!');
			}
		}
	}
}
