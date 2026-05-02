import {
	esmify,
} from './AjvUtilities.ts';

import type {
	ImportDeclaration,
	Node,
	SourceFile,
	Statement,
	TransformationContext,
	Visitor,
} from 'typescript';
import {
	createPrinter,
	createSourceFile,
	factory,
	ScriptTarget,
	SyntaxKind,
	transform,
	visitEachChild,
	visitNode,
} from 'typescript';

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

export default class TypeScript {
	ify(code: string, config: Partial<Config>): string {
		code = esmify(code);
		const source = createSourceFile(
			'ify.js',
			code,
			ScriptTarget.ESNext,
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
			'@satisfactory-dev/ajv-utilities': new Types(),
		};

		let patch_with_is_array = false;
		let patch_with_is_object = false;
		let patch_with_definitely_has_evaluated = false;

		let result = transform(source, [
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
				},
			),
		]);

		if (Object.keys(validate_calls).length > 0) {
			CollectValidateCalls.specify_types_from_collected(
				validate_calls,
				config,
				specify_types,
				prepend_with_imports,
			);
		}

		result = transform(result.transformed[0], [
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
				},
			),
		]);

		code = createPrinter().printFile(result.transformed[0]);

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

			return visitEachChild(node, visitor, context);
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
		},
	) {
		const visitor = this.#generate_visitor(
			context,
			config,
			[
				new CollectValidateCalls(validate_calls),
				new SpecifyTypesBySourceURL(
					prepend_with_imports,
					specify_types,
				),
				new SpecifyModifyCandidates(
					specify_modify_options_name_config,
				),
			],
			[
				new RemoveSchemaDeclaration(),
				new ModifyValidateOptions(prepend_with_imports),
				new ModifyVErrors(prepend_with_imports),
				new ReplaceVErrorsPushIfElse(),
				new ConditionalLengthSet(),
				new DirectTernaryConcat(prepend_with_imports),
				new WrappedTernaryConcat(prepend_with_imports),
				new QuestionableEvaluatedProperty(),
				new TypecastEvalulated(prepend_with_imports),
				new TypecastSetErrors(prepend_with_imports),
				new AddErrorObjectType(prepend_with_imports),
				new QuestionableCondition(),
				new Ucs2LengthCorrection(),
				new PatchIsObject(patch_with.is_object),
				new PatchIsArray(patch_with.is_array),
				new SpecifyIndicesType(),
				new FindHoistCandidate(hoist_candidates),
				new TypecastArrayAsConst(),
				new UnboundThis_hasOwnProperty(),
				new HoistDeclarationAsZero(),
				new PatchDefinitelyHasEvaluated(
					prepend_with_imports,
					patch_with.definitely_has_evaluated,
				),
				new ModifyValidateWrapper(prepend_with_imports),
			],
		);

		return (
			source: SourceFile,
		) => visitNode(source, visitor) as SourceFile;
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
		},
	) {
		const visitor = this.#generate_visitor(
			context,
			config,
			[],
			[
				new SpecifyTypePredicate(specify_types),
				new HoistDeclarationsHere(hoist_candidates),
				new ModifyValidateOptionsByConfig(
					specify_modify_options_name_config,
				),
			],
		);

		const transformer = (
			source: SourceFile,
		) => {
			const result = visitNode(source, visitor) as SourceFile;

			const imports: ImportDeclaration[] = [];

			for (const [from, types] of Object.entries(prepend_with_imports)) {
				if (types.size < 1) {
					continue;
				}

				imports.push(factory.createImportDeclaration(
					undefined,
					factory.createImportClause(
						SyntaxKind.TypeKeyword,
						undefined,
						factory.createNamedImports([
							...types,
						].sort((a, b) => a.id.localeCompare(b.id)).map((
							identifier,
						) => identifier.toImportSpecifier())),
					),
					factory.createStringLiteral(from, true),
				));
			}

			let modified: Statement[] | undefined = undefined;

			if (patch_with.is_array) {
				modified = [
					PatchIsArray.patch(),
					...(modified || result.statements),
				];
			}

			if (patch_with.is_object) {
				modified = [
					PatchIsObject.patch(),
					...(modified || result.statements),
				];
			}

			if (patch_with.definitely_has_evaluated) {
				modified = [
					PatchDefinitelyHasEvaluated.patch(),
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
				return factory.updateSourceFile(
					source,
					modified,
				);
			}

			return result;
		};

		return transformer;
	}
}
