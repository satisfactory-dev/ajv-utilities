import type { ErrorObject, ValidateFunction } from 'ajv';
import type { Is } from '@satisfactory-dev/ajv-utilities';
import type { enum_string } from './types.ts';
function ajv_utilities__is_probably_object(maybe: unknown): maybe is Record<string, unknown> { return !!maybe && typeof maybe === "object" && !Array.isArray(maybe); }
function ajv_utilities__is_probably_array(maybe: unknown): maybe is unknown[] { return Array.isArray(maybe); }
import ucs2length from 'ajv/dist/runtime/ucs2length.js';
export const foo = validate20;
const schema31 = { "$schema": "https://json-schema.org/draft/2020-12/schema", "$id": "docs.json.ts--lib--PropertySchemaToRegex--EnumString", "type": "object", "additionalProperties": false, "required": ["type", "enum"] as const, "properties": { "type": { "type": "string", "const": "string" }, "enum": { "type": "array", "minItems": 2, "uniqueItems": true, "items": { "type": "string", "minLength": 1 } } } };
const func1 = ucs2length;
function validate20(data: unknown, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} }: Partial<Parameters<ValidateFunction>[1] & {
    rootData: unknown;
}> = {}): data is enum_string {
    /*# sourceURL="docs.json.ts--lib--PropertySchemaToRegex--EnumString" */ ;
    let vErrors: ErrorObject[] = [];
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
            const err0: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "type" }, message: "must have required property '" + "type" + "'" };
            vErrors.push(err0)
            errors++;
        }
        if (data.enum === undefined) {
            const err1: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "enum" }, message: "must have required property '" + "enum" + "'" };
            vErrors.push(err1)
            errors++;
        }
        for (const key0 in data) {
            if (!((key0 === "type") || (key0 === "enum"))) {
                const err2: ErrorObject = { instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" };
                vErrors.push(err2)
                errors++;
            }
        }
        if (data.type !== undefined) {
            let data0 = data.type;
            if (typeof data0 !== "string") {
                const err3: ErrorObject = { instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                vErrors.push(err3)
                errors++;
            }
            if ("string" !== data0) {
                const err4: ErrorObject = { instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "string" }, message: "must be equal to constant" };
                vErrors.push(err4)
                errors++;
            }
        }
        if (data.enum !== undefined) {
            let data1 = data.enum;
            if (ajv_utilities__is_probably_array(data1)) {
                if (data1.length < 2) {
                    const err5: ErrorObject = { instancePath: instancePath + "/enum", schemaPath: "#/properties/enum/minItems", keyword: "minItems", params: { limit: 2 }, message: "must NOT have fewer than 2 items" };
                    vErrors.push(err5)
                    errors++;
                }
                const len0 = data1.length;
                for (let i0 = 0; i0 < len0; i0++) {
                    let data2 = data1[i0];
                    if (typeof data2 === "string") {
                        if (func1(data2) < 1) {
                            const err6: ErrorObject = { instancePath: instancePath + "/enum/" + i0, schemaPath: "#/properties/enum/items/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                            vErrors.push(err6)
                            errors++;
                        }
                    }
                    else {
                        const err7: ErrorObject = { instancePath: instancePath + "/enum/" + i0, schemaPath: "#/properties/enum/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        vErrors.push(err7)
                        errors++;
                    }
                }
                let i1 = data1.length;
                let j0;
                if (i1 > 1) {
                    const indices0: {
                        [key: string]: number;
                    } = {};
                    for (; i1--;) {
                        let item0 = data1[i1];
                        if (typeof item0 !== "string") {
                            continue;
                        }
                        if (typeof indices0[item0] == "number") {
                            j0 = indices0[item0];
                            const err8: ErrorObject = { instancePath: instancePath + "/enum", schemaPath: "#/properties/enum/uniqueItems", keyword: "uniqueItems", params: { i: i1, j: j0 }, message: "must NOT have duplicate items (items ## " + j0 + " and " + i1 + " are identical)" };
                            vErrors.push(err8)
                            errors++;
                            break;
                        }
                        indices0[item0] = i1;
                    }
                }
            }
            else {
                const err9: ErrorObject = { instancePath: instancePath + "/enum", schemaPath: "#/properties/enum/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                vErrors.push(err9)
                errors++;
            }
        }
    }
    else {
        const err10: ErrorObject = { instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" };
        vErrors.push(err10)
        errors++;
    }
    (validate20 as Is).errors = vErrors.length ? vErrors : null;
    return errors === 0;
}
validate20.evaluated = { "props": true, "dynamicProps": false, "dynamicItems": false } as Is["evaluated"];
