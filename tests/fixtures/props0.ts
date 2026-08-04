import type { ErrorObject } from 'ajv';
import type { EvaluatedProperties } from 'ajv/dist/types/index.js';
import type { IsStandalone, StandaloneDataValidationCxt } from '@satisfactory-dev/ajv-utilities';
import type { props0 } from './types.ts';
function ajv_utilities__is_definitely_not_true<T>(maybe: unknown): maybe is Exclude<T, true> { return maybe !== true; }
function ajv_utiltiies__definitely_evaluated<T>(maybe: IsStandalone<T>): Exclude<IsStandalone<T>["evaluated"], undefined> { if (undefined === maybe.evaluated)
    throw new Error(`${maybe.name}.evaluated not set!`); return maybe.evaluated; }
function ajv_utilities__is_probably_object(maybe: unknown): maybe is Record<string, unknown> { return !!maybe && typeof maybe === "object" && !Array.isArray(maybe); }
export const props0_checker = validate20;
const schema31 = { "$schema": "https://json-schema.org/draft/2020-12/schema", "$id": "props0--checker", "oneOf": [{ "type": "object", "required": ["foo", "bar"] as const, "properties": { "foo": { "type": "string", "pattern": "^foo\\d+$" }, "bar": { "type": "string", "pattern": "^bar\\d+$" } } }, { "type": "object", "required": ["foo", "bar"] as const, "properties": { "foo": { "type": "string", "pattern": "^foo\\d+$" }, "bar": { "type": "string", "const": "" } } }, { "type": "object", "required": ["foo", "bar"] as const, "properties": { "foo": { "type": "string", "const": "" }, "bar": { "type": "string", "const": "" } } }] as const };
const pattern4 = new RegExp("^foo\\d+$", "u");
const pattern5 = new RegExp("^bar\\d+$", "u");
function validate20(data: unknown, { instancePath = "", parentData, parentDataProperty, rootData = data, dynamicAnchors = {} }: Partial<StandaloneDataValidationCxt> = {}): data is props0 {
    let props0: (EvaluatedProperties | undefined) = undefined;
    /*# sourceURL="props0--checker" */ ;
    let vErrors: ErrorObject[] = [];
    let errors = 0;
    const evaluated0 = ajv_utiltiies__definitely_evaluated(validate20);
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
    if (ajv_utilities__is_probably_object(data)) {
        if (data.foo === undefined) {
            const err0: ErrorObject = { instancePath, schemaPath: "#/oneOf/0/required", keyword: "required", params: { missingProperty: "foo" }, message: "must have required property '" + "foo" + "'" };
            vErrors.push(err0)
            errors++;
        }
        if (data.bar === undefined) {
            const err1: ErrorObject = { instancePath, schemaPath: "#/oneOf/0/required", keyword: "required", params: { missingProperty: "bar" }, message: "must have required property '" + "bar" + "'" };
            vErrors.push(err1)
            errors++;
        }
        if (data.foo !== undefined) {
            let data0 = data.foo;
            if (typeof data0 === "string") {
                if (!pattern4.test(data0)) {
                    const err2: ErrorObject = { instancePath: instancePath + "/foo", schemaPath: "#/oneOf/0/properties/foo/pattern", keyword: "pattern", params: { pattern: "^foo\\d+$" }, message: "must match pattern \"" + "^foo\\d+$" + "\"" };
                    vErrors.push(err2)
                    errors++;
                }
            }
            else {
                const err3: ErrorObject = { instancePath: instancePath + "/foo", schemaPath: "#/oneOf/0/properties/foo/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                vErrors.push(err3)
                errors++;
            }
        }
        if (data.bar !== undefined) {
            let data1 = data.bar;
            if (typeof data1 === "string") {
                if (!pattern5.test(data1)) {
                    const err4: ErrorObject = { instancePath: instancePath + "/bar", schemaPath: "#/oneOf/0/properties/bar/pattern", keyword: "pattern", params: { pattern: "^bar\\d+$" }, message: "must match pattern \"" + "^bar\\d+$" + "\"" };
                    vErrors.push(err4)
                    errors++;
                }
            }
            else {
                const err5: ErrorObject = { instancePath: instancePath + "/bar", schemaPath: "#/oneOf/0/properties/bar/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                vErrors.push(err5)
                errors++;
            }
        }
    }
    else {
        const err6: ErrorObject = { instancePath, schemaPath: "#/oneOf/0/type", keyword: "type", params: { type: "object" }, message: "must be object" };
        vErrors.push(err6)
        errors++;
    }
    var _valid0 = _errs1 === errors;
    if (_valid0) {
        valid0 = true;
        passing0 = 0;
        props0 = {};
        props0.foo = true;
        props0.bar = true;
    }
    const _errs7 = errors;
    if (ajv_utilities__is_probably_object(data)) {
        if (data.foo === undefined) {
            const err7: ErrorObject = { instancePath, schemaPath: "#/oneOf/1/required", keyword: "required", params: { missingProperty: "foo" }, message: "must have required property '" + "foo" + "'" };
            vErrors.push(err7)
            errors++;
        }
        if (data.bar === undefined) {
            const err8: ErrorObject = { instancePath, schemaPath: "#/oneOf/1/required", keyword: "required", params: { missingProperty: "bar" }, message: "must have required property '" + "bar" + "'" };
            vErrors.push(err8)
            errors++;
        }
        if (data.foo !== undefined) {
            let data2 = data.foo;
            if (typeof data2 === "string") {
                if (!pattern4.test(data2)) {
                    const err9: ErrorObject = { instancePath: instancePath + "/foo", schemaPath: "#/oneOf/1/properties/foo/pattern", keyword: "pattern", params: { pattern: "^foo\\d+$" }, message: "must match pattern \"" + "^foo\\d+$" + "\"" };
                    vErrors.push(err9)
                    errors++;
                }
            }
            else {
                const err10: ErrorObject = { instancePath: instancePath + "/foo", schemaPath: "#/oneOf/1/properties/foo/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                vErrors.push(err10)
                errors++;
            }
        }
        if (data.bar !== undefined) {
            let data3 = data.bar;
            if (typeof data3 !== "string") {
                const err11: ErrorObject = { instancePath: instancePath + "/bar", schemaPath: "#/oneOf/1/properties/bar/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                vErrors.push(err11)
                errors++;
            }
            if ("" !== data3) {
                const err12: ErrorObject = { instancePath: instancePath + "/bar", schemaPath: "#/oneOf/1/properties/bar/const", keyword: "const", params: { allowedValue: "" }, message: "must be equal to constant" };
                vErrors.push(err12)
                errors++;
            }
        }
    }
    else {
        const err13: ErrorObject = { instancePath, schemaPath: "#/oneOf/1/type", keyword: "type", params: { type: "object" }, message: "must be object" };
        vErrors.push(err13)
        errors++;
    }
    var _valid0 = _errs7 === errors;
    if (_valid0 && valid0) {
        valid0 = false;
        passing0 = [passing0, 1];
    }
    else {
        if (_valid0) {
            valid0 = true;
            passing0 = 1;
            if (ajv_utilities__is_definitely_not_true(props0)) {
                props0 = props0 || {};
                props0.foo = true;
                props0.bar = true;
            }
        }
        const _errs13 = errors;
        if (ajv_utilities__is_probably_object(data)) {
            if (data.foo === undefined) {
                const err14: ErrorObject = { instancePath, schemaPath: "#/oneOf/2/required", keyword: "required", params: { missingProperty: "foo" }, message: "must have required property '" + "foo" + "'" };
                vErrors.push(err14)
                errors++;
            }
            if (data.bar === undefined) {
                const err15: ErrorObject = { instancePath, schemaPath: "#/oneOf/2/required", keyword: "required", params: { missingProperty: "bar" }, message: "must have required property '" + "bar" + "'" };
                vErrors.push(err15)
                errors++;
            }
            if (data.foo !== undefined) {
                let data4 = data.foo;
                if (typeof data4 !== "string") {
                    const err16: ErrorObject = { instancePath: instancePath + "/foo", schemaPath: "#/oneOf/2/properties/foo/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                    vErrors.push(err16)
                    errors++;
                }
                if ("" !== data4) {
                    const err17: ErrorObject = { instancePath: instancePath + "/foo", schemaPath: "#/oneOf/2/properties/foo/const", keyword: "const", params: { allowedValue: "" }, message: "must be equal to constant" };
                    vErrors.push(err17)
                    errors++;
                }
            }
            if (data.bar !== undefined) {
                let data5 = data.bar;
                if (typeof data5 !== "string") {
                    const err18: ErrorObject = { instancePath: instancePath + "/bar", schemaPath: "#/oneOf/2/properties/bar/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                    vErrors.push(err18)
                    errors++;
                }
                if ("" !== data5) {
                    const err19: ErrorObject = { instancePath: instancePath + "/bar", schemaPath: "#/oneOf/2/properties/bar/const", keyword: "const", params: { allowedValue: "" }, message: "must be equal to constant" };
                    vErrors.push(err19)
                    errors++;
                }
            }
        }
        else {
            const err20: ErrorObject = { instancePath, schemaPath: "#/oneOf/2/type", keyword: "type", params: { type: "object" }, message: "must be object" };
            vErrors.push(err20)
            errors++;
        }
        var _valid0 = _errs13 === errors;
        if (_valid0 && valid0) {
            valid0 = false;
            passing0 = [passing0, 2];
        }
        else {
            if (_valid0) {
                valid0 = true;
                passing0 = 2;
                if (ajv_utilities__is_definitely_not_true(props0)) {
                    props0 = props0 || {};
                    props0.foo = true;
                    props0.bar = true;
                }
            }
        }
    }
    if (!valid0) {
        const err21: ErrorObject = { instancePath, schemaPath: "#/oneOf", keyword: "oneOf", params: { passingSchemas: passing0 }, message: "must match exactly one schema in oneOf" };
        vErrors.push(err21)
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
    (validate20 as IsStandalone).errors = vErrors.length ? vErrors : null;
    evaluated0.props = props0;
    return errors === 0;
}
(validate20 as IsStandalone).evaluated = { "dynamicProps": true, "dynamicItems": false };
