import type { ErrorObject, ValidateFunction } from 'ajv';
import type { Bar, Foo } from '@satisfactory-dev/docs.json.ts';
import ucs2length from 'ajv/dist/runtime/ucs2length.js';
export const validate_as_ConstString = validate20;
const schema31 = { "$schema": "https://json-schema.org/draft/2020-12/schema", "$id": "docs.json.ts--lib--PropertySchemaToRegex--ConstString", "type": "object", "additionalProperties": false, "required": ["type", "const"], "properties": { "type": { "type": "string", "const": "string" }, "const": { "type": "string" } } };
function validate20(data: unknown, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} }: Partial<Parameters<ValidateFunction>[1] & {
    rootData: unknown;
}> = {}): data is Foo {
    /*# sourceURL="docs.json.ts--lib--PropertySchemaToRegex--ConstString" */ ;
    let vErrors: ErrorObject[] | null = null;
    let errors = 0;
    const evaluated0 = validate20.evaluated;
    if (evaluated0?.dynamicProps) {
        evaluated0.props = undefined;
    }
    if (evaluated0?.dynamicItems) {
        evaluated0.items = undefined;
    }
    if (data && typeof data == "object" && !Array.isArray(data)) {
        if (data.type === undefined) {
            const err0: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "type" }, message: "must have required property '" + "type" + "'" };
            if (vErrors === null) {
                vErrors = [err0];
            }
            else {
                (vErrors as ErrorObject[]).push(err0);
            }
            errors++;
        }
        if (data.const === undefined) {
            const err1: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "const" }, message: "must have required property '" + "const" + "'" };
            if (vErrors === null) {
                vErrors = [err1];
            }
            else {
                (vErrors as ErrorObject[]).push(err1);
            }
            errors++;
        }
        for (const key0 in data) {
            if (!((key0 === "type") || (key0 === "const"))) {
                const err2: ErrorObject = { instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" };
                if (vErrors === null) {
                    vErrors = [err2];
                }
                else {
                    (vErrors as ErrorObject[]).push(err2);
                }
                errors++;
            }
        }
        if (data.type !== undefined) {
            let data0 = data.type;
            if (typeof data0 !== "string") {
                const err3: ErrorObject = { instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                if (vErrors === null) {
                    vErrors = [err3];
                }
                else {
                    (vErrors as ErrorObject[]).push(err3);
                }
                errors++;
            }
            if ("string" !== data0) {
                const err4: ErrorObject = { instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "string" }, message: "must be equal to constant" };
                if (vErrors === null) {
                    vErrors = [err4];
                }
                else {
                    (vErrors as ErrorObject[]).push(err4);
                }
                errors++;
            }
        }
        if (data.const !== undefined) {
            if (typeof data.const !== "string") {
                const err5: ErrorObject = { instancePath: instancePath + "/const", schemaPath: "#/properties/const/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                if (vErrors === null) {
                    vErrors = [err5];
                }
                else {
                    (vErrors as ErrorObject[]).push(err5);
                }
                errors++;
            }
        }
    }
    else {
        const err6: ErrorObject = { instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" };
        if (vErrors === null) {
            vErrors = [err6];
        }
        else {
            (vErrors as ErrorObject[]).push(err6);
        }
        errors++;
    }
    (validate20 as ValidateFunction).errors = vErrors;
    return errors === 0;
}
validate20.evaluated = { "props": true, "dynamicProps": false, "dynamicItems": false } as ValidateFunction["evaluated"];
export const validate_as_EnumString = validate21;
const schema32 = { "$schema": "https://json-schema.org/draft/2020-12/schema", "$id": "docs.json.ts--lib--PropertySchemaToRegex--EnumString", "type": "object", "additionalProperties": false, "required": ["type", "enum"], "properties": { "type": { "type": "string", "const": "string" }, "enum": { "type": "array", "minItems": 2, "uniqueItems": true, "items": { "type": "string", "minLength": 1 } } } };
const func1 = ucs2length;
function validate21(data: unknown, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} }: Partial<Parameters<ValidateFunction>[1] & {
    rootData: unknown;
}> = {}): data is Bar {
    /*# sourceURL="docs.json.ts--lib--PropertySchemaToRegex--EnumString" */ ;
    let vErrors: ErrorObject[] | null = null;
    let errors = 0;
    const evaluated0 = validate21.evaluated;
    if (evaluated0?.dynamicProps) {
        evaluated0.props = undefined;
    }
    if (evaluated0?.dynamicItems) {
        evaluated0.items = undefined;
    }
    if (data && typeof data == "object" && !Array.isArray(data)) {
        if (data.type === undefined) {
            const err0: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "type" }, message: "must have required property '" + "type" + "'" };
            if (vErrors === null) {
                vErrors = [err0];
            }
            else {
                (vErrors as ErrorObject[]).push(err0);
            }
            errors++;
        }
        if (data.enum === undefined) {
            const err1: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "enum" }, message: "must have required property '" + "enum" + "'" };
            if (vErrors === null) {
                vErrors = [err1];
            }
            else {
                (vErrors as ErrorObject[]).push(err1);
            }
            errors++;
        }
        for (const key0 in data) {
            if (!((key0 === "type") || (key0 === "enum"))) {
                const err2: ErrorObject = { instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" };
                if (vErrors === null) {
                    vErrors = [err2];
                }
                else {
                    (vErrors as ErrorObject[]).push(err2);
                }
                errors++;
            }
        }
        if (data.type !== undefined) {
            let data0 = data.type;
            if (typeof data0 !== "string") {
                const err3: ErrorObject = { instancePath: instancePath + "/type", schemaPath: "#/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                if (vErrors === null) {
                    vErrors = [err3];
                }
                else {
                    (vErrors as ErrorObject[]).push(err3);
                }
                errors++;
            }
            if ("string" !== data0) {
                const err4: ErrorObject = { instancePath: instancePath + "/type", schemaPath: "#/properties/type/const", keyword: "const", params: { allowedValue: "string" }, message: "must be equal to constant" };
                if (vErrors === null) {
                    vErrors = [err4];
                }
                else {
                    (vErrors as ErrorObject[]).push(err4);
                }
                errors++;
            }
        }
        if (data.enum !== undefined) {
            let data1 = data.enum;
            if (Array.isArray(data1)) {
                if (data1.length < 2) {
                    const err5: ErrorObject = { instancePath: instancePath + "/enum", schemaPath: "#/properties/enum/minItems", keyword: "minItems", params: { limit: 2 }, message: "must NOT have fewer than 2 items" };
                    if (vErrors === null) {
                        vErrors = [err5];
                    }
                    else {
                        (vErrors as ErrorObject[]).push(err5);
                    }
                    errors++;
                }
                const len0 = data1.length;
                for (let i0 = 0; i0 < len0; i0++) {
                    let data2 = data1[i0];
                    if (typeof data2 === "string") {
                        if (func1(data2) < 1) {
                            const err6: ErrorObject = { instancePath: instancePath + "/enum/" + i0, schemaPath: "#/properties/enum/items/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                            if (vErrors === null) {
                                vErrors = [err6];
                            }
                            else {
                                (vErrors as ErrorObject[]).push(err6);
                            }
                            errors++;
                        }
                    }
                    else {
                        const err7: ErrorObject = { instancePath: instancePath + "/enum/" + i0, schemaPath: "#/properties/enum/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                            vErrors = [err7];
                        }
                        else {
                            (vErrors as ErrorObject[]).push(err7);
                        }
                        errors++;
                    }
                }
                let i1 = data1.length;
                let j0;
                if (i1 > 1) {
                    const indices0 = {};
                    for (; i1--;) {
                        let item0 = data1[i1];
                        if (typeof item0 !== "string") {
                            continue;
                        }
                        if (typeof indices0[item0] == "number") {
                            j0 = indices0[item0];
                            const err8: ErrorObject = { instancePath: instancePath + "/enum", schemaPath: "#/properties/enum/uniqueItems", keyword: "uniqueItems", params: { i: i1, j: j0 }, message: "must NOT have duplicate items (items ## " + j0 + " and " + i1 + " are identical)" };
                            if (vErrors === null) {
                                vErrors = [err8];
                            }
                            else {
                                (vErrors as ErrorObject[]).push(err8);
                            }
                            errors++;
                            break;
                        }
                        indices0[item0] = i1;
                    }
                }
            }
            else {
                const err9: ErrorObject = { instancePath: instancePath + "/enum", schemaPath: "#/properties/enum/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                if (vErrors === null) {
                    vErrors = [err9];
                }
                else {
                    (vErrors as ErrorObject[]).push(err9);
                }
                errors++;
            }
        }
    }
    else {
        const err10: ErrorObject = { instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" };
        if (vErrors === null) {
            vErrors = [err10];
        }
        else {
            (vErrors as ErrorObject[]).push(err10);
        }
        errors++;
    }
    (validate21 as ValidateFunction).errors = vErrors;
    return errors === 0;
}
validate21.evaluated = { "props": true, "dynamicProps": false, "dynamicItems": false } as ValidateFunction["evaluated"];
