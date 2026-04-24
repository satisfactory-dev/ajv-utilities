import type { ErrorObject, ValidateFunction } from 'ajv';
import type { Is } from '@satisfactory-dev/ajv-utilities';
import type { templated_string_type } from '@signpostmarv/json-schema-typescript-codegen/ajv';
function ajv_utilities__is_probably_object(maybe: unknown): maybe is Record<string, unknown> { return !!maybe && typeof maybe === "object" && !Array.isArray(maybe); }
function ajv_utilities__is_probably_array(maybe: unknown): maybe is unknown[] { return Array.isArray(maybe); }
import fast_deep_equal from 'fast-deep-equal';
import { ucs2length } from '@satisfactory-dev/ajv-utilities/ajv';
export const PropertySchemaToRegex_TemplatedString = validate20;
const schema31 = { "$id": "docs.json.ts--lib--PropertySchemaToRegex--TemplatedString", "type": "object", "required": ["type", "templated_string"] as const, "additionalProperties": false, "properties": { "$defs": { "type": "object", "additionalProperties": { "type": "object" } }, "type": { "type": "string", "const": "string" }, "templated_string": { "type": "array", "minItems": 1, "items": { "oneOf": [{ "type": "string", "minLength": 1 }, { "type": "object", "const": { "type": "string" } }, { "type": "object", "const": { "type": "string", "minLength": 1 } }, { "type": "array", "minItems": 2, "items": { "oneOf": [{ "type": "string", "minLength": 1 }, { "type": "object", "const": { "type": "string" } }] as const } }, { "$ref": "#" }] as const } } } };
const func1 = ucs2length;
const func0 = fast_deep_equal;
function validate20(data: unknown, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} }: Partial<Omit<Exclude<Parameters<ValidateFunction>[1], undefined>, "rootData"> & {
    rootData: unknown;
}> = {}): data is templated_string_type {
    /*# sourceURL="docs.json.ts--lib--PropertySchemaToRegex--TemplatedString" */ ;
    let vErrors: ErrorObject[] = [];
    let errors = 0;
    const evaluated0 = (validate20 as Is).evaluated;
    if (evaluated0?.dynamicProps) {
        evaluated0.props = undefined;
    }
    if (evaluated0?.dynamicItems) {
        evaluated0.items = undefined;
    }
    if (ajv_utilities__is_probably_object(data)) {
        if (data.type === undefined) {
            const err0: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "type" }, message: "must have required property '" + "type" + "'", schema: schema31.required, parentSchema: schema31, data };
            vErrors.push(err0)
            errors++;
        }
        if (data.templated_string === undefined) {
            const err1: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "templated_string" }, message: "must have required property '" + "templated_string" + "'", schema: schema31.required, parentSchema: schema31, data };
            vErrors.push(err1)
            errors++;
        }
        for (const key0 in data) {
            if (!(((key0 === "$defs") || (key0 === "type")) || (key0 === "templated_string"))) {
                const err2: ErrorObject = { instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties", schema: false, parentSchema: schema31, data };
                vErrors.push(err2)
                errors++;
            }
        }
        if (data.$defs !== undefined) {
            let data0 = data.$defs;
            if (ajv_utilities__is_probably_object(data0)) {
                for (const key1 in data0) {
                    let data1 = data0[key1];
                    if (!(data1 && typeof data1 == "object" && !Array.isArray(data1))) {
                        const err3: ErrorObject = { instancePath: instancePath + "/$defs/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"), schemaPath: "#/properties/%24defs/additionalProperties/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema31.properties.$defs.additionalProperties.type, parentSchema: schema31.properties.$defs.additionalProperties, data: data1 };
                        vErrors.push(err3)
                        errors++;
                    }
                }
            }
            else {
                const err4: ErrorObject = { instancePath: instancePath + "/$defs", schemaPath: "#/properties/%24defs/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema31.properties.$defs.type, parentSchema: schema31.properties.$defs, data: data0 };
                vErrors.push(err4)
                errors++;
            }
        }
        if (data.type !== undefined) {
            let data2 = data.type;
            if (typeof data2 !== "string") {
                const err5: ErrorObject = { instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema31.properties.type.type, parentSchema: schema31.properties.type, data: data2 };
                vErrors.push(err5)
                errors++;
            }
            if ("string" !== data2) {
                const err6: ErrorObject = { instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "string" }, message: "must be equal to constant", schema: "string", parentSchema: schema31.properties.type, data: data2 };
                vErrors.push(err6)
                errors++;
            }
        }
        if (data.templated_string !== undefined) {
            let data3 = data.templated_string;
            if (ajv_utilities__is_probably_array(data3)) {
                if (data3.length < 1) {
                    const err7: ErrorObject = { instancePath: instancePath + "/templated_string", schemaPath: "#/properties/templated_string/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items", schema: 1, parentSchema: schema31.properties.templated_string, data: data3 };
                    vErrors.push(err7)
                    errors++;
                }
                const len0 = data3.length;
                for (let i0 = 0; i0 < len0; i0++) {
                    let data4 = data3[i0];
                    const _errs12 = errors;
                    let valid4 = false;
                    let passing0 = null;
                    const _errs13 = errors;
                    if (typeof data4 === "string") {
                        if (func1(data4) < 1) {
                            const err8: ErrorObject = { instancePath: instancePath + "/templated_string/" + i0, schemaPath: "#/properties/templated_string/items/oneOf/0/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters", schema: 1, parentSchema: schema31.properties.templated_string.items.oneOf[0], data: data4 };
                            vErrors.push(err8)
                            errors++;
                        }
                    }
                    else {
                        const err9: ErrorObject = { instancePath: instancePath + "/templated_string/" + i0, schemaPath: "#/properties/templated_string/items/oneOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema31.properties.templated_string.items.oneOf[0].type, parentSchema: schema31.properties.templated_string.items.oneOf[0], data: data4 };
                        vErrors.push(err9)
                        errors++;
                    }
                    var _valid0 = _errs13 === errors;
                    if (_valid0) {
                        valid4 = true;
                        passing0 = 0;
                    }
                    const _errs15 = errors;
                    if (!(data4 && typeof data4 == "object" && !Array.isArray(data4))) {
                        const err10: ErrorObject = { instancePath: instancePath + "/templated_string/" + i0, schemaPath: "#/properties/templated_string/items/oneOf/1/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema31.properties.templated_string.items.oneOf[1].type, parentSchema: schema31.properties.templated_string.items.oneOf[1], data: data4 };
                        vErrors.push(err10)
                        errors++;
                    }
                    if (!func0(data4, schema31.properties.templated_string.items.oneOf[1].const)) {
                        const err11: ErrorObject = { instancePath: instancePath + "/templated_string/" + i0, schemaPath: "#/properties/templated_string/items/oneOf/1/const", keyword: "const", params: { allowedValue: schema31.properties.templated_string.items.oneOf[1].const }, message: "must be equal to constant", schema: schema31.properties.templated_string.items.oneOf[1].const, parentSchema: schema31.properties.templated_string.items.oneOf[1], data: data4 };
                        vErrors.push(err11)
                        errors++;
                    }
                    var _valid0 = _errs15 === errors;
                    if (_valid0 && valid4) {
                        valid4 = false;
                        passing0 = [passing0, 1];
                    }
                    else {
                        if (_valid0) {
                            valid4 = true;
                            passing0 = 1;
                        }
                        const _errs17 = errors;
                        if (!(data4 && typeof data4 == "object" && !Array.isArray(data4))) {
                            const err12: ErrorObject = { instancePath: instancePath + "/templated_string/" + i0, schemaPath: "#/properties/templated_string/items/oneOf/2/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema31.properties.templated_string.items.oneOf[2].type, parentSchema: schema31.properties.templated_string.items.oneOf[2], data: data4 };
                            vErrors.push(err12)
                            errors++;
                        }
                        if (!func0(data4, schema31.properties.templated_string.items.oneOf[2].const)) {
                            const err13: ErrorObject = { instancePath: instancePath + "/templated_string/" + i0, schemaPath: "#/properties/templated_string/items/oneOf/2/const", keyword: "const", params: { allowedValue: schema31.properties.templated_string.items.oneOf[2].const }, message: "must be equal to constant", schema: schema31.properties.templated_string.items.oneOf[2].const, parentSchema: schema31.properties.templated_string.items.oneOf[2], data: data4 };
                            vErrors.push(err13)
                            errors++;
                        }
                        var _valid0 = _errs17 === errors;
                        if (_valid0 && valid4) {
                            valid4 = false;
                            passing0 = [passing0, 2];
                        }
                        else {
                            if (_valid0) {
                                valid4 = true;
                                passing0 = 2;
                            }
                            const _errs19 = errors;
                            if (ajv_utilities__is_probably_array(data4)) {
                                if (data4.length < 2) {
                                    const err14: ErrorObject = { instancePath: instancePath + "/templated_string/" + i0, schemaPath: "#/properties/templated_string/items/oneOf/3/minItems", keyword: "minItems", params: { limit: 2 }, message: "must NOT have fewer than 2 items", schema: 2, parentSchema: schema31.properties.templated_string.items.oneOf[3], data: data4 };
                                    vErrors.push(err14)
                                    errors++;
                                }
                                const len1 = data4.length;
                                for (let i1 = 0; i1 < len1; i1++) {
                                    let data5 = data4[i1];
                                    const _errs22 = errors;
                                    let valid7 = false;
                                    let passing1 = null;
                                    const _errs23 = errors;
                                    if (typeof data5 === "string") {
                                        if (func1(data5) < 1) {
                                            const err15: ErrorObject = { instancePath: instancePath + "/templated_string/" + i0 + "/" + i1, schemaPath: "#/properties/templated_string/items/oneOf/3/items/oneOf/0/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters", schema: 1, parentSchema: schema31.properties.templated_string.items.oneOf[3].items.oneOf[0], data: data5 };
                                            vErrors.push(err15)
                                            errors++;
                                        }
                                    }
                                    else {
                                        const err16: ErrorObject = { instancePath: instancePath + "/templated_string/" + i0 + "/" + i1, schemaPath: "#/properties/templated_string/items/oneOf/3/items/oneOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string", schema: schema31.properties.templated_string.items.oneOf[3].items.oneOf[0].type, parentSchema: schema31.properties.templated_string.items.oneOf[3].items.oneOf[0], data: data5 };
                                        vErrors.push(err16)
                                        errors++;
                                    }
                                    var _valid1 = _errs23 === errors;
                                    if (_valid1) {
                                        valid7 = true;
                                        passing1 = 0;
                                    }
                                    const _errs25 = errors;
                                    if (!(data5 && typeof data5 == "object" && !Array.isArray(data5))) {
                                        const err17: ErrorObject = { instancePath: instancePath + "/templated_string/" + i0 + "/" + i1, schemaPath: "#/properties/templated_string/items/oneOf/3/items/oneOf/1/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema31.properties.templated_string.items.oneOf[3].items.oneOf[1].type, parentSchema: schema31.properties.templated_string.items.oneOf[3].items.oneOf[1], data: data5 };
                                        vErrors.push(err17)
                                        errors++;
                                    }
                                    if (!func0(data5, schema31.properties.templated_string.items.oneOf[3].items.oneOf[1].const)) {
                                        const err18: ErrorObject = { instancePath: instancePath + "/templated_string/" + i0 + "/" + i1, schemaPath: "#/properties/templated_string/items/oneOf/3/items/oneOf/1/const", keyword: "const", params: { allowedValue: schema31.properties.templated_string.items.oneOf[3].items.oneOf[1].const }, message: "must be equal to constant", schema: schema31.properties.templated_string.items.oneOf[3].items.oneOf[1].const, parentSchema: schema31.properties.templated_string.items.oneOf[3].items.oneOf[1], data: data5 };
                                        vErrors.push(err18)
                                        errors++;
                                    }
                                    var _valid1 = _errs25 === errors;
                                    if (_valid1 && valid7) {
                                        valid7 = false;
                                        passing1 = [passing1, 1];
                                    }
                                    else {
                                        if (_valid1) {
                                            valid7 = true;
                                            passing1 = 1;
                                        }
                                    }
                                    if (!valid7) {
                                        const err19: ErrorObject = { instancePath: instancePath + "/templated_string/" + i0 + "/" + i1, schemaPath: "#/properties/templated_string/items/oneOf/3/items/oneOf", keyword: "oneOf", params: { passingSchemas: passing1 }, message: "must match exactly one schema in oneOf", schema: schema31.properties.templated_string.items.oneOf[3].items.oneOf, parentSchema: schema31.properties.templated_string.items.oneOf[3].items, data: data5 };
                                        vErrors.push(err19)
                                        errors++;
                                    }
                                    else {
                                        errors = _errs22;
                                        if (vErrors.length) {
                                            if (_errs22) {
                                                vErrors.length = _errs22;
                                            }
                                            else {
                                                vErrors = [];
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                const err20: ErrorObject = { instancePath: instancePath + "/templated_string/" + i0, schemaPath: "#/properties/templated_string/items/oneOf/3/type", keyword: "type", params: { type: "array" }, message: "must be array", schema: schema31.properties.templated_string.items.oneOf[3].type, parentSchema: schema31.properties.templated_string.items.oneOf[3], data: data4 };
                                vErrors.push(err20)
                                errors++;
                            }
                            var _valid0 = _errs19 === errors;
                            if (_valid0 && valid4) {
                                valid4 = false;
                                passing0 = [passing0, 3];
                            }
                            else {
                                let items0: number | true = 0;
                                if (_valid0) {
                                    valid4 = true;
                                    passing0 = 3;
                                    items0 = true;
                                }
                                const _errs27 = errors;
                                if (!(validate20(data4, { instancePath: instancePath + "/templated_string/" + i0, parentData: data3, parentDataProperty: i0, rootData, dynamicAnchors }))) {
                                    vErrors = vErrors.concat((validate20 as Is).errors || []);
                                    errors = vErrors.length;
                                }
                                else {
                                    var items1 = (validate20 as Is).evaluated?.items;
                                }
                                var _valid0 = _errs27 === errors;
                                if (_valid0 && valid4) {
                                    valid4 = false;
                                    passing0 = [passing0, 4];
                                }
                                else {
                                    if (_valid0) {
                                        valid4 = true;
                                        passing0 = 4;
                                        if (items0 !== true && items1 !== undefined) {
                                            items0 = items1 === true ? true : items0 > items1 ? items0 : items1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (!valid4) {
                        const err21: ErrorObject = { instancePath: instancePath + "/templated_string/" + i0, schemaPath: "#/properties/templated_string/items/oneOf", keyword: "oneOf", params: { passingSchemas: passing0 }, message: "must match exactly one schema in oneOf", schema: schema31.properties.templated_string.items.oneOf, parentSchema: schema31.properties.templated_string.items, data: data4 };
                        vErrors.push(err21)
                        errors++;
                    }
                    else {
                        errors = _errs12;
                        if (vErrors.length) {
                            if (_errs12) {
                                vErrors.length = _errs12;
                            }
                            else {
                                vErrors = [];
                            }
                        }
                    }
                }
            }
            else {
                const err22: ErrorObject = { instancePath: instancePath + "/templated_string", schemaPath: "#/properties/templated_string/type", keyword: "type", params: { type: "array" }, message: "must be array", schema: schema31.properties.templated_string.type, parentSchema: schema31.properties.templated_string, data: data3 };
                vErrors.push(err22)
                errors++;
            }
        }
    }
    else {
        const err23: ErrorObject = { instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object", schema: schema31.type, parentSchema: schema31, data };
        vErrors.push(err23)
        errors++;
    }
    (validate20 as Is).errors = vErrors.length ? vErrors : null;
    return errors === 0;
}
(validate20 as Is).evaluated = { "props": true, "dynamicProps": false, "dynamicItems": false };
