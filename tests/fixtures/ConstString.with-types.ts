import type { ErrorObject, ValidateFunction } from 'ajv';
import type { Is } from '@satisfactory-dev/ajv-utilities';
import type { const_string } from './types.ts';
function ajv_utilities__is_probably_object(maybe: unknown): maybe is Record<string, unknown> { return !!maybe && typeof maybe === "object" && !Array.isArray(maybe); }
export const foo = validate20;
const schema31 = { "$schema": "https://json-schema.org/draft/2020-12/schema", "$id": "docs.json.ts--lib--PropertySchemaToRegex--ConstString", "type": "object", "additionalProperties": false, "required": ["type", "const"] as const, "properties": { "type": { "type": "string", "const": "string" }, "const": { "type": "string" } } };
function validate20(data: unknown, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} }: Partial<Parameters<ValidateFunction>[1] & {
    rootData: unknown;
}> = {}): data is const_string {
    /*# sourceURL="docs.json.ts--lib--PropertySchemaToRegex--ConstString" */ ;
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
        if (data.const === undefined) {
            const err1: ErrorObject = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "const" }, message: "must have required property '" + "const" + "'" };
            vErrors.push(err1)
            errors++;
        }
        for (const key0 in data) {
            if (!((key0 === "type") || (key0 === "const"))) {
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
        if (data.const !== undefined) {
            if (typeof data.const !== "string") {
                const err5: ErrorObject = { instancePath: instancePath + "/const", schemaPath: "#/properties/const/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                vErrors.push(err5)
                errors++;
            }
        }
    }
    else {
        const err6: ErrorObject = { instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" };
        vErrors.push(err6)
        errors++;
    }
    (validate20 as Is).errors = vErrors.length ? vErrors : null;
    return errors === 0;
}
validate20.evaluated = { "props": true, "dynamicProps": false, "dynamicItems": false } as Is["evaluated"];
