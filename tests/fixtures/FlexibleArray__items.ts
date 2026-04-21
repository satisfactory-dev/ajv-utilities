import type { ErrorObject, ValidateFunction } from 'ajv';
import type { Is } from '@satisfactory-dev/ajv-utilities';
import type { FlexibleArray_type } from './types.ts';
function ajv_utilities__is_probably_object(maybe: unknown): maybe is Record<string, unknown> { return !!maybe && typeof maybe === "object" && !Array.isArray(maybe); }
function ajv_utilities__is_probably_array(maybe: unknown): maybe is unknown[] { return Array.isArray(maybe); }
import ucs2length from 'ajv/dist/runtime/ucs2length.js';
export const FlexibleArray__items = validate20;
const schema31 = { "$id": "docs.json.ts--lib--PropertySchemaToRegex--FlexibleArray--items", "type": "object", "additionalProperties": false, "required": ["type", "items", "minItems", "uniqueItems"] as const, "properties": { "$schema": { "type": "string", "enum": ["https://json-schema.org/draft/2020-12/schema"] as const }, "$id": { "type": "string", "minLength": 1 }, "type": { "type": "string", "const": "array" }, "uniqueItems": { "type": "boolean", "const": true }, "$defs": { "type": "object", "minProperties": 1, "additionalProperties": { "oneOf": [{ "type": "object", "required": ["type"] as const, "properties": { "type": { "type": "string", "minLength": 1 } } }, { "type": "object", "additionalProperties": false, "required": ["allOf"] as const, "properties": { "allOf": { "type": "array", "minItems": 2, "items": { "oneOf": [{ "type": "object", "required": ["type"] as const, "properties": { "type": { "type": "string", "minLength": 1 } } }, { "type": "object", "additionalProperties": false, "required": ["$ref"] as const, "properties": { "$ref": { "type": "string", "pattern": "^(.+)?#\\/\\$defs\\/(.+)$" } } }] as const } } } }, { "type": "object", "additionalProperties": false, "required": ["oneOf"] as const, "properties": { "oneOf": { "type": "array", "minItems": 2, "items": { "oneOf": [{ "type": "object", "required": ["type"] as const, "properties": { "type": { "type": "string", "minLength": 1 } } }, { "type": "object", "additionalProperties": false, "required": ["$ref"] as const, "properties": { "$ref": { "type": "string", "pattern": "^(.+)?#\\/\\$defs\\/(.+)$" } } }] as const } } } }] as const } }, "minItems": { "type": "integer", "minimum": 0 }, "maxItems": { "type": "integer", "minimum": 0 }, "items": {} } };
const func1 = ucs2length;
const pattern4 = new RegExp("^(.+)?#\\/\\$defs\\/(.+)$", "u");
function validate20(data: unknown, { instancePath = "" }: Partial<Parameters<ValidateFunction>[1] & {
    rootData: unknown;
}> = {}): data is FlexibleArray_type<"items"> {
    let props0: (true | {
        type?: true;
    } | undefined) = undefined, props1: (true | {
        type?: true;
    } | undefined) = undefined, props2: (true | {
        type?: true;
    } | undefined) = undefined;
    /*# sourceURL="docs.json.ts--lib--PropertySchemaToRegex--FlexibleArray--items" */ ;
    let vErrors: ErrorObject[] | null = null;
    let errors = 0;
    const evaluated0 = validate20.evaluated;
    if (evaluated0?.dynamicProps) {
        evaluated0.props = undefined;
    }
    if (evaluated0?.dynamicItems) {
        evaluated0.items = undefined;
    }
    if (ajv_utilities__is_probably_object(data)) {
        if (data.type === undefined) {
            const err0: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "type" }, message: "must have required property '" + "type" + "'", schema: schema31.required, parentSchema: schema31, data };
            if (vErrors === null) {
                vErrors = [err0];
            }
            else {
                (vErrors as ErrorObject[]).push(err0);
            }
            errors++;
        }
        if (data.items === undefined) {
            const err1: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "items" }, message: "must have required property '" + "items" + "'", schema: schema31.required, parentSchema: schema31, data };
            if (vErrors === null) {
                vErrors = [err1];
            }
            else {
                (vErrors as ErrorObject[]).push(err1);
            }
            errors++;
        }
        if (data.minItems === undefined) {
            const err2: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "minItems" }, message: "must have required property '" + "minItems" + "'", schema: schema31.required, parentSchema: schema31, data };
            if (vErrors === null) {
                vErrors = [err2];
            }
            else {
                (vErrors as ErrorObject[]).push(err2);
            }
            errors++;
        }
        if (data.uniqueItems === undefined) {
            const err3: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "uniqueItems" }, message: "must have required property '" + "uniqueItems" + "'", schema: schema31.required, parentSchema: schema31, data };
            if (vErrors === null) {
                vErrors = [err3];
            }
            else {
                (vErrors as ErrorObject[]).push(err3);
            }
            errors++;
        }
        for (const key0 in data) {
            if (!((((((((key0 === "$schema") || (key0 === "$id")) || (key0 === "type")) || (key0 === "uniqueItems")) || (key0 === "$defs")) || (key0 === "minItems")) || (key0 === "maxItems")) || (key0 === "items"))) {
                const err4: ErrorObject = { instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties", schema: false, parentSchema: schema31, data };
                if (vErrors === null) {
                    vErrors = [err4];
                }
                else {
                    (vErrors as ErrorObject[]).push(err4);
                }
                errors++;
            }
        }
        if (data.$schema !== undefined) {
            let data0 = data.$schema;
            if (typeof data0 !== "string") {
                const err5: ErrorObject = { instancePath: instancePath + "/$schema", schemaPath: "#/properties/%24schema/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema31.properties.$schema.type, parentSchema: schema31.properties.$schema, data: data0 };
                if (vErrors === null) {
                    vErrors = [err5];
                }
                else {
                    (vErrors as ErrorObject[]).push(err5);
                }
                errors++;
            }
            if (!(data0 === "https://json-schema.org/draft/2020-12/schema")) {
                const err6: ErrorObject = { instancePath: instancePath + "/$schema", schemaPath: "#/properties/%24schema/enum", keyword: "enum", params: { allowedValues: schema31.properties.$schema.enum }, message: "must be equal to one of the allowed values", schema: schema31.properties.$schema.enum, parentSchema: schema31.properties.$schema, data: data0 };
                if (vErrors === null) {
                    vErrors = [err6];
                }
                else {
                    (vErrors as ErrorObject[]).push(err6);
                }
                errors++;
            }
        }
        if (data.$id !== undefined) {
            let data1 = data.$id;
            if (typeof data1 === "string") {
                if (func1(data1) < 1) {
                    const err7: ErrorObject = { instancePath: instancePath + "/$id", schemaPath: "#/properties/%24id/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters", schema: 1, parentSchema: schema31.properties.$id, data: data1 };
                    if (vErrors === null) {
                        vErrors = [err7];
                    }
                    else {
                        (vErrors as ErrorObject[]).push(err7);
                    }
                    errors++;
                }
            }
            else {
                const err8: ErrorObject = { instancePath: instancePath + "/$id", schemaPath: "#/properties/%24id/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema31.properties.$id.type, parentSchema: schema31.properties.$id, data: data1 };
                if (vErrors === null) {
                    vErrors = [err8];
                }
                else {
                    (vErrors as ErrorObject[]).push(err8);
                }
                errors++;
            }
        }
        if (data.type !== undefined) {
            let data2 = data.type;
            if (typeof data2 !== "string") {
                const err9: ErrorObject = { instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema31.properties.type.type, parentSchema: schema31.properties.type, data: data2 };
                if (vErrors === null) {
                    vErrors = [err9];
                }
                else {
                    (vErrors as ErrorObject[]).push(err9);
                }
                errors++;
            }
            if ("array" !== data2) {
                const err10: ErrorObject = { instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "array" }, message: "must be equal to constant", schema: "array", parentSchema: schema31.properties.type, data: data2 };
                if (vErrors === null) {
                    vErrors = [err10];
                }
                else {
                    (vErrors as ErrorObject[]).push(err10);
                }
                errors++;
            }
        }
        if (data.uniqueItems !== undefined) {
            let data3 = data.uniqueItems;
            if (typeof data3 !== "boolean") {
                const err11: ErrorObject = { instancePath: instancePath + "/uniqueItems", schemaPath: "#/properties/uniqueItems/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean", schema: schema31.properties.uniqueItems.type, parentSchema: schema31.properties.uniqueItems, data: data3 };
                if (vErrors === null) {
                    vErrors = [err11];
                }
                else {
                    (vErrors as ErrorObject[]).push(err11);
                }
                errors++;
            }
            if (true !== data3) {
                const err12: ErrorObject = { instancePath: instancePath + "/uniqueItems", schemaPath: "#/properties/uniqueItems/const", keyword: "const", params: { allowedValue: true }, message: "must be equal to constant", schema: true, parentSchema: schema31.properties.uniqueItems, data: data3 };
                if (vErrors === null) {
                    vErrors = [err12];
                }
                else {
                    (vErrors as ErrorObject[]).push(err12);
                }
                errors++;
            }
        }
        if (data.$defs !== undefined) {
            let data4 = data.$defs;
            if (ajv_utilities__is_probably_object(data4)) {
                if (Object.keys(data4).length < 1) {
                    const err13: ErrorObject = { instancePath: instancePath + "/$defs", schemaPath: "#/properties/%24defs/minProperties", keyword: "minProperties", params: { limit: 1 }, message: "must NOT have fewer than 1 properties", schema: 1, parentSchema: schema31.properties.$defs, data: data4 };
                    if (vErrors === null) {
                        vErrors = [err13];
                    }
                    else {
                        (vErrors as ErrorObject[]).push(err13);
                    }
                    errors++;
                }
                for (const key1 in data4) {
                    let data5 = data4[key1];
                    const _errs14 = errors;
                    let valid2 = false;
                    let passing0 = null;
                    const _errs15 = errors;
                    if (ajv_utilities__is_probably_object(data5)) {
                        if (data5.type === undefined) {
                            const err14: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/%24defs/additionalProperties/oneOf/0/required", keyword: "required", params: { missingProperty: "type" }, message: "must have required property '" + "type" + "'", schema: schema31.properties.$defs.additionalProperties.oneOf[0].required, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[0], data: data5 };
                            if (vErrors === null) {
                                vErrors = [err14];
                            }
                            else {
                                (vErrors as ErrorObject[]).push(err14);
                            }
                            errors++;
                        }
                        if (data5.type !== undefined) {
                            let data6 = data5.type;
                            if (typeof data6 === "string") {
                                if (func1(data6) < 1) {
                                    const err15: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/type", schemaPath: "#/properties/%24defs/additionalProperties/oneOf/0/properties/type/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters", schema: 1, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[0].properties.type, data: data6 };
                                    if (vErrors === null) {
                                        vErrors = [err15];
                                    }
                                    else {
                                        (vErrors as ErrorObject[]).push(err15);
                                    }
                                    errors++;
                                }
                            }
                            else {
                                const err16: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/type", schemaPath: "#/properties/%24defs/additionalProperties/oneOf/0/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema31.properties.$defs.additionalProperties.oneOf[0].properties.type.type, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[0].properties.type, data: data6 };
                                if (vErrors === null) {
                                    vErrors = [err16];
                                }
                                else {
                                    (vErrors as ErrorObject[]).push(err16);
                                }
                                errors++;
                            }
                        }
                    }
                    else {
                        const err17: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/%24defs/additionalProperties/oneOf/0/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema31.properties.$defs.additionalProperties.oneOf[0].type, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[0], data: data5 };
                        if (vErrors === null) {
                            vErrors = [err17];
                        }
                        else {
                            (vErrors as ErrorObject[]).push(err17);
                        }
                        errors++;
                    }
                    var _valid0 = _errs15 === errors;
                    if (_valid0) {
                        valid2 = true;
                        passing0 = 0;
                        props0 = {};
                        props0.type = true;
                    }
                    const _errs19 = errors;
                    if (ajv_utilities__is_probably_object(data5)) {
                        if (data5.allOf === undefined) {
                            const err18: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/%24defs/additionalProperties/oneOf/1/required", keyword: "required", params: { missingProperty: "allOf" }, message: "must have required property '" + "allOf" + "'", schema: schema31.properties.$defs.additionalProperties.oneOf[1].required, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[1], data: data5 };
                            if (vErrors === null) {
                                vErrors = [err18];
                            }
                            else {
                                (vErrors as ErrorObject[]).push(err18);
                            }
                            errors++;
                        }
                        for (const key2 in data5) {
                            if (!(key2 === "allOf")) {
                                const err19: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/%24defs/additionalProperties/oneOf/1/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key2 }, message: "must NOT have additional properties", schema: false, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[1], data: data5 };
                                if (vErrors === null) {
                                    vErrors = [err19];
                                }
                                else {
                                    (vErrors as ErrorObject[]).push(err19);
                                }
                                errors++;
                            }
                        }
                        if (data5.allOf !== undefined) {
                            let data7 = data5.allOf;
                            if (ajv_utilities__is_probably_array(data7)) {
                                if (data7.length < 2) {
                                    const err20: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/allOf", schemaPath: "#/properties/%24defs/additionalProperties/oneOf/1/properties/allOf/minItems", keyword: "minItems", params: { limit: 2 }, message: "must NOT have fewer than 2 items", schema: 2, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[1].properties.allOf, data: data7 };
                                    if (vErrors === null) {
                                        vErrors = [err20];
                                    }
                                    else {
                                        (vErrors as ErrorObject[]).push(err20);
                                    }
                                    errors++;
                                }
                                const len0 = data7.length;
                                for (let i0 = 0; i0 < len0; i0++) {
                                    let data8 = data7[i0];
                                    const _errs25 = errors;
                                    let valid7 = false;
                                    let passing1 = null;
                                    const _errs26 = errors;
                                    if (ajv_utilities__is_probably_object(data8)) {
                                        if (data8.type === undefined) {
                                            const err21: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/allOf/" + i0, schemaPath: "#/properties/%24defs/additionalProperties/oneOf/1/properties/allOf/items/oneOf/0/required", keyword: "required", params: { missingProperty: "type" }, message: "must have required property '" + "type" + "'", schema: schema31.properties.$defs.additionalProperties.oneOf[1].properties.allOf.items.oneOf[0].required, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[1].properties.allOf.items.oneOf[0], data: data8 };
                                            if (vErrors === null) {
                                                vErrors = [err21];
                                            }
                                            else {
                                                (vErrors as ErrorObject[]).push(err21);
                                            }
                                            errors++;
                                        }
                                        if (data8.type !== undefined) {
                                            let data9 = data8.type;
                                            if (typeof data9 === "string") {
                                                if (func1(data9) < 1) {
                                                    const err22: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/allOf/" + i0 + "/type", schemaPath: "#/properties/%24defs/additionalProperties/oneOf/1/properties/allOf/items/oneOf/0/properties/type/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters", schema: 1, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[1].properties.allOf.items.oneOf[0].properties.type, data: data9 };
                                                    if (vErrors === null) {
                                                        vErrors = [err22];
                                                    }
                                                    else {
                                                        (vErrors as ErrorObject[]).push(err22);
                                                    }
                                                    errors++;
                                                }
                                            }
                                            else {
                                                const err23: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/allOf/" + i0 + "/type", schemaPath: "#/properties/%24defs/additionalProperties/oneOf/1/properties/allOf/items/oneOf/0/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema31.properties.$defs.additionalProperties.oneOf[1].properties.allOf.items.oneOf[0].properties.type.type, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[1].properties.allOf.items.oneOf[0].properties.type, data: data9 };
                                                if (vErrors === null) {
                                                    vErrors = [err23];
                                                }
                                                else {
                                                    (vErrors as ErrorObject[]).push(err23);
                                                }
                                                errors++;
                                            }
                                        }
                                    }
                                    else {
                                        const err24: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/allOf/" + i0, schemaPath: "#/properties/%24defs/additionalProperties/oneOf/1/properties/allOf/items/oneOf/0/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema31.properties.$defs.additionalProperties.oneOf[1].properties.allOf.items.oneOf[0].type, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[1].properties.allOf.items.oneOf[0], data: data8 };
                                        if (vErrors === null) {
                                            vErrors = [err24];
                                        }
                                        else {
                                            (vErrors as ErrorObject[]).push(err24);
                                        }
                                        errors++;
                                    }
                                    var _valid1 = _errs26 === errors;
                                    if (_valid1) {
                                        valid7 = true;
                                        passing1 = 0;
                                        props1 = {};
                                        props1.type = true;
                                    }
                                    const _errs30 = errors;
                                    if (ajv_utilities__is_probably_object(data8)) {
                                        if (data8.$ref === undefined) {
                                            const err25: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/allOf/" + i0, schemaPath: "#/properties/%24defs/additionalProperties/oneOf/1/properties/allOf/items/oneOf/1/required", keyword: "required", params: { missingProperty: "$ref" }, message: "must have required property '" + "$ref" + "'", schema: schema31.properties.$defs.additionalProperties.oneOf[1].properties.allOf.items.oneOf[1].required, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[1].properties.allOf.items.oneOf[1], data: data8 };
                                            if (vErrors === null) {
                                                vErrors = [err25];
                                            }
                                            else {
                                                (vErrors as ErrorObject[]).push(err25);
                                            }
                                            errors++;
                                        }
                                        for (const key3 in data8) {
                                            if (!(key3 === "$ref")) {
                                                const err26: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/allOf/" + i0, schemaPath: "#/properties/%24defs/additionalProperties/oneOf/1/properties/allOf/items/oneOf/1/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key3 }, message: "must NOT have additional properties", schema: false, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[1].properties.allOf.items.oneOf[1], data: data8 };
                                                if (vErrors === null) {
                                                    vErrors = [err26];
                                                }
                                                else {
                                                    (vErrors as ErrorObject[]).push(err26);
                                                }
                                                errors++;
                                            }
                                        }
                                        if (data8.$ref !== undefined) {
                                            let data10 = data8.$ref;
                                            if (typeof data10 === "string") {
                                                if (!pattern4.test(data10)) {
                                                    const err27: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/allOf/" + i0 + "/$ref", schemaPath: "#/properties/%24defs/additionalProperties/oneOf/1/properties/allOf/items/oneOf/1/properties/%24ref/pattern", keyword: "pattern", params: { pattern: "^(.+)?#\\/\\$defs\\/(.+)$" }, message: "must match pattern \"" + "^(.+)?#\\/\\$defs\\/(.+)$" + "\"", schema: "^(.+)?#\\/\\$defs\\/(.+)$", parentSchema: schema31.properties.$defs.additionalProperties.oneOf[1].properties.allOf.items.oneOf[1].properties.$ref, data: data10 };
                                                    if (vErrors === null) {
                                                        vErrors = [err27];
                                                    }
                                                    else {
                                                        (vErrors as ErrorObject[]).push(err27);
                                                    }
                                                    errors++;
                                                }
                                            }
                                            else {
                                                const err28: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/allOf/" + i0 + "/$ref", schemaPath: "#/properties/%24defs/additionalProperties/oneOf/1/properties/allOf/items/oneOf/1/properties/%24ref/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema31.properties.$defs.additionalProperties.oneOf[1].properties.allOf.items.oneOf[1].properties.$ref.type, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[1].properties.allOf.items.oneOf[1].properties.$ref, data: data10 };
                                                if (vErrors === null) {
                                                    vErrors = [err28];
                                                }
                                                else {
                                                    (vErrors as ErrorObject[]).push(err28);
                                                }
                                                errors++;
                                            }
                                        }
                                    }
                                    else {
                                        const err29: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/allOf/" + i0, schemaPath: "#/properties/%24defs/additionalProperties/oneOf/1/properties/allOf/items/oneOf/1/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema31.properties.$defs.additionalProperties.oneOf[1].properties.allOf.items.oneOf[1].type, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[1].properties.allOf.items.oneOf[1], data: data8 };
                                        if (vErrors === null) {
                                            vErrors = [err29];
                                        }
                                        else {
                                            (vErrors as ErrorObject[]).push(err29);
                                        }
                                        errors++;
                                    }
                                    var _valid1 = _errs30 === errors;
                                    if (_valid1 && valid7) {
                                        valid7 = false;
                                        passing1 = [passing1, 1];
                                    }
                                    else {
                                        if (_valid1) {
                                            valid7 = true;
                                            passing1 = 1;
                                            if (props1 !== true) {
                                                props1 = true;
                                            }
                                        }
                                    }
                                    if (!valid7) {
                                        const err30: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/allOf/" + i0, schemaPath: "#/properties/%24defs/additionalProperties/oneOf/1/properties/allOf/items/oneOf", keyword: "oneOf", params: { passingSchemas: passing1 }, message: "must match exactly one schema in oneOf", schema: schema31.properties.$defs.additionalProperties.oneOf[1].properties.allOf.items.oneOf, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[1].properties.allOf.items, data: data8 };
                                        if (vErrors === null) {
                                            vErrors = [err30];
                                        }
                                        else {
                                            (vErrors as ErrorObject[]).push(err30);
                                        }
                                        errors++;
                                    }
                                    else {
                                        errors = _errs25;
                                        if (vErrors !== null) {
                                            if (_errs25) {
                                                vErrors.length = _errs25;
                                            }
                                            else {
                                                vErrors = null;
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                const err31: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/allOf", schemaPath: "#/properties/%24defs/additionalProperties/oneOf/1/properties/allOf/type", keyword: "type", params: { type: "array" }, message: "must be array", schema: schema31.properties.$defs.additionalProperties.oneOf[1].properties.allOf.type, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[1].properties.allOf, data: data7 };
                                if (vErrors === null) {
                                    vErrors = [err31];
                                }
                                else {
                                    (vErrors as ErrorObject[]).push(err31);
                                }
                                errors++;
                            }
                        }
                    }
                    else {
                        const err32: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/%24defs/additionalProperties/oneOf/1/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema31.properties.$defs.additionalProperties.oneOf[1].type, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[1], data: data5 };
                        if (vErrors === null) {
                            vErrors = [err32];
                        }
                        else {
                            (vErrors as ErrorObject[]).push(err32);
                        }
                        errors++;
                    }
                    var _valid0 = _errs19 === errors;
                    if (_valid0 && valid2) {
                        valid2 = false;
                        passing0 = [passing0, 1];
                    }
                    else {
                        if (_valid0) {
                            valid2 = true;
                            passing0 = 1;
                            if (props0 !== true) {
                                props0 = true;
                            }
                        }
                        const _errs35 = errors;
                        if (ajv_utilities__is_probably_object(data5)) {
                            if (data5.oneOf === undefined) {
                                const err33: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/%24defs/additionalProperties/oneOf/2/required", keyword: "required", params: { missingProperty: "oneOf" }, message: "must have required property '" + "oneOf" + "'", schema: schema31.properties.$defs.additionalProperties.oneOf[2].required, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[2], data: data5 };
                                if (vErrors === null) {
                                    vErrors = [err33];
                                }
                                else {
                                    (vErrors as ErrorObject[]).push(err33);
                                }
                                errors++;
                            }
                            for (const key4 in data5) {
                                if (!(key4 === "oneOf")) {
                                    const err34: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/%24defs/additionalProperties/oneOf/2/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key4 }, message: "must NOT have additional properties", schema: false, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[2], data: data5 };
                                    if (vErrors === null) {
                                        vErrors = [err34];
                                    }
                                    else {
                                        (vErrors as ErrorObject[]).push(err34);
                                    }
                                    errors++;
                                }
                            }
                            if (data5.oneOf !== undefined) {
                                let data11 = data5.oneOf;
                                if (ajv_utilities__is_probably_array(data11)) {
                                    if (data11.length < 2) {
                                        const err35: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/oneOf", schemaPath: "#/properties/%24defs/additionalProperties/oneOf/2/properties/oneOf/minItems", keyword: "minItems", params: { limit: 2 }, message: "must NOT have fewer than 2 items", schema: 2, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[2].properties.oneOf, data: data11 };
                                        if (vErrors === null) {
                                            vErrors = [err35];
                                        }
                                        else {
                                            (vErrors as ErrorObject[]).push(err35);
                                        }
                                        errors++;
                                    }
                                    const len1 = data11.length;
                                    for (let i1 = 0; i1 < len1; i1++) {
                                        let data12 = data11[i1];
                                        const _errs41 = errors;
                                        let valid13 = false;
                                        let passing2 = null;
                                        const _errs42 = errors;
                                        if (ajv_utilities__is_probably_object(data12)) {
                                            if (data12.type === undefined) {
                                                const err36: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/oneOf/" + i1, schemaPath: "#/properties/%24defs/additionalProperties/oneOf/2/properties/oneOf/items/oneOf/0/required", keyword: "required", params: { missingProperty: "type" }, message: "must have required property '" + "type" + "'", schema: schema31.properties.$defs.additionalProperties.oneOf[2].properties.oneOf.items.oneOf[0].required, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[2].properties.oneOf.items.oneOf[0], data: data12 };
                                                if (vErrors === null) {
                                                    vErrors = [err36];
                                                }
                                                else {
                                                    (vErrors as ErrorObject[]).push(err36);
                                                }
                                                errors++;
                                            }
                                            if (data12.type !== undefined) {
                                                let data13 = data12.type;
                                                if (typeof data13 === "string") {
                                                    if (func1(data13) < 1) {
                                                        const err37: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/oneOf/" + i1 + "/type", schemaPath: "#/properties/%24defs/additionalProperties/oneOf/2/properties/oneOf/items/oneOf/0/properties/type/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters", schema: 1, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[2].properties.oneOf.items.oneOf[0].properties.type, data: data13 };
                                                        if (vErrors === null) {
                                                            vErrors = [err37];
                                                        }
                                                        else {
                                                            (vErrors as ErrorObject[]).push(err37);
                                                        }
                                                        errors++;
                                                    }
                                                }
                                                else {
                                                    const err38: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/oneOf/" + i1 + "/type", schemaPath: "#/properties/%24defs/additionalProperties/oneOf/2/properties/oneOf/items/oneOf/0/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema31.properties.$defs.additionalProperties.oneOf[2].properties.oneOf.items.oneOf[0].properties.type.type, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[2].properties.oneOf.items.oneOf[0].properties.type, data: data13 };
                                                    if (vErrors === null) {
                                                        vErrors = [err38];
                                                    }
                                                    else {
                                                        (vErrors as ErrorObject[]).push(err38);
                                                    }
                                                    errors++;
                                                }
                                            }
                                        }
                                        else {
                                            const err39: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/oneOf/" + i1, schemaPath: "#/properties/%24defs/additionalProperties/oneOf/2/properties/oneOf/items/oneOf/0/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema31.properties.$defs.additionalProperties.oneOf[2].properties.oneOf.items.oneOf[0].type, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[2].properties.oneOf.items.oneOf[0], data: data12 };
                                            if (vErrors === null) {
                                                vErrors = [err39];
                                            }
                                            else {
                                                (vErrors as ErrorObject[]).push(err39);
                                            }
                                            errors++;
                                        }
                                        var _valid2 = _errs42 === errors;
                                        if (_valid2) {
                                            valid13 = true;
                                            passing2 = 0;
                                            props2 = {};
                                            props2.type = true;
                                        }
                                        const _errs46 = errors;
                                        if (ajv_utilities__is_probably_object(data12)) {
                                            if (data12.$ref === undefined) {
                                                const err40: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/oneOf/" + i1, schemaPath: "#/properties/%24defs/additionalProperties/oneOf/2/properties/oneOf/items/oneOf/1/required", keyword: "required", params: { missingProperty: "$ref" }, message: "must have required property '" + "$ref" + "'", schema: schema31.properties.$defs.additionalProperties.oneOf[2].properties.oneOf.items.oneOf[1].required, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[2].properties.oneOf.items.oneOf[1], data: data12 };
                                                if (vErrors === null) {
                                                    vErrors = [err40];
                                                }
                                                else {
                                                    (vErrors as ErrorObject[]).push(err40);
                                                }
                                                errors++;
                                            }
                                            for (const key5 in data12) {
                                                if (!(key5 === "$ref")) {
                                                    const err41: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/oneOf/" + i1, schemaPath: "#/properties/%24defs/additionalProperties/oneOf/2/properties/oneOf/items/oneOf/1/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key5 }, message: "must NOT have additional properties", schema: false, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[2].properties.oneOf.items.oneOf[1], data: data12 };
                                                    if (vErrors === null) {
                                                        vErrors = [err41];
                                                    }
                                                    else {
                                                        (vErrors as ErrorObject[]).push(err41);
                                                    }
                                                    errors++;
                                                }
                                            }
                                            if (data12.$ref !== undefined) {
                                                let data14 = data12.$ref;
                                                if (typeof data14 === "string") {
                                                    if (!pattern4.test(data14)) {
                                                        const err42: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/oneOf/" + i1 + "/$ref", schemaPath: "#/properties/%24defs/additionalProperties/oneOf/2/properties/oneOf/items/oneOf/1/properties/%24ref/pattern", keyword: "pattern", params: { pattern: "^(.+)?#\\/\\$defs\\/(.+)$" }, message: "must match pattern \"" + "^(.+)?#\\/\\$defs\\/(.+)$" + "\"", schema: "^(.+)?#\\/\\$defs\\/(.+)$", parentSchema: schema31.properties.$defs.additionalProperties.oneOf[2].properties.oneOf.items.oneOf[1].properties.$ref, data: data14 };
                                                        if (vErrors === null) {
                                                            vErrors = [err42];
                                                        }
                                                        else {
                                                            (vErrors as ErrorObject[]).push(err42);
                                                        }
                                                        errors++;
                                                    }
                                                }
                                                else {
                                                    const err43: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/oneOf/" + i1 + "/$ref", schemaPath: "#/properties/%24defs/additionalProperties/oneOf/2/properties/oneOf/items/oneOf/1/properties/%24ref/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema31.properties.$defs.additionalProperties.oneOf[2].properties.oneOf.items.oneOf[1].properties.$ref.type, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[2].properties.oneOf.items.oneOf[1].properties.$ref, data: data14 };
                                                    if (vErrors === null) {
                                                        vErrors = [err43];
                                                    }
                                                    else {
                                                        (vErrors as ErrorObject[]).push(err43);
                                                    }
                                                    errors++;
                                                }
                                            }
                                        }
                                        else {
                                            const err44: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/oneOf/" + i1, schemaPath: "#/properties/%24defs/additionalProperties/oneOf/2/properties/oneOf/items/oneOf/1/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema31.properties.$defs.additionalProperties.oneOf[2].properties.oneOf.items.oneOf[1].type, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[2].properties.oneOf.items.oneOf[1], data: data12 };
                                            if (vErrors === null) {
                                                vErrors = [err44];
                                            }
                                            else {
                                                (vErrors as ErrorObject[]).push(err44);
                                            }
                                            errors++;
                                        }
                                        var _valid2 = _errs46 === errors;
                                        if (_valid2 && valid13) {
                                            valid13 = false;
                                            passing2 = [passing2, 1];
                                        }
                                        else {
                                            if (_valid2) {
                                                valid13 = true;
                                                passing2 = 1;
                                                if (props2 !== true) {
                                                    props2 = true;
                                                }
                                            }
                                        }
                                        if (!valid13) {
                                            const err45: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/oneOf/" + i1, schemaPath: "#/properties/%24defs/additionalProperties/oneOf/2/properties/oneOf/items/oneOf", keyword: "oneOf", params: { passingSchemas: passing2 }, message: "must match exactly one schema in oneOf", schema: schema31.properties.$defs.additionalProperties.oneOf[2].properties.oneOf.items.oneOf, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[2].properties.oneOf.items, data: data12 };
                                            if (vErrors === null) {
                                                vErrors = [err45];
                                            }
                                            else {
                                                (vErrors as ErrorObject[]).push(err45);
                                            }
                                            errors++;
                                        }
                                        else {
                                            errors = _errs41;
                                            if (vErrors !== null) {
                                                if (_errs41) {
                                                    vErrors.length = _errs41;
                                                }
                                                else {
                                                    vErrors = null;
                                                }
                                            }
                                        }
                                    }
                                }
                                else {
                                    const err46: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1") + "/oneOf", schemaPath: "#/properties/%24defs/additionalProperties/oneOf/2/properties/oneOf/type", keyword: "type", params: { type: "array" }, message: "must be array", schema: schema31.properties.$defs.additionalProperties.oneOf[2].properties.oneOf.type, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[2].properties.oneOf, data: data11 };
                                    if (vErrors === null) {
                                        vErrors = [err46];
                                    }
                                    else {
                                        (vErrors as ErrorObject[]).push(err46);
                                    }
                                    errors++;
                                }
                            }
                        }
                        else {
                            const err47: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/%24defs/additionalProperties/oneOf/2/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema31.properties.$defs.additionalProperties.oneOf[2].type, parentSchema: schema31.properties.$defs.additionalProperties.oneOf[2], data: data5 };
                            if (vErrors === null) {
                                vErrors = [err47];
                            }
                            else {
                                (vErrors as ErrorObject[]).push(err47);
                            }
                            errors++;
                        }
                        var _valid0 = _errs35 === errors;
                        if (_valid0 && valid2) {
                            valid2 = false;
                            passing0 = [passing0, 2];
                        }
                        else {
                            if (_valid0) {
                                valid2 = true;
                                passing0 = 2;
                                if (props0 !== true) {
                                    props0 = true;
                                }
                            }
                        }
                    }
                    if (!valid2) {
                        const err48: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/%24defs/additionalProperties/oneOf", keyword: "oneOf", params: { passingSchemas: passing0 }, message: "must match exactly one schema in oneOf", schema: schema31.properties.$defs.additionalProperties.oneOf, parentSchema: schema31.properties.$defs.additionalProperties, data: data5 };
                        if (vErrors === null) {
                            vErrors = [err48];
                        }
                        else {
                            (vErrors as ErrorObject[]).push(err48);
                        }
                        errors++;
                    }
                    else {
                        errors = _errs14;
                        if (vErrors !== null) {
                            if (_errs14) {
                                vErrors.length = _errs14;
                            }
                            else {
                                vErrors = null;
                            }
                        }
                    }
                }
            }
            else {
                const err49: ErrorObject = { instancePath: instancePath + "/$defs", schemaPath: "#/properties/%24defs/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema31.properties.$defs.type, parentSchema: schema31.properties.$defs, data: data4 };
                if (vErrors === null) {
                    vErrors = [err49];
                }
                else {
                    (vErrors as ErrorObject[]).push(err49);
                }
                errors++;
            }
        }
        if (data.minItems !== undefined) {
            let data15 = data.minItems;
            if (!(((typeof data15 == "number") && (!(data15 % 1) && !isNaN(data15))) && (isFinite(data15)))) {
                const err50: ErrorObject = { instancePath: instancePath + "/minItems", schemaPath: "#/properties/minItems/type", keyword: "type", params: { type: "integer" }, message: "must be integer", schema: schema31.properties.minItems.type, parentSchema: schema31.properties.minItems, data: data15 };
                if (vErrors === null) {
                    vErrors = [err50];
                }
                else {
                    (vErrors as ErrorObject[]).push(err50);
                }
                errors++;
            }
            if ((typeof data15 == "number") && (isFinite(data15))) {
                if (data15 < 0 || isNaN(data15)) {
                    const err51: ErrorObject = { instancePath: instancePath + "/minItems", schemaPath: "#/properties/minItems/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0", schema: 0, parentSchema: schema31.properties.minItems, data: data15 };
                    if (vErrors === null) {
                        vErrors = [err51];
                    }
                    else {
                        (vErrors as ErrorObject[]).push(err51);
                    }
                    errors++;
                }
            }
        }
        if (data.maxItems !== undefined) {
            let data16 = data.maxItems;
            if (!(((typeof data16 == "number") && (!(data16 % 1) && !isNaN(data16))) && (isFinite(data16)))) {
                const err52: ErrorObject = { instancePath: instancePath + "/maxItems", schemaPath: "#/properties/maxItems/type", keyword: "type", params: { type: "integer" }, message: "must be integer", schema: schema31.properties.maxItems.type, parentSchema: schema31.properties.maxItems, data: data16 };
                if (vErrors === null) {
                    vErrors = [err52];
                }
                else {
                    (vErrors as ErrorObject[]).push(err52);
                }
                errors++;
            }
            if ((typeof data16 == "number") && (isFinite(data16))) {
                if (data16 < 0 || isNaN(data16)) {
                    const err53: ErrorObject = { instancePath: instancePath + "/maxItems", schemaPath: "#/properties/maxItems/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0", schema: 0, parentSchema: schema31.properties.maxItems, data: data16 };
                    if (vErrors === null) {
                        vErrors = [err53];
                    }
                    else {
                        (vErrors as ErrorObject[]).push(err53);
                    }
                    errors++;
                }
            }
        }
    }
    else {
        const err54: ErrorObject = { instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema31.type, parentSchema: schema31, data };
        if (vErrors === null) {
            vErrors = [err54];
        }
        else {
            (vErrors as ErrorObject[]).push(err54);
        }
        errors++;
    }
    (validate20 as Is).errors = vErrors;
    return errors === 0;
}
validate20.evaluated = { "props": true, "dynamicProps": false, "dynamicItems": false } as Is["evaluated"];
