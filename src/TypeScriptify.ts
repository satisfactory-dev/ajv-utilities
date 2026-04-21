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
	prepend_with_imports,
} from './TypeScriptify/types.ts';

import SpecifyTypes from './TypeScriptify/preprocessors/SpecifyTypes.ts';

// oxlint-disable-next-line @stylistic/max-len
import RemoveSchemaDeclaration from './TypeScriptify/modifiers/RemoveSchemaDeclaration.ts';

import ModifyValidate from './TypeScriptify/modifiers/ModifyValidate.ts';

import ModifyVErrors from './TypeScriptify/modifiers/ModifyVErrors.ts';

// oxlint-disable-next-line @stylistic/max-len
import TypecastEvalulated from './TypeScriptify/modifiers/TypecastEvalulated.ts';

import TypecastSetErrors from './TypeScriptify/modifiers/TypecastSetErrors.ts';

// oxlint-disable-next-line @stylistic/max-len
import AddErrorObjectType from './TypeScriptify/modifiers/AddErrorObjectType.ts';

// oxlint-disable-next-line @stylistic/max-len
import TypecastVErrorsPush from './TypeScriptify/modifiers/TypecastVErrorsPush.ts';

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

export default class TypeScript {
	ify(code: string, config: Partial<Config>): string {
		code = esmify(code);
		const source = createSourceFile(
			'ify.js',
			code,
			ScriptTarget.ESNext,
			true,
		);

		const specify_types: {
			[key: string]: Config['specify_types'][string][0],
		} = {};

		let result = transform(source, [
			(context) => this.#first_pass(
				context,
				config,
				specify_types,
			),
		]);

		result = transform(result.transformed[0], [
			(context) => this.#second_pass(
				context,
				config,
				Object.freeze(specify_types),
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

					return visitEachChild(
						action,
						visitor,
						context,
					);
				}
			}

			return visitEachChild(node, visitor, context);
		};

		return visitor;
	}

	#first_pass(
		context: TransformationContext,
		config: Partial<Config>,
		specify_types: {
			[key: string]: Config['specify_types'][string][0],
		},
	) {
		const prepend_with_imports: prepend_with_imports = {
			ajv: new Set(),
			'@satisfactory-dev/ajv-utilities': new Set(),
		};

		let patch_with_is_array = false;
		let patch_with_is_object = false;

		const visitor = this.#generate_visitor(
			context,
			config,
			[
				new SpecifyTypes(prepend_with_imports, specify_types),
			],
			[
				new RemoveSchemaDeclaration(),
				new ModifyValidate(prepend_with_imports),
				new ModifyVErrors(prepend_with_imports),
				new TypecastEvalulated(prepend_with_imports),
				new TypecastSetErrors(prepend_with_imports),
				new AddErrorObjectType(prepend_with_imports),
				new TypecastVErrorsPush(prepend_with_imports),
				new QuestionableCondition(),
				new Ucs2LengthCorrection(),
				new PatchIsObject(() => {
					patch_with_is_object = true;
				}),
				new PatchIsArray(() => {
					patch_with_is_array = true;
				}),
				new SpecifyIndicesType(),
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
						].sort((a, b) => a.localeCompare(b)).map((
							identifier,
						) => factory.createImportSpecifier(
							false,
							undefined,
							factory.createIdentifier(identifier),
						))),
					),
					factory.createStringLiteral(from, true),
				));
			}

			let modified: Statement[] | undefined = undefined;

			if (patch_with_is_array) {
				modified = [
					PatchIsArray.patch(),
					...(modified || result.statements),
				];
			}

			if (patch_with_is_object) {
				modified = [
					PatchIsObject.patch(),
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

	#second_pass(
		context: TransformationContext,
		config: Partial<Config>,
		specify_types: Readonly<{
			[key: string]: Config['specify_types'][string][0],
		}>,
	) {
		if (Object.keys(specify_types).length < 1) {
			return (source: SourceFile) => source;
		}

		const visitor = this.#generate_visitor(
			context,
			config,
			[],
			[
				new SpecifyTypePredicate(specify_types),
			],
		);

		return (
			source: SourceFile,
		) => visitNode(source, visitor) as SourceFile;
	}
}
