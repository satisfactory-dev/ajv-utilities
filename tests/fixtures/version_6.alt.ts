import type { ErrorObject } from 'ajv';
import type { IsStandalone, StandaloneDataValidationCxt } from '@satisfactory-dev/ajv-utilities';
import type { stub_Collection, stubs } from './types.ts';
function ajv_utiltiies__definitely_evaluated<T>(maybe: IsStandalone<T>): Exclude<IsStandalone<T>["evaluated"], undefined> { if (undefined === maybe.evaluated)
    throw new Error(`${maybe.name}.evaluated not set!`); return maybe.evaluated; }
function ajv_utilities__is_probably_object(maybe: unknown): maybe is Record<string, unknown> { return !!maybe && typeof maybe === "object" && !Array.isArray(maybe); }
function ajv_utilities__is_probably_array(maybe: unknown): maybe is unknown[] { return Array.isArray(maybe); }
import { ucs2length } from '@satisfactory-dev/ajv-utilities/ajv';
export const version_6_validator = validate20;
const schema31 = { "$schema": "https://json-schema.org/draft/2020-12/schema", "$id": "production-planner-save-version-6", "type": "object", "required": ["version", "collections", "groups", "pools", "settings"] as const, "additionalProperties": false, "$defs": { "id": { "type": "integer", "minimum": 1 }, "name": { "type": "string", "minLength": 1, "pattern": "^(?!\\s+).+(?<!\\s)$" }, "pool_reference": { "$ref": "#/$defs/id" }, "recipe_selection": { "type": "object", "additionalProperties": false, "minProperties": 1, "patternProperties": { "^(?:Desc|BP|Foundation)_[^.]+_C$": { "type": "string", "pattern": "^(?:Recipe|Build)_.+_C$" } } }, "collection": { "type": "object", "required": ["id", "items"] as const, "unevaluatedProperties": false, "additionalProperties": false, "properties": { "id": { "$ref": "#/$defs/id" }, "name": { "$ref": "#/$defs/name" }, "recipe_selection": { "$ref": "#/$defs/recipe_selection" }, "items": { "type": "array", "minItems": 0, "items": { "$ref": "#/$defs/id" } } } }, "collection_array": { "type": "array", "minItems": 1, "items": { "$ref": "#/$defs/collection" } }, "production_set": { "type": "object", "additionalProperties": false, "patternProperties": { "^(?:Desc|BP|Foundation)_[^.]+_C$": { "$ref": "docs.json.ts--production-planner--lib--CanConvertTypeJsonDefs#/$defs/CanConvertTypeJson" } } }, "outputs": { "type": "object", "required": ["instructions"] as const, "additionalProperties": false, "properties": { "instructions": { "type": "object", "minProperties": 1, "additionalProperties": false, "patternProperties": { "^(?:Desc|BP|Foundation)_[^.]+_C$": { "type": "array", "minItems": 1, "items": { "type": "object", "required": ["amount", "destination"] as const, "additionalProperties": false, "properties": { "amount": { "$ref": "docs.json.ts--production-planner--lib--CanConvertTypeJsonDefs#/$defs/CanConvertTypeJson" }, "destination": { "type": "object", "required": ["type", "id"] as const, "additionalProperties": false, "properties": { "type": { "type": "string", "enum": ["pool"] as const }, "id": { "$ref": "#/$defs/id" } } } } } } } } } }, "pool": { "type": "object", "required": ["id"] as const, "unevaluatedProperties": false, "additionalProperties": false, "properties": { "id": { "$ref": "#/$defs/id" }, "name": { "$ref": "#/$defs/name" }, "production": { "$ref": "#/$defs/production_set" }, "recipe_selection": { "$ref": "#/$defs/recipe_selection" }, "manual_input": { "$ref": "#/$defs/production_set" }, "outputs": { "$ref": "#/$defs/outputs" } } }, "settings": { "type": "object", "required": ["auto_follow_current_pool", "calculator_display_mode", "current_pool_id", "show_full_pool_button_list", "auto_recalculate"] as const, "unevaluatedProperties": false, "additionalProperties": false, "properties": { "auto_follow_current_pool": { "type": "boolean" }, "calculator_display_mode": { "type": "boolean" }, "current_pool_id": { "$ref": "#/$defs/pool_reference" }, "recipe_selection": { "$ref": "#/$defs/recipe_selection" }, "show_full_pool_button_list": { "type": "boolean" }, "auto_recalculate": { "$ref": "#/$defs/settings_auto_recalculate" } } }, "settings_auto_recalculate": { "type": "object", "required": ["recipe_selection_ui_change"] as const, "unevaluatedProperties": false, "additionalProperties": false, "properties": { "recipe_selection_ui_change": { "type": "boolean" } } } }, "properties": { "version": { "type": "integer", "const": 6 }, "pools": { "type": "array", "minItems": 1, "items": { "$ref": "#/$defs/pool" } }, "groups": { "$ref": "#/$defs/collection_array" }, "collections": { "$ref": "#/$defs/collection_array" }, "settings": { "$ref": "#/$defs/settings" } } };
const schema32 = { "type": "object", "required": ["id"] as const, "unevaluatedProperties": false, "additionalProperties": false, "properties": { "id": { "$ref": "#/$defs/id" }, "name": { "$ref": "#/$defs/name" }, "production": { "$ref": "#/$defs/production_set" }, "recipe_selection": { "$ref": "#/$defs/recipe_selection" }, "manual_input": { "$ref": "#/$defs/production_set" }, "outputs": { "$ref": "#/$defs/outputs" } } };
const schema33 = { "type": "integer", "minimum": 1 };
const schema34 = { "type": "string", "minLength": 1, "pattern": "^(?!\\s+).+(?<!\\s)$" };
const schema44 = { "type": "object", "additionalProperties": false, "minProperties": 1, "patternProperties": { "^(?:Desc|BP|Foundation)_[^.]+_C$": { "type": "string", "pattern": "^(?:Recipe|Build)_.+_C$" } } };
const func1 = ucs2length;
const pattern4 = new RegExp("^(?!\\s+).+(?<!\\s)$", "u");
const pattern5 = new RegExp("^(?:Desc|BP|Foundation)_[^.]+_C$", "u");
const pattern14 = new RegExp("^(?:Recipe|Build)_.+_C$", "u");
const schema35 = { "type": "object", "additionalProperties": false, "patternProperties": { "^(?:Desc|BP|Foundation)_[^.]+_C$": { "$ref": "docs.json.ts--production-planner--lib--CanConvertTypeJsonDefs#/$defs/CanConvertTypeJson" } } };
const schema37 = { "oneOf": [{ "$ref": "#/$defs/IntermediaryNumber" }, { "$ref": "#/$defs/IntermediaryCalculation" }, { "$ref": "#/$defs/TokenScan" }] as const };
const schema43 = { "type": "object", "required": ["type", "value"] as const, "additionalProperties": false, "properties": { "type": { "type": "string", "const": "TokenScan" }, "value": { "type": "string" } } };
const schema38 = { "type": "object", "required": ["type", "value"] as const, "additionalProperties": false, "properties": { "type": { "type": "string", "const": "IntermediaryNumber" }, "value": { "oneOf": [{ "$ref": "#/$defs/amount_string_flexible" }, { "$ref": "#/$defs/numeric_string" }, { "type": "string", "pattern": "^(-?\\d+(?:\\.\\d+))e([+-])(\\d+)$" }] as const } } };
const schema41 = { "type": "string", "pattern": "^-?(?:\\d*\\.\\d+|\\d+(?:\\.\\d+)?)$" };
const schema39 = { "oneOf": [{ "$ref": "#/$defs/amount_string" }, { "type": "string", "pattern": "^\\d*(?:\\.\\d{1,6})$" }, { "type": "string", "pattern": "^\\d+$" }] as const };
const schema40 = { "type": "string", "pattern": "^\\d+(?:\\.\\d{1,6})?$" };
const pattern7 = new RegExp("^\\d+(?:\\.\\d{1,6})?$", "u");
const pattern8 = new RegExp("^\\d*(?:\\.\\d{1,6})$", "u");
const pattern9 = new RegExp("^\\d+$", "u");
function validate26(data: unknown, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} }: Partial<StandaloneDataValidationCxt> = {}): data is stubs["amount_string_flexible"] {
    let vErrors: ErrorObject[] = [];
    let errors = 0;
    const evaluated0 = ajv_utiltiies__definitely_evaluated(validate26);
    if (evaluated0?.dynamicProps) {
        evaluated0.props = undefined;
    }
    if (evaluated0?.dynamicItems) {
        evaluated0.items = undefined;
    }
    const _errs0 = errors;
    let valid0 = false;
    let passing0 = null;
    const _errs1 = errors;
    if (typeof data === "string") {
        if (!pattern7.test(data)) {
            const err0: ErrorObject = { instancePath, schemaPath: "#/$defs/amount_string/pattern", keyword: "pattern", params: { pattern: "^\\d+(?:\\.\\d{1,6})?$" }, message: "must match pattern \"" + "^\\d+(?:\\.\\d{1,6})?$" + "\"", schema: "^\\d+(?:\\.\\d{1,6})?$", parentSchema: schema40, data };
            vErrors.push(err0)
            errors++;
        }
    }
    else {
        const err1: ErrorObject = { instancePath, schemaPath: "#/$defs/amount_string/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema40.type, parentSchema: schema40, data };
        vErrors.push(err1)
        errors++;
    }
    var _valid0 = _errs1 === errors;
    if (_valid0) {
        valid0 = true;
        passing0 = 0;
    }
    const _errs4 = errors;
    if (typeof data === "string") {
        if (!pattern8.test(data)) {
            const err2: ErrorObject = { instancePath, schemaPath: "#/oneOf/1/pattern", keyword: "pattern", params: { pattern: "^\\d*(?:\\.\\d{1,6})$" }, message: "must match pattern \"" + "^\\d*(?:\\.\\d{1,6})$" + "\"", schema: "^\\d*(?:\\.\\d{1,6})$", parentSchema: schema39.oneOf[1], data };
            vErrors.push(err2)
            errors++;
        }
    }
    else {
        const err3: ErrorObject = { instancePath, schemaPath: "#/oneOf/1/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema39.oneOf[1].type, parentSchema: schema39.oneOf[1], data };
        vErrors.push(err3)
        errors++;
    }
    var _valid0 = _errs4 === errors;
    if (_valid0 && valid0) {
        valid0 = false;
        passing0 = [passing0, 1];
    }
    else {
        if (_valid0) {
            valid0 = true;
            passing0 = 1;
        }
        const _errs6 = errors;
        if (typeof data === "string") {
            if (!pattern9.test(data)) {
                const err4: ErrorObject = { instancePath, schemaPath: "#/oneOf/2/pattern", keyword: "pattern", params: { pattern: "^\\d+$" }, message: "must match pattern \"" + "^\\d+$" + "\"", schema: "^\\d+$", parentSchema: schema39.oneOf[2], data };
                vErrors.push(err4)
                errors++;
            }
        }
        else {
            const err5: ErrorObject = { instancePath, schemaPath: "#/oneOf/2/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema39.oneOf[2].type, parentSchema: schema39.oneOf[2], data };
            vErrors.push(err5)
            errors++;
        }
        var _valid0 = _errs6 === errors;
        if (_valid0 && valid0) {
            valid0 = false;
            passing0 = [passing0, 2];
        }
        else {
            if (_valid0) {
                valid0 = true;
                passing0 = 2;
            }
        }
    }
    if (!valid0) {
        const err6: ErrorObject = { instancePath, schemaPath: "#/oneOf", keyword: "oneOf", params: { passingSchemas: passing0 }, message: "must match exactly one schema in oneOf", schema: schema39.oneOf, parentSchema: schema39, data };
        vErrors.push(err6)
        errors++;
    }
    else {
        errors = _errs0;
        if (vErrors.length) {
            if (_errs0) {
                vErrors.length = _errs0;
            }
            else {
                vErrors = [];
            }
        }
    }
    (validate26 as IsStandalone).errors = vErrors.length ? vErrors : null;
    return errors === 0;
}
(validate26 as IsStandalone).evaluated = { "dynamicProps": false, "dynamicItems": false };
const pattern10 = new RegExp("^-?(?:\\d*\\.\\d+|\\d+(?:\\.\\d+)?)$", "u");
const pattern11 = new RegExp("^(-?\\d+(?:\\.\\d+))e([+-])(\\d+)$", "u");
function validate25(data: unknown, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} }: Partial<StandaloneDataValidationCxt> = {}): data is stubs["IntermediaryNumber"] {
    let vErrors: ErrorObject[] = [];
    let errors = 0;
    const evaluated0 = ajv_utiltiies__definitely_evaluated(validate25);
    if (evaluated0?.dynamicProps) {
        evaluated0.props = undefined;
    }
    if (evaluated0?.dynamicItems) {
        evaluated0.items = undefined;
    }
    if (ajv_utilities__is_probably_object(data)) {
        if (data.type === undefined) {
            const err0: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "type" }, message: "must have required property '" + "type" + "'", schema: schema38.required, parentSchema: schema38, data };
            vErrors.push(err0)
            errors++;
        }
        if (data.value === undefined) {
            const err1: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "value" }, message: "must have required property '" + "value" + "'", schema: schema38.required, parentSchema: schema38, data };
            vErrors.push(err1)
            errors++;
        }
        for (const key0 in data) {
            if (!((key0 === "type") || (key0 === "value"))) {
                const err2: ErrorObject = { instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties", schema: false, parentSchema: schema38, data };
                vErrors.push(err2)
                errors++;
            }
        }
        if (data.type !== undefined) {
            let data0 = data.type;
            if (typeof data0 !== "string") {
                const err3: ErrorObject = { instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema38.properties.type.type, parentSchema: schema38.properties.type, data: data0 };
                vErrors.push(err3)
                errors++;
            }
            if ("IntermediaryNumber" !== data0) {
                const err4: ErrorObject = { instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "IntermediaryNumber" }, message: "must be equal to constant", schema: "IntermediaryNumber", parentSchema: schema38.properties.type, data: data0 };
                vErrors.push(err4)
                errors++;
            }
        }
        if (data.value !== undefined) {
            let data1 = data.value;
            const _errs5 = errors;
            let valid1 = false;
            let passing0 = null;
            const _errs6 = errors;
            if (!(validate26(data1, { instancePath: instancePath + "/value", parentData: data, parentDataProperty: "value", rootData, dynamicAnchors }))) {
                vErrors = vErrors.concat((validate26 as IsStandalone).errors || []);
                errors = vErrors.length;
            }
            var _valid0 = _errs6 === errors;
            if (_valid0) {
                valid1 = true;
                passing0 = 0;
            }
            const _errs7 = errors;
            if (typeof data1 === "string") {
                if (!pattern10.test(data1)) {
                    const err5: ErrorObject = { instancePath: instancePath + "/value", schemaPath: "#/$defs/numeric_string/pattern", keyword: "pattern", params: { pattern: "^-?(?:\\d*\\.\\d+|\\d+(?:\\.\\d+)?)$" }, message: "must match pattern \"" + "^-?(?:\\d*\\.\\d+|\\d+(?:\\.\\d+)?)$" + "\"", schema: "^-?(?:\\d*\\.\\d+|\\d+(?:\\.\\d+)?)$", parentSchema: schema41, data: data1 };
                    vErrors.push(err5)
                    errors++;
                }
            }
            else {
                const err6: ErrorObject = { instancePath: instancePath + "/value", schemaPath: "#/$defs/numeric_string/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema41.type, parentSchema: schema41, data: data1 };
                vErrors.push(err6)
                errors++;
            }
            var _valid0 = _errs7 === errors;
            if (_valid0 && valid1) {
                valid1 = false;
                passing0 = [passing0, 1];
            }
            else {
                if (_valid0) {
                    valid1 = true;
                    passing0 = 1;
                }
                const _errs10 = errors;
                if (typeof data1 === "string") {
                    if (!pattern11.test(data1)) {
                        const err7: ErrorObject = { instancePath: instancePath + "/value", schemaPath: "#/properties/value/oneOf/2/pattern", keyword: "pattern", params: { pattern: "^(-?\\d+(?:\\.\\d+))e([+-])(\\d+)$" }, message: "must match pattern \"" + "^(-?\\d+(?:\\.\\d+))e([+-])(\\d+)$" + "\"", schema: "^(-?\\d+(?:\\.\\d+))e([+-])(\\d+)$", parentSchema: schema38.properties.value.oneOf[2], data: data1 };
                        vErrors.push(err7)
                        errors++;
                    }
                }
                else {
                    const err8: ErrorObject = { instancePath: instancePath + "/value", schemaPath: "#/properties/value/oneOf/2/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema38.properties.value.oneOf[2].type, parentSchema: schema38.properties.value.oneOf[2], data: data1 };
                    vErrors.push(err8)
                    errors++;
                }
                var _valid0 = _errs10 === errors;
                if (_valid0 && valid1) {
                    valid1 = false;
                    passing0 = [passing0, 2];
                }
                else {
                    if (_valid0) {
                        valid1 = true;
                        passing0 = 2;
                    }
                }
            }
            if (!valid1) {
                const err9: ErrorObject = { instancePath: instancePath + "/value", schemaPath: "#/properties/value/oneOf", keyword: "oneOf", params: { passingSchemas: passing0 }, message: "must match exactly one schema in oneOf", schema: schema38.properties.value.oneOf, parentSchema: schema38.properties.value, data: data1 };
                vErrors.push(err9)
                errors++;
            }
            else {
                errors = _errs5;
                if (vErrors.length) {
                    if (_errs5) {
                        vErrors.length = _errs5;
                    }
                    else {
                        vErrors = [];
                    }
                }
            }
        }
    }
    else {
        const err10: ErrorObject = { instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema38.type, parentSchema: schema38, data };
        vErrors.push(err10)
        errors++;
    }
    (validate25 as IsStandalone).errors = vErrors.length ? vErrors : null;
    return errors === 0;
}
(validate25 as IsStandalone).evaluated = { "props": true, "dynamicProps": false, "dynamicItems": false };
const schema42 = { "type": "object", "required": ["type", "left", "operation", "right"] as const, "additionalProperties": false, "properties": { "type": { "type": "string", "const": "IntermediaryCalculation" }, "left": { "$ref": "#/$defs/CanConvertTypeJson" }, "operation": { "type": "string", "enum": ["+", "-", "*", "x", "/", "%"] as const }, "right": { "$ref": "#/$defs/CanConvertTypeJson" } } };
const wrapper0: {
    validate: IsStandalone;
} = { validate: validate24 };
function validate29(data: unknown, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} }: Partial<StandaloneDataValidationCxt> = {}): data is stubs["IntermediaryCalculation"] {
    let vErrors: ErrorObject[] = [];
    let errors = 0;
    const evaluated0 = ajv_utiltiies__definitely_evaluated(validate29);
    if (evaluated0?.dynamicProps) {
        evaluated0.props = undefined;
    }
    if (evaluated0?.dynamicItems) {
        evaluated0.items = undefined;
    }
    if (ajv_utilities__is_probably_object(data)) {
        if (data.type === undefined) {
            const err0: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "type" }, message: "must have required property '" + "type" + "'", schema: schema42.required, parentSchema: schema42, data };
            vErrors.push(err0)
            errors++;
        }
        if (data.left === undefined) {
            const err1: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "left" }, message: "must have required property '" + "left" + "'", schema: schema42.required, parentSchema: schema42, data };
            vErrors.push(err1)
            errors++;
        }
        if (data.operation === undefined) {
            const err2: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "operation" }, message: "must have required property '" + "operation" + "'", schema: schema42.required, parentSchema: schema42, data };
            vErrors.push(err2)
            errors++;
        }
        if (data.right === undefined) {
            const err3: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "right" }, message: "must have required property '" + "right" + "'", schema: schema42.required, parentSchema: schema42, data };
            vErrors.push(err3)
            errors++;
        }
        for (const key0 in data) {
            if (!((((key0 === "type") || (key0 === "left")) || (key0 === "operation")) || (key0 === "right"))) {
                const err4: ErrorObject = { instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties", schema: false, parentSchema: schema42, data };
                vErrors.push(err4)
                errors++;
            }
        }
        if (data.type !== undefined) {
            let data0 = data.type;
            if (typeof data0 !== "string") {
                const err5: ErrorObject = { instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema42.properties.type.type, parentSchema: schema42.properties.type, data: data0 };
                vErrors.push(err5)
                errors++;
            }
            if ("IntermediaryCalculation" !== data0) {
                const err6: ErrorObject = { instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "IntermediaryCalculation" }, message: "must be equal to constant", schema: "IntermediaryCalculation", parentSchema: schema42.properties.type, data: data0 };
                vErrors.push(err6)
                errors++;
            }
        }
        if (data.left !== undefined) {
            if (!(wrapper0.validate(data.left, { instancePath: instancePath + "/left", parentData: data, parentDataProperty: "left", rootData, dynamicAnchors }))) {
                vErrors = vErrors === null ? wrapper0.validate.errors : vErrors.concat(wrapper0.validate.errors);
                errors = vErrors.length;
            }
        }
        if (data.operation !== undefined) {
            let data2 = data.operation;
            if (typeof data2 !== "string") {
                const err7: ErrorObject = { instancePath: instancePath + "/operation", schemaPath: "#/properties/operation/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema42.properties.operation.type, parentSchema: schema42.properties.operation, data: data2 };
                vErrors.push(err7)
                errors++;
            }
            if (!((((((data2 === "+") || (data2 === "-")) || (data2 === "*")) || (data2 === "x")) || (data2 === "/")) || (data2 === "%"))) {
                const err8: ErrorObject = { instancePath: instancePath + "/operation", schemaPath: "#/properties/operation/enum", keyword: "enum", params: { allowedValues: schema42.properties.operation.enum }, message: "must be equal to one of the allowed values", schema: schema42.properties.operation.enum, parentSchema: schema42.properties.operation, data: data2 };
                vErrors.push(err8)
                errors++;
            }
        }
        if (data.right !== undefined) {
            if (!(wrapper0.validate(data.right, { instancePath: instancePath + "/right", parentData: data, parentDataProperty: "right", rootData, dynamicAnchors }))) {
                vErrors = vErrors === null ? wrapper0.validate.errors : vErrors.concat(wrapper0.validate.errors);
                errors = vErrors.length;
            }
        }
    }
    else {
        const err9: ErrorObject = { instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema42.type, parentSchema: schema42, data };
        vErrors.push(err9)
        errors++;
    }
    (validate29 as IsStandalone).errors = vErrors.length ? vErrors : null;
    return errors === 0;
}
(validate29 as IsStandalone).evaluated = { "props": true, "dynamicProps": false, "dynamicItems": false };
function validate24(data: unknown, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} }: Partial<StandaloneDataValidationCxt> = {}): data is stubs["CanConvertJson"] {
    let props0: (true | {
        [key: string]: true;
    } | undefined) = undefined;
    let vErrors: ErrorObject[] = [];
    let errors = 0;
    const evaluated0 = ajv_utiltiies__definitely_evaluated(validate24);
    if (evaluated0?.dynamicProps) {
        evaluated0.props = undefined;
    }
    if (evaluated0?.dynamicItems) {
        evaluated0.items = undefined;
    }
    const _errs0 = errors;
    let valid0 = false;
    let passing0 = null;
    const _errs1 = errors;
    if (!(validate25(data, { instancePath, parentData, parentDataProperty, rootData, dynamicAnchors }))) {
        vErrors = vErrors.concat((validate25 as IsStandalone).errors || []);
        errors = vErrors.length;
    }
    var _valid0 = _errs1 === errors;
    if (_valid0) {
        valid0 = true;
        passing0 = 0;
        props0 = true;
    }
    const _errs2 = errors;
    if (!(validate29(data, { instancePath, parentData, parentDataProperty, rootData, dynamicAnchors }))) {
        vErrors = vErrors.concat((validate29 as IsStandalone).errors || []);
        errors = vErrors.length;
    }
    var _valid0 = _errs2 === errors;
    if (_valid0 && valid0) {
        valid0 = false;
        passing0 = [passing0, 1];
    }
    else {
        if (_valid0) {
            valid0 = true;
            passing0 = 1;
            if (props0 !== true) {
                props0 = true;
            }
        }
        const _errs3 = errors;
        if (ajv_utilities__is_probably_object(data)) {
            if (data.type === undefined) {
                const err0: ErrorObject = { instancePath, schemaPath: "#/$defs/TokenScan/required", keyword: "required", params: { missingProperty: "type" }, message: "must have required property '" + "type" + "'", schema: schema43.required, parentSchema: schema43, data };
                vErrors.push(err0)
                errors++;
            }
            if (data.value === undefined) {
                const err1: ErrorObject = { instancePath, schemaPath: "#/$defs/TokenScan/required", keyword: "required", params: { missingProperty: "value" }, message: "must have required property '" + "value" + "'", schema: schema43.required, parentSchema: schema43, data };
                vErrors.push(err1)
                errors++;
            }
            for (const key0 in data) {
                if (!((key0 === "type") || (key0 === "value"))) {
                    const err2: ErrorObject = { instancePath, schemaPath: "#/$defs/TokenScan/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties", schema: false, parentSchema: schema43, data };
                    vErrors.push(err2)
                    errors++;
                }
            }
            if (data.type !== undefined) {
                let data0 = data.type;
                if (typeof data0 !== "string") {
                    const err3: ErrorObject = { instancePath: instancePath + "/type", schemaPath: "#/$defs/TokenScan/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema43.properties.type.type, parentSchema: schema43.properties.type, data: data0 };
                    vErrors.push(err3)
                    errors++;
                }
                if ("TokenScan" !== data0) {
                    const err4: ErrorObject = { instancePath: instancePath + "/type", schemaPath: "#/$defs/TokenScan/properties/type/const", keyword: "const", params: { allowedValue: "TokenScan" }, message: "must be equal to constant", schema: "TokenScan", parentSchema: schema43.properties.type, data: data0 };
                    vErrors.push(err4)
                    errors++;
                }
            }
            if (data.value !== undefined) {
                let data1 = data.value;
                if (typeof data1 !== "string") {
                    const err5: ErrorObject = { instancePath: instancePath + "/value", schemaPath: "#/$defs/TokenScan/properties/value/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema43.properties.value.type, parentSchema: schema43.properties.value, data: data1 };
                    vErrors.push(err5)
                    errors++;
                }
            }
        }
        else {
            const err6: ErrorObject = { instancePath, schemaPath: "#/$defs/TokenScan/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema43.type, parentSchema: schema43, data };
            vErrors.push(err6)
            errors++;
        }
        var _valid0 = _errs3 === errors;
        if (_valid0 && valid0) {
            valid0 = false;
            passing0 = [passing0, 2];
        }
        else {
            if (_valid0) {
                valid0 = true;
                passing0 = 2;
                if (props0 !== true) {
                    props0 = true;
                }
            }
        }
    }
    if (!valid0) {
        const err7: ErrorObject = { instancePath, schemaPath: "#/oneOf", keyword: "oneOf", params: { passingSchemas: passing0 }, message: "must match exactly one schema in oneOf", schema: schema37.oneOf, parentSchema: schema37, data };
        vErrors.push(err7)
        errors++;
    }
    else {
        errors = _errs0;
        if (vErrors.length) {
            if (_errs0) {
                vErrors.length = _errs0;
            }
            else {
                vErrors = [];
            }
        }
    }
    (validate24 as IsStandalone).errors = vErrors.length ? vErrors : null;
    evaluated0.props = props0;
    return errors === 0;
}
(validate24 as IsStandalone).evaluated = { "dynamicProps": true, "dynamicItems": false };
function validate22(data: unknown, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} }: Partial<StandaloneDataValidationCxt> = {}): data is stubs["Pool"]["production"] {
    let vErrors: ErrorObject[] = [];
    let errors = 0;
    const evaluated0 = ajv_utiltiies__definitely_evaluated(validate22);
    if (evaluated0?.dynamicProps) {
        evaluated0.props = undefined;
    }
    if (evaluated0?.dynamicItems) {
        evaluated0.items = undefined;
    }
    if (ajv_utilities__is_probably_object(data)) {
        for (const key0 in data) {
            if (!(pattern5.test(key0))) {
                const err0: ErrorObject = { instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties", schema: false, parentSchema: schema35, data };
                vErrors.push(err0)
                errors++;
            }
        }
        for (const key1 in data) {
            if (pattern5.test(key1)) {
                if (!(validate24(data[key1], { instancePath: instancePath + "/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"), parentData: data, parentDataProperty: key1, rootData, dynamicAnchors }))) {
                    vErrors = vErrors.concat((validate24 as IsStandalone).errors || []);
                    errors = vErrors.length;
                }
            }
        }
    }
    else {
        const err1: ErrorObject = { instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema35.type, parentSchema: schema35, data };
        vErrors.push(err1)
        errors++;
    }
    (validate22 as IsStandalone).errors = vErrors.length ? vErrors : null;
    return errors === 0;
}
(validate22 as IsStandalone).evaluated = { "props": true, "dynamicProps": false, "dynamicItems": false };
const schema45 = { "type": "object", "required": ["instructions"] as const, "additionalProperties": false, "properties": { "instructions": { "type": "object", "minProperties": 1, "additionalProperties": false, "patternProperties": { "^(?:Desc|BP|Foundation)_[^.]+_C$": { "type": "array", "minItems": 1, "items": { "type": "object", "required": ["amount", "destination"] as const, "additionalProperties": false, "properties": { "amount": { "$ref": "docs.json.ts--production-planner--lib--CanConvertTypeJsonDefs#/$defs/CanConvertTypeJson" }, "destination": { "type": "object", "required": ["type", "id"] as const, "additionalProperties": false, "properties": { "type": { "type": "string", "enum": ["pool"] as const }, "id": { "$ref": "#/$defs/id" } } } } } } } } } };
function validate34(data: unknown, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} }: Partial<StandaloneDataValidationCxt> = {}): data is stubs["Distributor_json"] {
    let vErrors: ErrorObject[] = [];
    let errors = 0;
    const evaluated0 = ajv_utiltiies__definitely_evaluated(validate34);
    if (evaluated0?.dynamicProps) {
        evaluated0.props = undefined;
    }
    if (evaluated0?.dynamicItems) {
        evaluated0.items = undefined;
    }
    if (ajv_utilities__is_probably_object(data)) {
        if (data.instructions === undefined) {
            const err0: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "instructions" }, message: "must have required property '" + "instructions" + "'", schema: schema45.required, parentSchema: schema45, data };
            vErrors.push(err0)
            errors++;
        }
        for (const key0 in data) {
            if (!(key0 === "instructions")) {
                const err1: ErrorObject = { instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties", schema: false, parentSchema: schema45, data };
                vErrors.push(err1)
                errors++;
            }
        }
        if (data.instructions !== undefined) {
            let data0 = data.instructions;
            if (ajv_utilities__is_probably_object(data0)) {
                if (Object.keys(data0).length < 1) {
                    const err2: ErrorObject = { instancePath: instancePath + "/instructions", schemaPath: "#/properties/instructions/minProperties", keyword: "minProperties", params: { limit: 1 }, message: "must NOT have fewer than 1 properties", schema: 1, parentSchema: schema45.properties.instructions, data: data0 };
                    vErrors.push(err2)
                    errors++;
                }
                for (const key1 in data0) {
                    if (!(pattern5.test(key1))) {
                        const err3: ErrorObject = { instancePath: instancePath + "/instructions", schemaPath: "#/properties/instructions/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties", schema: false, parentSchema: schema45.properties.instructions, data: data0 };
                        vErrors.push(err3)
                        errors++;
                    }
                }
                for (const key2 in data0) {
                    if (pattern5.test(key2)) {
                        let data1 = data0[key2];
                        if (ajv_utilities__is_probably_array(data1)) {
                            if (data1.length < 1) {
                                const err4: ErrorObject = { instancePath: instancePath + "/instructions/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/instructions/patternProperties/%5E(%3F%3ADesc%7CBP%7CFoundation)_%5B%5E.%5D%2B_C%24/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items", schema: 1, parentSchema: schema45.properties.instructions.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"], data: data1 };
                                vErrors.push(err4)
                                errors++;
                            }
                            const len0 = data1.length;
                            for (let i0 = 0; i0 < len0; i0++) {
                                let data2 = data1[i0];
                                if (ajv_utilities__is_probably_object(data2)) {
                                    if (data2.amount === undefined) {
                                        const err5: ErrorObject = { instancePath: instancePath + "/instructions/" + key2.replace(/~/g, "~0").replace(/\//g, "~1") + "/" + i0, schemaPath: "#/properties/instructions/patternProperties/%5E(%3F%3ADesc%7CBP%7CFoundation)_%5B%5E.%5D%2B_C%24/items/required", keyword: "required", params: { missingProperty: "amount" }, message: "must have required property '" + "amount" + "'", schema: schema45.properties.instructions.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"].items.required, parentSchema: schema45.properties.instructions.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"].items, data: data2 };
                                        vErrors.push(err5)
                                        errors++;
                                    }
                                    if (data2.destination === undefined) {
                                        const err6: ErrorObject = { instancePath: instancePath + "/instructions/" + key2.replace(/~/g, "~0").replace(/\//g, "~1") + "/" + i0, schemaPath: "#/properties/instructions/patternProperties/%5E(%3F%3ADesc%7CBP%7CFoundation)_%5B%5E.%5D%2B_C%24/items/required", keyword: "required", params: { missingProperty: "destination" }, message: "must have required property '" + "destination" + "'", schema: schema45.properties.instructions.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"].items.required, parentSchema: schema45.properties.instructions.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"].items, data: data2 };
                                        vErrors.push(err6)
                                        errors++;
                                    }
                                    for (const key3 in data2) {
                                        if (!((key3 === "amount") || (key3 === "destination"))) {
                                            const err7: ErrorObject = { instancePath: instancePath + "/instructions/" + key2.replace(/~/g, "~0").replace(/\//g, "~1") + "/" + i0, schemaPath: "#/properties/instructions/patternProperties/%5E(%3F%3ADesc%7CBP%7CFoundation)_%5B%5E.%5D%2B_C%24/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key3 }, message: "must NOT have additional properties", schema: false, parentSchema: schema45.properties.instructions.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"].items, data: data2 };
                                            vErrors.push(err7)
                                            errors++;
                                        }
                                    }
                                    if (data2.amount !== undefined) {
                                        if (!(validate24(data2.amount, { instancePath: instancePath + "/instructions/" + key2.replace(/~/g, "~0").replace(/\//g, "~1") + "/" + i0 + "/amount", parentData: data2, parentDataProperty: "amount", rootData, dynamicAnchors }))) {
                                            vErrors = vErrors.concat((validate24 as IsStandalone).errors || []);
                                            errors = vErrors.length;
                                        }
                                    }
                                    if (data2.destination !== undefined) {
                                        let data4 = data2.destination;
                                        if (ajv_utilities__is_probably_object(data4)) {
                                            if (data4.type === undefined) {
                                                const err8: ErrorObject = { instancePath: instancePath + "/instructions/" + key2.replace(/~/g, "~0").replace(/\//g, "~1") + "/" + i0 + "/destination", schemaPath: "#/properties/instructions/patternProperties/%5E(%3F%3ADesc%7CBP%7CFoundation)_%5B%5E.%5D%2B_C%24/items/properties/destination/required", keyword: "required", params: { missingProperty: "type" }, message: "must have required property '" + "type" + "'", schema: schema45.properties.instructions.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"].items.properties.destination.required, parentSchema: schema45.properties.instructions.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"].items.properties.destination, data: data4 };
                                                vErrors.push(err8)
                                                errors++;
                                            }
                                            if (data4.id === undefined) {
                                                const err9: ErrorObject = { instancePath: instancePath + "/instructions/" + key2.replace(/~/g, "~0").replace(/\//g, "~1") + "/" + i0 + "/destination", schemaPath: "#/properties/instructions/patternProperties/%5E(%3F%3ADesc%7CBP%7CFoundation)_%5B%5E.%5D%2B_C%24/items/properties/destination/required", keyword: "required", params: { missingProperty: "id" }, message: "must have required property '" + "id" + "'", schema: schema45.properties.instructions.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"].items.properties.destination.required, parentSchema: schema45.properties.instructions.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"].items.properties.destination, data: data4 };
                                                vErrors.push(err9)
                                                errors++;
                                            }
                                            for (const key4 in data4) {
                                                if (!((key4 === "type") || (key4 === "id"))) {
                                                    const err10: ErrorObject = { instancePath: instancePath + "/instructions/" + key2.replace(/~/g, "~0").replace(/\//g, "~1") + "/" + i0 + "/destination", schemaPath: "#/properties/instructions/patternProperties/%5E(%3F%3ADesc%7CBP%7CFoundation)_%5B%5E.%5D%2B_C%24/items/properties/destination/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key4 }, message: "must NOT have additional properties", schema: false, parentSchema: schema45.properties.instructions.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"].items.properties.destination, data: data4 };
                                                    vErrors.push(err10)
                                                    errors++;
                                                }
                                            }
                                            if (data4.type !== undefined) {
                                                let data5 = data4.type;
                                                if (typeof data5 !== "string") {
                                                    const err11: ErrorObject = { instancePath: instancePath + "/instructions/" + key2.replace(/~/g, "~0").replace(/\//g, "~1") + "/" + i0 + "/destination/type", schemaPath: "#/properties/instructions/patternProperties/%5E(%3F%3ADesc%7CBP%7CFoundation)_%5B%5E.%5D%2B_C%24/items/properties/destination/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema45.properties.instructions.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"].items.properties.destination.properties.type.type, parentSchema: schema45.properties.instructions.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"].items.properties.destination.properties.type, data: data5 };
                                                    vErrors.push(err11)
                                                    errors++;
                                                }
                                                if (!(data5 === "pool")) {
                                                    const err12: ErrorObject = { instancePath: instancePath + "/instructions/" + key2.replace(/~/g, "~0").replace(/\//g, "~1") + "/" + i0 + "/destination/type", schemaPath: "#/properties/instructions/patternProperties/%5E(%3F%3ADesc%7CBP%7CFoundation)_%5B%5E.%5D%2B_C%24/items/properties/destination/properties/type/enum", keyword: "enum", params: { allowedValues: schema45.properties.instructions.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"].items.properties.destination.properties.type.enum }, message: "must be equal to one of the allowed values", schema: schema45.properties.instructions.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"].items.properties.destination.properties.type.enum, parentSchema: schema45.properties.instructions.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"].items.properties.destination.properties.type, data: data5 };
                                                    vErrors.push(err12)
                                                    errors++;
                                                }
                                            }
                                            if (data4.id !== undefined) {
                                                let data6 = data4.id;
                                                if (!(((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6)))) {
                                                    const err13: ErrorObject = { instancePath: instancePath + "/instructions/" + key2.replace(/~/g, "~0").replace(/\//g, "~1") + "/" + i0 + "/destination/id", schemaPath: "#/$defs/id/type", keyword: "type", params: { type: "integer" }, message: "must be integer", schema: schema33.type, parentSchema: schema33, data: data6 };
                                                    vErrors.push(err13)
                                                    errors++;
                                                }
                                                if ((typeof data6 == "number") && (isFinite(data6))) {
                                                    if (data6 < 1 || isNaN(data6)) {
                                                        const err14: ErrorObject = { instancePath: instancePath + "/instructions/" + key2.replace(/~/g, "~0").replace(/\//g, "~1") + "/" + i0 + "/destination/id", schemaPath: "#/$defs/id/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1", schema: 1, parentSchema: schema33, data: data6 };
                                                        vErrors.push(err14)
                                                        errors++;
                                                    }
                                                }
                                            }
                                        }
                                        else {
                                            const err15: ErrorObject = { instancePath: instancePath + "/instructions/" + key2.replace(/~/g, "~0").replace(/\//g, "~1") + "/" + i0 + "/destination", schemaPath: "#/properties/instructions/patternProperties/%5E(%3F%3ADesc%7CBP%7CFoundation)_%5B%5E.%5D%2B_C%24/items/properties/destination/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema45.properties.instructions.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"].items.properties.destination.type, parentSchema: schema45.properties.instructions.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"].items.properties.destination, data: data4 };
                                            vErrors.push(err15)
                                            errors++;
                                        }
                                    }
                                }
                                else {
                                    const err16: ErrorObject = { instancePath: instancePath + "/instructions/" + key2.replace(/~/g, "~0").replace(/\//g, "~1") + "/" + i0, schemaPath: "#/properties/instructions/patternProperties/%5E(%3F%3ADesc%7CBP%7CFoundation)_%5B%5E.%5D%2B_C%24/items/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema45.properties.instructions.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"].items.type, parentSchema: schema45.properties.instructions.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"].items, data: data2 };
                                    vErrors.push(err16)
                                    errors++;
                                }
                            }
                        }
                        else {
                            const err17: ErrorObject = { instancePath: instancePath + "/instructions/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/instructions/patternProperties/%5E(%3F%3ADesc%7CBP%7CFoundation)_%5B%5E.%5D%2B_C%24/type", keyword: "type", params: { type: "array" }, message: "must be array", schema: schema45.properties.instructions.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"].type, parentSchema: schema45.properties.instructions.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"], data: data1 };
                            vErrors.push(err17)
                            errors++;
                        }
                    }
                }
            }
            else {
                const err18: ErrorObject = { instancePath: instancePath + "/instructions", schemaPath: "#/properties/instructions/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema45.properties.instructions.type, parentSchema: schema45.properties.instructions, data: data0 };
                vErrors.push(err18)
                errors++;
            }
        }
    }
    else {
        const err19: ErrorObject = { instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema45.type, parentSchema: schema45, data };
        vErrors.push(err19)
        errors++;
    }
    (validate34 as IsStandalone).errors = vErrors.length ? vErrors : null;
    return errors === 0;
}
(validate34 as IsStandalone).evaluated = { "props": true, "dynamicProps": false, "dynamicItems": false };
function validate21(data: unknown, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} }: Partial<StandaloneDataValidationCxt> = {}): data is stubs["Pool"] {
    let vErrors: ErrorObject[] = [];
    let errors = 0;
    const evaluated0 = ajv_utiltiies__definitely_evaluated(validate21);
    if (evaluated0?.dynamicProps) {
        evaluated0.props = undefined;
    }
    if (evaluated0?.dynamicItems) {
        evaluated0.items = undefined;
    }
    if (ajv_utilities__is_probably_object(data)) {
        if (data.id === undefined) {
            const err0: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "id" }, message: "must have required property '" + "id" + "'", schema: schema32.required, parentSchema: schema32, data };
            vErrors.push(err0)
            errors++;
        }
        for (const key0 in data) {
            if (!((((((key0 === "id") || (key0 === "name")) || (key0 === "production")) || (key0 === "recipe_selection")) || (key0 === "manual_input")) || (key0 === "outputs"))) {
                const err1: ErrorObject = { instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties", schema: false, parentSchema: schema32, data };
                vErrors.push(err1)
                errors++;
            }
        }
        if (data.id !== undefined) {
            let data0 = data.id;
            if (!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))) {
                const err2: ErrorObject = { instancePath: instancePath + "/id", schemaPath: "#/$defs/id/type", keyword: "type", params: { type: "integer" }, message: "must be integer", schema: schema33.type, parentSchema: schema33, data: data0 };
                vErrors.push(err2)
                errors++;
            }
            if ((typeof data0 == "number") && (isFinite(data0))) {
                if (data0 < 1 || isNaN(data0)) {
                    const err3: ErrorObject = { instancePath: instancePath + "/id", schemaPath: "#/$defs/id/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1", schema: 1, parentSchema: schema33, data: data0 };
                    vErrors.push(err3)
                    errors++;
                }
            }
        }
        if (data.name !== undefined) {
            let data1 = data.name;
            if (typeof data1 === "string") {
                if (func1(data1) < 1) {
                    const err4: ErrorObject = { instancePath: instancePath + "/name", schemaPath: "#/$defs/name/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters", schema: 1, parentSchema: schema34, data: data1 };
                    vErrors.push(err4)
                    errors++;
                }
                if (!pattern4.test(data1)) {
                    const err5: ErrorObject = { instancePath: instancePath + "/name", schemaPath: "#/$defs/name/pattern", keyword: "pattern", params: { pattern: "^(?!\\s+).+(?<!\\s)$" }, message: "must match pattern \"" + "^(?!\\s+).+(?<!\\s)$" + "\"", schema: "^(?!\\s+).+(?<!\\s)$", parentSchema: schema34, data: data1 };
                    vErrors.push(err5)
                    errors++;
                }
            }
            else {
                const err6: ErrorObject = { instancePath: instancePath + "/name", schemaPath: "#/$defs/name/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema34.type, parentSchema: schema34, data: data1 };
                vErrors.push(err6)
                errors++;
            }
        }
        if (data.production !== undefined) {
            if (!(validate22(data.production, { instancePath: instancePath + "/production", parentData: data, parentDataProperty: "production", rootData, dynamicAnchors }))) {
                vErrors = vErrors.concat((validate22 as IsStandalone).errors || []);
                errors = vErrors.length;
            }
        }
        if (data.recipe_selection !== undefined) {
            let data3 = data.recipe_selection;
            if (ajv_utilities__is_probably_object(data3)) {
                if (Object.keys(data3).length < 1) {
                    const err7: ErrorObject = { instancePath: instancePath + "/recipe_selection", schemaPath: "#/$defs/recipe_selection/minProperties", keyword: "minProperties", params: { limit: 1 }, message: "must NOT have fewer than 1 properties", schema: 1, parentSchema: schema44, data: data3 };
                    vErrors.push(err7)
                    errors++;
                }
                for (const key1 in data3) {
                    if (!(pattern5.test(key1))) {
                        const err8: ErrorObject = { instancePath: instancePath + "/recipe_selection", schemaPath: "#/$defs/recipe_selection/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties", schema: false, parentSchema: schema44, data: data3 };
                        vErrors.push(err8)
                        errors++;
                    }
                }
                for (const key2 in data3) {
                    if (pattern5.test(key2)) {
                        let data4 = data3[key2];
                        if (typeof data4 === "string") {
                            if (!pattern14.test(data4)) {
                                const err9: ErrorObject = { instancePath: instancePath + "/recipe_selection/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/$defs/recipe_selection/patternProperties/%5E(%3F%3ADesc%7CBP%7CFoundation)_%5B%5E.%5D%2B_C%24/pattern", keyword: "pattern", params: { pattern: "^(?:Recipe|Build)_.+_C$" }, message: "must match pattern \"" + "^(?:Recipe|Build)_.+_C$" + "\"", schema: "^(?:Recipe|Build)_.+_C$", parentSchema: schema44.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"], data: data4 };
                                vErrors.push(err9)
                                errors++;
                            }
                        }
                        else {
                            const err10: ErrorObject = { instancePath: instancePath + "/recipe_selection/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/$defs/recipe_selection/patternProperties/%5E(%3F%3ADesc%7CBP%7CFoundation)_%5B%5E.%5D%2B_C%24/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema44.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"].type, parentSchema: schema44.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"], data: data4 };
                            vErrors.push(err10)
                            errors++;
                        }
                    }
                }
            }
            else {
                const err11: ErrorObject = { instancePath: instancePath + "/recipe_selection", schemaPath: "#/$defs/recipe_selection/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema44.type, parentSchema: schema44, data: data3 };
                vErrors.push(err11)
                errors++;
            }
        }
        if (data.manual_input !== undefined) {
            if (!(validate22(data.manual_input, { instancePath: instancePath + "/manual_input", parentData: data, parentDataProperty: "manual_input", rootData, dynamicAnchors }))) {
                vErrors = vErrors.concat((validate22 as IsStandalone).errors || []);
                errors = vErrors.length;
            }
        }
        if (data.outputs !== undefined) {
            if (!(validate34(data.outputs, { instancePath: instancePath + "/outputs", parentData: data, parentDataProperty: "outputs", rootData, dynamicAnchors }))) {
                vErrors = vErrors.concat((validate34 as IsStandalone).errors || []);
                errors = vErrors.length;
            }
        }
    }
    else {
        const err12: ErrorObject = { instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema32.type, parentSchema: schema32, data };
        vErrors.push(err12)
        errors++;
    }
    (validate21 as IsStandalone).errors = vErrors.length ? vErrors : null;
    return errors === 0;
}
(validate21 as IsStandalone).evaluated = { "props": true, "dynamicProps": false, "dynamicItems": false };
const schema47 = { "type": "array", "minItems": 1, "items": { "$ref": "#/$defs/collection" } };
const schema48 = { "type": "object", "required": ["id", "items"] as const, "unevaluatedProperties": false, "additionalProperties": false, "properties": { "id": { "$ref": "#/$defs/id" }, "name": { "$ref": "#/$defs/name" }, "recipe_selection": { "$ref": "#/$defs/recipe_selection" }, "items": { "type": "array", "minItems": 0, "items": { "$ref": "#/$defs/id" } } } };
function validate39(data: unknown, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} }: Partial<StandaloneDataValidationCxt> = {}): data is stubs["Collection"] {
    let vErrors: ErrorObject[] = [];
    let errors = 0;
    const evaluated0 = ajv_utiltiies__definitely_evaluated(validate39);
    if (evaluated0?.dynamicProps) {
        evaluated0.props = undefined;
    }
    if (evaluated0?.dynamicItems) {
        evaluated0.items = undefined;
    }
    if (ajv_utilities__is_probably_object(data)) {
        if (data.id === undefined) {
            const err0: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "id" }, message: "must have required property '" + "id" + "'", schema: schema48.required, parentSchema: schema48, data };
            vErrors.push(err0)
            errors++;
        }
        if (data.items === undefined) {
            const err1: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "items" }, message: "must have required property '" + "items" + "'", schema: schema48.required, parentSchema: schema48, data };
            vErrors.push(err1)
            errors++;
        }
        for (const key0 in data) {
            if (!((((key0 === "id") || (key0 === "name")) || (key0 === "recipe_selection")) || (key0 === "items"))) {
                const err2: ErrorObject = { instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties", schema: false, parentSchema: schema48, data };
                vErrors.push(err2)
                errors++;
            }
        }
        if (data.id !== undefined) {
            let data0 = data.id;
            if (!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))) {
                const err3: ErrorObject = { instancePath: instancePath + "/id", schemaPath: "#/$defs/id/type", keyword: "type", params: { type: "integer" }, message: "must be integer", schema: schema33.type, parentSchema: schema33, data: data0 };
                vErrors.push(err3)
                errors++;
            }
            if ((typeof data0 == "number") && (isFinite(data0))) {
                if (data0 < 1 || isNaN(data0)) {
                    const err4: ErrorObject = { instancePath: instancePath + "/id", schemaPath: "#/$defs/id/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1", schema: 1, parentSchema: schema33, data: data0 };
                    vErrors.push(err4)
                    errors++;
                }
            }
        }
        if (data.name !== undefined) {
            let data1 = data.name;
            if (typeof data1 === "string") {
                if (func1(data1) < 1) {
                    const err5: ErrorObject = { instancePath: instancePath + "/name", schemaPath: "#/$defs/name/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters", schema: 1, parentSchema: schema34, data: data1 };
                    vErrors.push(err5)
                    errors++;
                }
                if (!pattern4.test(data1)) {
                    const err6: ErrorObject = { instancePath: instancePath + "/name", schemaPath: "#/$defs/name/pattern", keyword: "pattern", params: { pattern: "^(?!\\s+).+(?<!\\s)$" }, message: "must match pattern \"" + "^(?!\\s+).+(?<!\\s)$" + "\"", schema: "^(?!\\s+).+(?<!\\s)$", parentSchema: schema34, data: data1 };
                    vErrors.push(err6)
                    errors++;
                }
            }
            else {
                const err7: ErrorObject = { instancePath: instancePath + "/name", schemaPath: "#/$defs/name/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema34.type, parentSchema: schema34, data: data1 };
                vErrors.push(err7)
                errors++;
            }
        }
        if (data.recipe_selection !== undefined) {
            let data2 = data.recipe_selection;
            if (ajv_utilities__is_probably_object(data2)) {
                if (Object.keys(data2).length < 1) {
                    const err8: ErrorObject = { instancePath: instancePath + "/recipe_selection", schemaPath: "#/$defs/recipe_selection/minProperties", keyword: "minProperties", params: { limit: 1 }, message: "must NOT have fewer than 1 properties", schema: 1, parentSchema: schema44, data: data2 };
                    vErrors.push(err8)
                    errors++;
                }
                for (const key1 in data2) {
                    if (!(pattern5.test(key1))) {
                        const err9: ErrorObject = { instancePath: instancePath + "/recipe_selection", schemaPath: "#/$defs/recipe_selection/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties", schema: false, parentSchema: schema44, data: data2 };
                        vErrors.push(err9)
                        errors++;
                    }
                }
                for (const key2 in data2) {
                    if (pattern5.test(key2)) {
                        let data3 = data2[key2];
                        if (typeof data3 === "string") {
                            if (!pattern14.test(data3)) {
                                const err10: ErrorObject = { instancePath: instancePath + "/recipe_selection/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/$defs/recipe_selection/patternProperties/%5E(%3F%3ADesc%7CBP%7CFoundation)_%5B%5E.%5D%2B_C%24/pattern", keyword: "pattern", params: { pattern: "^(?:Recipe|Build)_.+_C$" }, message: "must match pattern \"" + "^(?:Recipe|Build)_.+_C$" + "\"", schema: "^(?:Recipe|Build)_.+_C$", parentSchema: schema44.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"], data: data3 };
                                vErrors.push(err10)
                                errors++;
                            }
                        }
                        else {
                            const err11: ErrorObject = { instancePath: instancePath + "/recipe_selection/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/$defs/recipe_selection/patternProperties/%5E(%3F%3ADesc%7CBP%7CFoundation)_%5B%5E.%5D%2B_C%24/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema44.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"].type, parentSchema: schema44.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"], data: data3 };
                            vErrors.push(err11)
                            errors++;
                        }
                    }
                }
            }
            else {
                const err12: ErrorObject = { instancePath: instancePath + "/recipe_selection", schemaPath: "#/$defs/recipe_selection/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema44.type, parentSchema: schema44, data: data2 };
                vErrors.push(err12)
                errors++;
            }
        }
        if (data.items !== undefined) {
            let data4 = data.items;
            if (ajv_utilities__is_probably_array(data4)) {
                if (data4.length < 0) {
                    const err13: ErrorObject = { instancePath: instancePath + "/items", schemaPath: "#/properties/items/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items", schema: 0, parentSchema: schema48.properties.items, data: data4 };
                    vErrors.push(err13)
                    errors++;
                }
                const len0 = data4.length;
                for (let i0 = 0; i0 < len0; i0++) {
                    let data5 = data4[i0];
                    if (!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))) {
                        const err14: ErrorObject = { instancePath: instancePath + "/items/" + i0, schemaPath: "#/$defs/id/type", keyword: "type", params: { type: "integer" }, message: "must be integer", schema: schema33.type, parentSchema: schema33, data: data5 };
                        vErrors.push(err14)
                        errors++;
                    }
                    if ((typeof data5 == "number") && (isFinite(data5))) {
                        if (data5 < 1 || isNaN(data5)) {
                            const err15: ErrorObject = { instancePath: instancePath + "/items/" + i0, schemaPath: "#/$defs/id/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1", schema: 1, parentSchema: schema33, data: data5 };
                            vErrors.push(err15)
                            errors++;
                        }
                    }
                }
            }
            else {
                const err16: ErrorObject = { instancePath: instancePath + "/items", schemaPath: "#/properties/items/type", keyword: "type", params: { type: "array" }, message: "must be array", schema: schema48.properties.items.type, parentSchema: schema48.properties.items, data: data4 };
                vErrors.push(err16)
                errors++;
            }
        }
    }
    else {
        const err17: ErrorObject = { instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema48.type, parentSchema: schema48, data };
        vErrors.push(err17)
        errors++;
    }
    (validate39 as IsStandalone).errors = vErrors.length ? vErrors : null;
    return errors === 0;
}
(validate39 as IsStandalone).evaluated = { "props": true, "dynamicProps": false, "dynamicItems": false };
function validate38(data: unknown, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} }: Partial<StandaloneDataValidationCxt> = {}): data is [
    stub_Collection,
    ...stub_Collection[]
] {
    let vErrors: ErrorObject[] = [];
    let errors = 0;
    const evaluated0 = ajv_utiltiies__definitely_evaluated(validate38);
    if (evaluated0?.dynamicProps) {
        evaluated0.props = undefined;
    }
    if (evaluated0?.dynamicItems) {
        evaluated0.items = undefined;
    }
    if (ajv_utilities__is_probably_array(data)) {
        if (data.length < 1) {
            const err0: ErrorObject = { instancePath, schemaPath: "#/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items", schema: 1, parentSchema: schema47, data };
            vErrors.push(err0)
            errors++;
        }
        const len0 = data.length;
        for (let i0 = 0; i0 < len0; i0++) {
            if (!(validate39(data[i0], { instancePath: instancePath + "/" + i0, parentData: data, parentDataProperty: i0, rootData, dynamicAnchors }))) {
                vErrors = vErrors.concat((validate39 as IsStandalone).errors || []);
                errors = vErrors.length;
            }
        }
    }
    else {
        const err1: ErrorObject = { instancePath, schemaPath: "#/type", keyword: "type", params: { type: "array" }, message: "must be array", schema: schema47.type, parentSchema: schema47, data };
        vErrors.push(err1)
        errors++;
    }
    (validate38 as IsStandalone).errors = vErrors.length ? vErrors : null;
    return errors === 0;
}
(validate38 as IsStandalone).evaluated = { "items": true, "dynamicProps": false, "dynamicItems": false };
const schema53 = { "type": "object", "required": ["auto_follow_current_pool", "calculator_display_mode", "current_pool_id", "show_full_pool_button_list", "auto_recalculate"] as const, "unevaluatedProperties": false, "additionalProperties": false, "properties": { "auto_follow_current_pool": { "type": "boolean" }, "calculator_display_mode": { "type": "boolean" }, "current_pool_id": { "$ref": "#/$defs/pool_reference" }, "recipe_selection": { "$ref": "#/$defs/recipe_selection" }, "show_full_pool_button_list": { "type": "boolean" }, "auto_recalculate": { "$ref": "#/$defs/settings_auto_recalculate" } } };
const schema56 = { "type": "object", "required": ["recipe_selection_ui_change"] as const, "unevaluatedProperties": false, "additionalProperties": false, "properties": { "recipe_selection_ui_change": { "type": "boolean" } } };
function validate43(data: unknown, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} }: Partial<StandaloneDataValidationCxt> = {}): data is stubs["Settings"] {
    let vErrors: ErrorObject[] = [];
    let errors = 0;
    const evaluated0 = ajv_utiltiies__definitely_evaluated(validate43);
    if (evaluated0?.dynamicProps) {
        evaluated0.props = undefined;
    }
    if (evaluated0?.dynamicItems) {
        evaluated0.items = undefined;
    }
    if (ajv_utilities__is_probably_object(data)) {
        if (data.auto_follow_current_pool === undefined) {
            const err0: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "auto_follow_current_pool" }, message: "must have required property '" + "auto_follow_current_pool" + "'", schema: schema53.required, parentSchema: schema53, data };
            vErrors.push(err0)
            errors++;
        }
        if (data.calculator_display_mode === undefined) {
            const err1: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "calculator_display_mode" }, message: "must have required property '" + "calculator_display_mode" + "'", schema: schema53.required, parentSchema: schema53, data };
            vErrors.push(err1)
            errors++;
        }
        if (data.current_pool_id === undefined) {
            const err2: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "current_pool_id" }, message: "must have required property '" + "current_pool_id" + "'", schema: schema53.required, parentSchema: schema53, data };
            vErrors.push(err2)
            errors++;
        }
        if (data.show_full_pool_button_list === undefined) {
            const err3: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "show_full_pool_button_list" }, message: "must have required property '" + "show_full_pool_button_list" + "'", schema: schema53.required, parentSchema: schema53, data };
            vErrors.push(err3)
            errors++;
        }
        if (data.auto_recalculate === undefined) {
            const err4: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "auto_recalculate" }, message: "must have required property '" + "auto_recalculate" + "'", schema: schema53.required, parentSchema: schema53, data };
            vErrors.push(err4)
            errors++;
        }
        for (const key0 in data) {
            if (!((((((key0 === "auto_follow_current_pool") || (key0 === "calculator_display_mode")) || (key0 === "current_pool_id")) || (key0 === "recipe_selection")) || (key0 === "show_full_pool_button_list")) || (key0 === "auto_recalculate"))) {
                const err5: ErrorObject = { instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties", schema: false, parentSchema: schema53, data };
                vErrors.push(err5)
                errors++;
            }
        }
        if (data.auto_follow_current_pool !== undefined) {
            let data0 = data.auto_follow_current_pool;
            if (typeof data0 !== "boolean") {
                const err6: ErrorObject = { instancePath: instancePath + "/auto_follow_current_pool", schemaPath: "#/properties/auto_follow_current_pool/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean", schema: schema53.properties.auto_follow_current_pool.type, parentSchema: schema53.properties.auto_follow_current_pool, data: data0 };
                vErrors.push(err6)
                errors++;
            }
        }
        if (data.calculator_display_mode !== undefined) {
            let data1 = data.calculator_display_mode;
            if (typeof data1 !== "boolean") {
                const err7: ErrorObject = { instancePath: instancePath + "/calculator_display_mode", schemaPath: "#/properties/calculator_display_mode/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean", schema: schema53.properties.calculator_display_mode.type, parentSchema: schema53.properties.calculator_display_mode, data: data1 };
                vErrors.push(err7)
                errors++;
            }
        }
        if (data.current_pool_id !== undefined) {
            let data2 = data.current_pool_id;
            if (!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))) {
                const err8: ErrorObject = { instancePath: instancePath + "/current_pool_id", schemaPath: "#/$defs/pool_reference/type", keyword: "type", params: { type: "integer" }, message: "must be integer", schema: schema33.type, parentSchema: schema33, data: data2 };
                vErrors.push(err8)
                errors++;
            }
            if ((typeof data2 == "number") && (isFinite(data2))) {
                if (data2 < 1 || isNaN(data2)) {
                    const err9: ErrorObject = { instancePath: instancePath + "/current_pool_id", schemaPath: "#/$defs/pool_reference/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1", schema: 1, parentSchema: schema33, data: data2 };
                    vErrors.push(err9)
                    errors++;
                }
            }
        }
        if (data.recipe_selection !== undefined) {
            let data3 = data.recipe_selection;
            if (ajv_utilities__is_probably_object(data3)) {
                if (Object.keys(data3).length < 1) {
                    const err10: ErrorObject = { instancePath: instancePath + "/recipe_selection", schemaPath: "#/$defs/recipe_selection/minProperties", keyword: "minProperties", params: { limit: 1 }, message: "must NOT have fewer than 1 properties", schema: 1, parentSchema: schema44, data: data3 };
                    vErrors.push(err10)
                    errors++;
                }
                for (const key1 in data3) {
                    if (!(pattern5.test(key1))) {
                        const err11: ErrorObject = { instancePath: instancePath + "/recipe_selection", schemaPath: "#/$defs/recipe_selection/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties", schema: false, parentSchema: schema44, data: data3 };
                        vErrors.push(err11)
                        errors++;
                    }
                }
                for (const key2 in data3) {
                    if (pattern5.test(key2)) {
                        let data4 = data3[key2];
                        if (typeof data4 === "string") {
                            if (!pattern14.test(data4)) {
                                const err12: ErrorObject = { instancePath: instancePath + "/recipe_selection/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/$defs/recipe_selection/patternProperties/%5E(%3F%3ADesc%7CBP%7CFoundation)_%5B%5E.%5D%2B_C%24/pattern", keyword: "pattern", params: { pattern: "^(?:Recipe|Build)_.+_C$" }, message: "must match pattern \"" + "^(?:Recipe|Build)_.+_C$" + "\"", schema: "^(?:Recipe|Build)_.+_C$", parentSchema: schema44.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"], data: data4 };
                                vErrors.push(err12)
                                errors++;
                            }
                        }
                        else {
                            const err13: ErrorObject = { instancePath: instancePath + "/recipe_selection/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/$defs/recipe_selection/patternProperties/%5E(%3F%3ADesc%7CBP%7CFoundation)_%5B%5E.%5D%2B_C%24/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema44.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"].type, parentSchema: schema44.patternProperties["^(?:Desc|BP|Foundation)_[^.]+_C$"], data: data4 };
                            vErrors.push(err13)
                            errors++;
                        }
                    }
                }
            }
            else {
                const err14: ErrorObject = { instancePath: instancePath + "/recipe_selection", schemaPath: "#/$defs/recipe_selection/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema44.type, parentSchema: schema44, data: data3 };
                vErrors.push(err14)
                errors++;
            }
        }
        if (data.show_full_pool_button_list !== undefined) {
            let data5 = data.show_full_pool_button_list;
            if (typeof data5 !== "boolean") {
                const err15: ErrorObject = { instancePath: instancePath + "/show_full_pool_button_list", schemaPath: "#/properties/show_full_pool_button_list/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean", schema: schema53.properties.show_full_pool_button_list.type, parentSchema: schema53.properties.show_full_pool_button_list, data: data5 };
                vErrors.push(err15)
                errors++;
            }
        }
        if (data.auto_recalculate !== undefined) {
            let data6 = data.auto_recalculate;
            if (ajv_utilities__is_probably_object(data6)) {
                if (data6.recipe_selection_ui_change === undefined) {
                    const err16: ErrorObject = { instancePath: instancePath + "/auto_recalculate", schemaPath: "#/$defs/settings_auto_recalculate/required", keyword: "required", params: { missingProperty: "recipe_selection_ui_change" }, message: "must have required property '" + "recipe_selection_ui_change" + "'", schema: schema56.required, parentSchema: schema56, data: data6 };
                    vErrors.push(err16)
                    errors++;
                }
                for (const key3 in data6) {
                    if (!(key3 === "recipe_selection_ui_change")) {
                        const err17: ErrorObject = { instancePath: instancePath + "/auto_recalculate", schemaPath: "#/$defs/settings_auto_recalculate/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key3 }, message: "must NOT have additional properties", schema: false, parentSchema: schema56, data: data6 };
                        vErrors.push(err17)
                        errors++;
                    }
                }
                if (data6.recipe_selection_ui_change !== undefined) {
                    let data7 = data6.recipe_selection_ui_change;
                    if (typeof data7 !== "boolean") {
                        const err18: ErrorObject = { instancePath: instancePath + "/auto_recalculate/recipe_selection_ui_change", schemaPath: "#/$defs/settings_auto_recalculate/properties/recipe_selection_ui_change/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean", schema: schema56.properties.recipe_selection_ui_change.type, parentSchema: schema56.properties.recipe_selection_ui_change, data: data7 };
                        vErrors.push(err18)
                        errors++;
                    }
                }
            }
            else {
                const err19: ErrorObject = { instancePath: instancePath + "/auto_recalculate", schemaPath: "#/$defs/settings_auto_recalculate/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema56.type, parentSchema: schema56, data: data6 };
                vErrors.push(err19)
                errors++;
            }
        }
    }
    else {
        const err20: ErrorObject = { instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema53.type, parentSchema: schema53, data };
        vErrors.push(err20)
        errors++;
    }
    (validate43 as IsStandalone).errors = vErrors.length ? vErrors : null;
    return errors === 0;
}
(validate43 as IsStandalone).evaluated = { "props": true, "dynamicProps": false, "dynamicItems": false };
function validate20(data: unknown, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} }: Partial<StandaloneDataValidationCxt> = {}): data is stubs["State_Json"] {
    /*# sourceURL="production-planner-save-version-6" */ ;
    let vErrors: ErrorObject[] = [];
    let errors = 0;
    const evaluated0 = ajv_utiltiies__definitely_evaluated(validate20);
    if (evaluated0?.dynamicProps) {
        evaluated0.props = undefined;
    }
    if (evaluated0?.dynamicItems) {
        evaluated0.items = undefined;
    }
    if (ajv_utilities__is_probably_object(data)) {
        if (data.version === undefined) {
            const err0: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "version" }, message: "must have required property '" + "version" + "'", schema: schema31.required, parentSchema: schema31, data };
            vErrors.push(err0)
            errors++;
        }
        if (data.collections === undefined) {
            const err1: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "collections" }, message: "must have required property '" + "collections" + "'", schema: schema31.required, parentSchema: schema31, data };
            vErrors.push(err1)
            errors++;
        }
        if (data.groups === undefined) {
            const err2: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "groups" }, message: "must have required property '" + "groups" + "'", schema: schema31.required, parentSchema: schema31, data };
            vErrors.push(err2)
            errors++;
        }
        if (data.pools === undefined) {
            const err3: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "pools" }, message: "must have required property '" + "pools" + "'", schema: schema31.required, parentSchema: schema31, data };
            vErrors.push(err3)
            errors++;
        }
        if (data.settings === undefined) {
            const err4: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "settings" }, message: "must have required property '" + "settings" + "'", schema: schema31.required, parentSchema: schema31, data };
            vErrors.push(err4)
            errors++;
        }
        for (const key0 in data) {
            if (!(((((key0 === "version") || (key0 === "pools")) || (key0 === "groups")) || (key0 === "collections")) || (key0 === "settings"))) {
                const err5: ErrorObject = { instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties", schema: false, parentSchema: schema31, data };
                vErrors.push(err5)
                errors++;
            }
        }
        if (data.version !== undefined) {
            let data0 = data.version;
            if (!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))) {
                const err6: ErrorObject = { instancePath: instancePath + "/version", schemaPath: "#/properties/version/type", keyword: "type", params: { type: "integer" }, message: "must be integer", schema: schema31.properties.version.type, parentSchema: schema31.properties.version, data: data0 };
                vErrors.push(err6)
                errors++;
            }
            if (6 !== data0) {
                const err7: ErrorObject = { instancePath: instancePath + "/version", schemaPath: "#/properties/version/const", keyword: "const", params: { allowedValue: 6 }, message: "must be equal to constant", schema: 6, parentSchema: schema31.properties.version, data: data0 };
                vErrors.push(err7)
                errors++;
            }
        }
        if (data.pools !== undefined) {
            let data1 = data.pools;
            if (ajv_utilities__is_probably_array(data1)) {
                if (data1.length < 1) {
                    const err8: ErrorObject = { instancePath: instancePath + "/pools", schemaPath: "#/properties/pools/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items", schema: 1, parentSchema: schema31.properties.pools, data: data1 };
                    vErrors.push(err8)
                    errors++;
                }
                const len0 = data1.length;
                for (let i0 = 0; i0 < len0; i0++) {
                    if (!(validate21(data1[i0], { instancePath: instancePath + "/pools/" + i0, parentData: data1, parentDataProperty: i0, rootData, dynamicAnchors }))) {
                        vErrors = vErrors.concat((validate21 as IsStandalone).errors || []);
                        errors = vErrors.length;
                    }
                }
            }
            else {
                const err9: ErrorObject = { instancePath: instancePath + "/pools", schemaPath: "#/properties/pools/type", keyword: "type", params: { type: "array" }, message: "must be array", schema: schema31.properties.pools.type, parentSchema: schema31.properties.pools, data: data1 };
                vErrors.push(err9)
                errors++;
            }
        }
        if (data.groups !== undefined) {
            if (!(validate38(data.groups, { instancePath: instancePath + "/groups", parentData: data, parentDataProperty: "groups", rootData, dynamicAnchors }))) {
                vErrors = vErrors.concat((validate38 as IsStandalone).errors || []);
                errors = vErrors.length;
            }
        }
        if (data.collections !== undefined) {
            if (!(validate38(data.collections, { instancePath: instancePath + "/collections", parentData: data, parentDataProperty: "collections", rootData, dynamicAnchors }))) {
                vErrors = vErrors.concat((validate38 as IsStandalone).errors || []);
                errors = vErrors.length;
            }
        }
        if (data.settings !== undefined) {
            if (!(validate43(data.settings, { instancePath: instancePath + "/settings", parentData: data, parentDataProperty: "settings", rootData, dynamicAnchors }))) {
                vErrors = vErrors.concat((validate43 as IsStandalone).errors || []);
                errors = vErrors.length;
            }
        }
    }
    else {
        const err10: ErrorObject = { instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema31.type, parentSchema: schema31, data };
        vErrors.push(err10)
        errors++;
    }
    (validate20 as IsStandalone).errors = vErrors.length ? vErrors : null;
    return errors === 0;
}
(validate20 as IsStandalone).evaluated = { "props": true, "dynamicProps": false, "dynamicItems": false };
