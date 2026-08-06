import {
	esmify,
} from './AjvUtilities.ts';

import type {
	createPrinter,
	createSourceFile,
	EmitHint,
	factory,
	ImportDeclaration,
	isArrayLiteralExpression,
	isBinaryExpression,
	isBlock,
	isCallExpression,
	isConditionalExpression,
	isElementAccessExpression,
	isEmptyStatement,
	isExpressionStatement,
	isFunctionDeclaration,
	isIdentifier,
	isIfStatement,
	isObjectBindingPattern,
	isObjectLiteralExpression,
	isPrefixUnaryExpression,
	isPropertyAccessExpression,
	isPropertyAssignment,
	isShorthandPropertyAssignment,
	isStringLiteral,
	isToken,
	isTypeOfExpression,
	isVariableDeclaration,
	isVariableStatement,
	Node,
	NodeFlags,
	ScriptTarget,
	SourceFile,
	Statement,
	SyntaxKind,
	transform,
	TransformationContext,
	visitEachChild,
	visitNode,
	Visitor,
} from '@typescript/typescript6';

import {
	ConditionalModification,
	ConditionalPreprocessor,
} from './TypeScriptify/abstracts.ts';

import type {
	Config,
	specify_types_instance,
} from './TypeScriptify/types.ts';

import type{
	prepend_with_imports,
} from './TypeScriptify/TypeReferences.ts';
import {
	Types,
} from './TypeScriptify/TypeReferences.ts';

import {
	SpecifyTypesBySourceURL,
} from './TypeScriptify/preprocessors/SpecifyTypes.ts';

// oxlint-disable-next-line @stylistic/max-len
import RemoveSchemaDeclaration from './TypeScriptify/modifiers/RemoveSchemaDeclaration.ts';

import type {
	specify_modify_options_name_config,
} from './TypeScriptify/modifiers/ModifyValidate.ts';
import {
	ModifyValidateOptions,
	ModifyValidateOptionsByConfig,
	SpecifyModifyCandidates,
} from './TypeScriptify/modifiers/ModifyValidate.ts';

import {
	ConditionalLengthSet,
	DirectTernaryConcat,
	ModifyVErrors,
	ReplaceVErrorsPushIfElse,
	WrappedTernaryConcat,
} from './TypeScriptify/modifiers/ModifyVErrors.ts';

// oxlint-disable-next-line @stylistic/max-len
import {
	QuestionableEvaluatedProperty,
	TypecastEvalulated,
} from './TypeScriptify/modifiers/TypecastEvalulated.ts';

import TypecastSetErrors from './TypeScriptify/modifiers/TypecastSetErrors.ts';

// oxlint-disable-next-line @stylistic/max-len
import AddErrorObjectType from './TypeScriptify/modifiers/AddErrorObjectType.ts';

// oxlint-disable-next-line @stylistic/max-len
import QuestionableCondition from './TypeScriptify/modifiers/QuestionableCondition.ts';

// oxlint-disable-next-line @stylistic/max-len
import Ucs2LengthCorrection from './TypeScriptify/modifiers/Ucs2LengthCorrection.ts';

import PatchIsObject from './TypeScriptify/patchers/PatchIsObject.ts';

import PatchIsArray from './TypeScriptify/patchers/PatchIsArray.ts';

// oxlint-disable-next-line @stylistic/max-len
import SpecifyTypePredicate from './TypeScriptify/modifiers/SpecifyTypePredicate.ts';

// oxlint-disable-next-line @stylistic/max-len
import SpecifyIndicesType from './TypeScriptify/modifiers/SpecifyIndicesType.ts';

import type {
	hoist_candidates,
} from './TypeScriptify/modifiers/HoistDeclarationAsUndefined.ts';
import {
	FindHoistCandidate,
	HoistDeclarationsHere,
} from './TypeScriptify/modifiers/HoistDeclarationAsUndefined.ts';

// oxlint-disable-next-line @stylistic/max-len
import TypecastArrayAsConst from './TypeScriptify/modifiers/TypecastArrayAsConst.ts';

// oxlint-disable-next-line @stylistic/max-len
import UnboundThis_hasOwnProperty from './TypeScriptify/modifiers/UnboundThis.ts';

// oxlint-disable-next-line @stylistic/max-len
import HoistDeclarationAsZero from './TypeScriptify/modifiers/HoistDeclarationAsZero.ts';

// oxlint-disable-next-line @stylistic/max-len
import PatchDefinitelyHasEvaluated from './TypeScriptify/patchers/PatchDefinitelyHasEvaluated.ts';

// oxlint-disable-next-line @stylistic/max-len
import type {
	ValidateCallInfo,
} from './TypeScriptify/preprocessors/CollectValidateCalls.ts';

// oxlint-disable-next-line @stylistic/max-len
import CollectValidateCalls from './TypeScriptify/preprocessors/CollectValidateCalls.ts';

// oxlint-disable-next-line @stylistic/max-len
import ModifyValidateWrapper from './TypeScriptify/modifiers/ModifyValidateWrapper.ts';

import AddGenericT from './TypeScriptify/modifiers/AddGenericT.ts';

// oxlint-disable-next-line @stylistic/max-len
import PatchIsDefinitelyNotTrue from './TypeScriptify/patchers/PatchIsDefinitelyNotTrue.ts';

import type {
	Collected,
} from './TypeScriptify/preprocessors/CollectEvaluatedProperties.ts';

// oxlint-disable-next-line @stylistic/max-len
import CollectEvaluatedProperties from './TypeScriptify/preprocessors/CollectEvaluatedProperties.ts';

// oxlint-disable-next-line @stylistic/max-len
import TypecastEvalulatedProperties from './TypeScriptify/modifiers/TypecastEvaluatedProperties.ts';

// oxlint-disable-next-line @stylistic/max-len
import PatchEvaluatedPropertiesLike from './TypeScriptify/patchers/PatchEvaluatedPropertiesLike.ts';

import SpecifyErrsType from './TypeScriptify/modifiers/SpecifyErrsType.ts';

export type ts = {
	createPrinter: typeof createPrinter,
	createSourceFile: typeof createSourceFile,
	EmitHint: typeof EmitHint,
	factory: typeof factory,
	isArrayLiteralExpression: typeof isArrayLiteralExpression,
	isBinaryExpression: typeof isBinaryExpression,
	isBlock: typeof isBlock,
	isCallExpression: typeof isCallExpression,
	isConditionalExpression: typeof isConditionalExpression,
	isElementAccessExpression: typeof isElementAccessExpression,
	isEmptyStatement: typeof isEmptyStatement,
	isExpressionStatement: typeof isExpressionStatement,
	isFunctionDeclaration: typeof isFunctionDeclaration,
	isIdentifier: typeof isIdentifier,
	isIfStatement: typeof isIfStatement,
	isObjectBindingPattern: typeof isObjectBindingPattern,
	isObjectLiteralExpression: typeof isObjectLiteralExpression,
	isPrefixUnaryExpression: typeof isPrefixUnaryExpression,
	isPropertyAccessExpression: typeof isPropertyAccessExpression,
	isPropertyAssignment: typeof isPropertyAssignment,
	isShorthandPropertyAssignment: typeof isShorthandPropertyAssignment,
	isStringLiteral: typeof isStringLiteral,
	isToken: typeof isToken,
	isTypeOfExpression: typeof isTypeOfExpression,
	isVariableDeclaration: typeof isVariableDeclaration,
	isVariableStatement: typeof isVariableStatement,
	NodeFlags: typeof NodeFlags,
	ScriptTarget: typeof ScriptTarget,
	SyntaxKind: typeof SyntaxKind,
	transform: typeof transform,
	visitEachChild: typeof visitEachChild,
	visitNode: typeof visitNode,
};

export default class TypeScript {
	#ts: ts;

	constructor(ts: ts) {
		this.#ts = ts;
	}

	ify(code: string, config: Partial<Config>): string {
		code = esmify(code);
		const source = this.#ts.createSourceFile(
			'ify.js',
			code,
			this.#ts.ScriptTarget.ESNext,
			true,
		);

		const specify_types: specify_types_instance = {};
		const hoist_candidates: hoist_candidates = {};
		const specify_modify_options_name_config: (
			specify_modify_options_name_config
		) = {};

		const validate_calls = {};

		const prepend_with_imports: prepend_with_imports = {
			ajv: new Types(),
			'ajv/dist/types/index.js': new Types(),
			'@satisfactory-dev/ajv-utilities': new Types(),
		};

		let patch_with_is_array = false;
		let patch_with_is_object = false;
		let patch_with_definitely_has_evaluated = false;
		let patch_with_definitely_not_true = false;
		let patch_with_evaluated_properties_like = false;

		const collected_properties: Collected = new Map();

		let result = this.#ts.transform(source, [
			(context) => this.#first_pass(
				context,
				config,
				specify_types,
				specify_modify_options_name_config,
				hoist_candidates,
				validate_calls,
				prepend_with_imports,
				{
					is_array: () => {
						patch_with_is_array = true;
					},
					is_object: () => {
						patch_with_is_object = true;
					},
					definitely_has_evaluated: () => {
						patch_with_definitely_has_evaluated = true;
					},
					definitely_not_true: () => {
						patch_with_definitely_not_true = true;
					},
					evaluated_properties_like: () => {
						patch_with_evaluated_properties_like = true;
					},
				},
				collected_properties,
			),
		]);

		if (Object.keys(validate_calls).length > 0) {
			CollectValidateCalls.specify_types_from_collected(
				this.#ts,
				validate_calls,
				config,
				specify_types,
				prepend_with_imports,
			);
		}

		result = this.#ts.transform(result.transformed[0], [
			(context) => this.#second_pass(
				context,
				config,
				Object.freeze(specify_types),
				Object.freeze(specify_modify_options_name_config),
				Object.freeze(hoist_candidates),
				prepend_with_imports,
				{
					is_array: patch_with_is_array,
					is_object: patch_with_is_object,
					definitely_has_evaluated: (
						patch_with_definitely_has_evaluated
					),
					definitely_not_true: (
						patch_with_definitely_not_true
					),
					evaluated_properties_like: (
						patch_with_evaluated_properties_like
					),
				},
			),
		]);

		code = this.#ts.createPrinter().printFile(result.transformed[0]);

		return code.replace('"use strict";\n', '');
	}

	#generate_visitor(
		context: TransformationContext,
		config: Partial<Config>,
		preprocess: unknown[],
		modifiers: unknown[],
	) {
		ConditionalPreprocessor.check(preprocess);
		ConditionalModification.check(modifiers);

		const visitor: Visitor = (node: Node) => {
			for (const non_modifier of preprocess) {
				if (non_modifier.passes(node, config)) {
					non_modifier.visit(node, config);
				}
			}

			for (const maybe of modifiers) {
				if (maybe.passes(node, config)) {
					const action = maybe.visit(node, config);

					if (false === action) {
						continue;
					} else if (undefined === action) {
						return undefined;
					}

					node = action;
				}
			}

			return this.#ts.visitEachChild(node, visitor, context);
		};

		return visitor;
	}

	#first_pass(
		context: TransformationContext,
		config: Partial<Config>,
		specify_types: specify_types_instance,
		specify_modify_options_name_config: specify_modify_options_name_config,
		hoist_candidates: hoist_candidates,
		validate_calls: {
			[key: string]: [
				ValidateCallInfo,
				...ValidateCallInfo[],
			],
		},
		prepend_with_imports: prepend_with_imports,
		patch_with: {
			is_array: () => void,
			is_object: () => void,
			definitely_has_evaluated: () => void,
			definitely_not_true: () => void,
			evaluated_properties_like: () => void,
		},
		collected_properties: Collected,
	) {
		const visitor = this.#generate_visitor(
			context,
			config,
			[
				new CollectValidateCalls(this.#ts, validate_calls),
				new SpecifyTypesBySourceURL(
					this.#ts,
					prepend_with_imports,
					specify_types,
				),
				new SpecifyModifyCandidates(
					this.#ts,
					specify_modify_options_name_config,
				),
				new CollectEvaluatedProperties(
					this.#ts,
					config.specify_properties || [],
					collected_properties,
				),
			],
			[
				new RemoveSchemaDeclaration(this.#ts),
				new ModifyValidateOptions(this.#ts, prepend_with_imports),
				new ModifyVErrors(this.#ts, prepend_with_imports),
				new ReplaceVErrorsPushIfElse(this.#ts),
				new ConditionalLengthSet(this.#ts),
				new DirectTernaryConcat(this.#ts, prepend_with_imports),
				new WrappedTernaryConcat(this.#ts, prepend_with_imports),
				new QuestionableEvaluatedProperty(this.#ts),
				new TypecastEvalulated(this.#ts, prepend_with_imports),
				new TypecastSetErrors(this.#ts, prepend_with_imports),
				new AddErrorObjectType(this.#ts, prepend_with_imports),
				new QuestionableCondition(this.#ts),
				new Ucs2LengthCorrection(this.#ts),
				new PatchIsObject(this.#ts, patch_with.is_object),
				new PatchIsArray(this.#ts, patch_with.is_array),
				new SpecifyIndicesType(this.#ts),
				new FindHoistCandidate(this.#ts, hoist_candidates),
				new TypecastArrayAsConst(this.#ts),
				new UnboundThis_hasOwnProperty(this.#ts),
				new HoistDeclarationAsZero(this.#ts),
				new PatchDefinitelyHasEvaluated(
					this.#ts,
					prepend_with_imports,
					patch_with.definitely_has_evaluated,
				),
				new PatchIsDefinitelyNotTrue(
					this.#ts,
					patch_with.definitely_not_true,
					collected_properties,
				),
				new ModifyValidateWrapper(this.#ts, prepend_with_imports),
				new TypecastEvalulatedProperties(
					this.#ts,
					prepend_with_imports,
					collected_properties,
					patch_with.evaluated_properties_like,
				),
				new SpecifyErrsType(this.#ts),
			],
		);

		return (
			source: SourceFile,
		) => this.#ts.visitNode(source, visitor) as SourceFile;
	}

	#second_pass(
		context: TransformationContext,
		config: Partial<Config>,
		specify_types: Readonly<specify_types_instance>,
		specify_modify_options_name_config: Readonly<
			specify_modify_options_name_config
		>,
		hoist_candidates: Readonly<hoist_candidates>,
		prepend_with_imports: prepend_with_imports,
		patch_with: {
			is_array: boolean,
			is_object: boolean,
			definitely_has_evaluated: boolean,
			definitely_not_true: boolean,
			evaluated_properties_like: boolean,
		},
	) {
		const visitor = this.#generate_visitor(
			context,
			config,
			[],
			[
				new SpecifyTypePredicate(this.#ts, specify_types),
				new HoistDeclarationsHere(
					this.#ts,
					hoist_candidates,
					prepend_with_imports,
				),
				new ModifyValidateOptionsByConfig(
					this.#ts,
					specify_modify_options_name_config,
				),
				new AddGenericT(this.#ts, specify_types),
			],
		);

		const transformer = (
			source: SourceFile,
		) => {
			const result = this.#ts.visitNode(source, visitor) as SourceFile;

			const imports: ImportDeclaration[] = [];

			for (const [from, types] of Object.entries(prepend_with_imports)) {
				if (types.size < 1) {
					continue;
				}

				imports.push(this.#ts.factory.createImportDeclaration(
					undefined,
					this.#ts.factory.createImportClause(
						this.#ts.SyntaxKind.TypeKeyword,
						undefined,
						this.#ts.factory.createNamedImports([
							...types,
						].sort((a, b) => a.id.localeCompare(b.id)).map((
							identifier,
						) => identifier.toImportSpecifier())),
					),
					this.#ts.factory.createStringLiteral(from, true),
				));
			}

			let modified: Statement[] | undefined = undefined;

			if (patch_with.is_array) {
				modified = [
					PatchIsArray.patch(this.#ts),
					...(modified || result.statements),
				];
			}

			if (patch_with.is_object) {
				modified = [
					PatchIsObject.patch(this.#ts),
					...(modified || result.statements),
				];
			}

			if (patch_with.definitely_has_evaluated) {
				modified = [
					PatchDefinitelyHasEvaluated.patch(this.#ts),
					...(modified || result.statements),
				];
			}

			if (patch_with.definitely_not_true) {
				modified = [
					PatchIsDefinitelyNotTrue.patch(this.#ts),
					...(modified || result.statements),
				];
			}

			if (patch_with.evaluated_properties_like) {
				modified = [
					PatchEvaluatedPropertiesLike.patch(this.#ts),
					...(modified || result.statements),
				];
			}

			if (imports.length > 0) {
				modified = [
					...imports,
					...(modified || result.statements),
				];
			}

			if (modified) {
				return this.#ts.factory.updateSourceFile(
					source,
					modified,
				);
			}

			return result;
		};

		return transformer;
	}
}
