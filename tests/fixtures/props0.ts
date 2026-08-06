import type { ErrorObject } from 'ajv';
import type { EvaluatedProperties } from 'ajv/dist/types/index.js';
import type { IsStandalone, StandaloneDataValidationCxt } from '@satisfactory-dev/ajv-utilities';
import type { props0, props0 as foobar } from './types.ts';
type ajv_EvaluatedProperties<T extends {
    [key: string]: unknown;
}> = {
    [k in keyof T]: true;
};
function ajv_utilities__is_definitely_not_true<T>(maybe: unknown): maybe is Exclude<T, true> { return maybe !== true; }
function ajv_utiltiies__definitely_evaluated<T>(maybe: IsStandalone<T>): Exclude<IsStandalone<T>["evaluated"], undefined> { if (undefined === maybe.evaluated)
    throw new Error(`${maybe.name}.evaluated not set!`); return maybe.evaluated; }
function ajv_utilities__is_probably_object(maybe: unknown): maybe is Record<string, unknown> { return !!maybe && typeof maybe === "object" && !Array.isArray(maybe); }
export const props0_checker = validate20;
const schema31 = { "$schema": "https://json-schema.org/draft/2020-12/schema", "$id": "props0--checker", "allOf": [{ "$ref": "props0--checker--foobar" }, { "$ref": "props0--checker--bazbat" }, { "type": "object", "required": ["nested"] as const, "properties": { "nested": { "type": "object", "required": ["ohhai"] as const, "properties": { "ohhai": { "type": "string", "const": "there" } } } } }] as const };
const schema32 = { "$schema": "https://json-schema.org/draft/2020-12/schema", "$id": "props0--checker--foobar", "oneOf": [{ "type": "object", "required": ["foo", "bar"] as const, "properties": { "foo": { "type": "string", "pattern": "^foo\\d+$" }, "bar": { "type": "string", "pattern": "^bar\\d+$" } } }, { "type": "object", "required": ["foo", "bar"] as const, "properties": { "foo": { "type": "string", "pattern": "^foo\\d+$" }, "bar": { "type": "string", "const": "" } } }, { "type": "object", "required": ["foo", "bar"] as const, "properties": { "foo": { "type": "string", "const": "" }, "bar": { "type": "string", "const": "" } } }] as const };
const schema33 = { "$schema": "https://json-schema.org/draft/2020-12/schema", "$id": "props0--checker--bazbat", "type": "object", "required": ["baz", "bat"] as const, "properties": { "baz": { "type": "string", "pattern": "^baz\\d+$" }, "bat": { "type": "string", "pattern": "^bat\\d+$" } } };
const pattern4 = new RegExp("^foo\\d+$", "u");
const pattern5 = new RegExp("^bar\\d+$", "u");
const pattern7 = new RegExp("^baz\\d+$", "u");
const pattern8 = new RegExp("^bat\\d+$", "u");
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
    const _errs2 = errors;
    let valid2 = false;
    let passing0 = null;
    const _errs3 = errors;
    if (ajv_utilities__is_probably_object(data)) {
        if (data.foo === undefined) {
            const err0: ErrorObject = { instancePath, schemaPath: "props0--checker--foobar/oneOf/0/required", keyword: "required", params: { missingProperty: "foo" }, message: "must have required property '" + "foo" + "'" };
            vErrors.push(err0)
            errors++;
        }
        if (data.bar === undefined) {
            const err1: ErrorObject = { instancePath, schemaPath: "props0--checker--foobar/oneOf/0/required", keyword: "required", params: { missingProperty: "bar" }, message: "must have required property '" + "bar" + "'" };
            vErrors.push(err1)
            errors++;
        }
        if (data.foo !== undefined) {
            let data0 = data.foo;
            if (typeof data0 === "string") {
                if (!pattern4.test(data0)) {
                    const err2: ErrorObject = { instancePath: instancePath + "/foo", schemaPath: "props0--checker--foobar/oneOf/0/properties/foo/pattern", keyword: "pattern", params: { pattern: "^foo\\d+$" }, message: "must match pattern \"" + "^foo\\d+$" + "\"" };
                    vErrors.push(err2)
                    errors++;
                }
            }
            else {
                const err3: ErrorObject = { instancePath: instancePath + "/foo", schemaPath: "props0--checker--foobar/oneOf/0/properties/foo/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                vErrors.push(err3)
                errors++;
            }
        }
        if (data.bar !== undefined) {
            let data1 = data.bar;
            if (typeof data1 === "string") {
                if (!pattern5.test(data1)) {
                    const err4: ErrorObject = { instancePath: instancePath + "/bar", schemaPath: "props0--checker--foobar/oneOf/0/properties/bar/pattern", keyword: "pattern", params: { pattern: "^bar\\d+$" }, message: "must match pattern \"" + "^bar\\d+$" + "\"" };
                    vErrors.push(err4)
                    errors++;
                }
            }
            else {
                const err5: ErrorObject = { instancePath: instancePath + "/bar", schemaPath: "props0--checker--foobar/oneOf/0/properties/bar/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                vErrors.push(err5)
                errors++;
            }
        }
    }
    else {
        const err6: ErrorObject = { instancePath, schemaPath: "props0--checker--foobar/oneOf/0/type", keyword: "type", params: { type: "object" }, message: "must be object" };
        vErrors.push(err6)
        errors++;
    }
    var _valid0 = _errs3 === errors;
    if (_valid0) {
        valid2 = true;
        passing0 = 0;
        props0 = {};
        (props0 as ajv_EvaluatedProperties<foobar>).foo = true;
        (props0 as ajv_EvaluatedProperties<foobar>).bar = true;
    }
    const _errs9 = errors;
    if (ajv_utilities__is_probably_object(data)) {
        if (data.foo === undefined) {
            const err7: ErrorObject = { instancePath, schemaPath: "props0--checker--foobar/oneOf/1/required", keyword: "required", params: { missingProperty: "foo" }, message: "must have required property '" + "foo" + "'" };
            vErrors.push(err7)
            errors++;
        }
        if (data.bar === undefined) {
            const err8: ErrorObject = { instancePath, schemaPath: "props0--checker--foobar/oneOf/1/required", keyword: "required", params: { missingProperty: "bar" }, message: "must have required property '" + "bar" + "'" };
            vErrors.push(err8)
            errors++;
        }
        if (data.foo !== undefined) {
            let data2 = data.foo;
            if (typeof data2 === "string") {
                if (!pattern4.test(data2)) {
                    const err9: ErrorObject = { instancePath: instancePath + "/foo", schemaPath: "props0--checker--foobar/oneOf/1/properties/foo/pattern", keyword: "pattern", params: { pattern: "^foo\\d+$" }, message: "must match pattern \"" + "^foo\\d+$" + "\"" };
                    vErrors.push(err9)
                    errors++;
                }
            }
            else {
                const err10: ErrorObject = { instancePath: instancePath + "/foo", schemaPath: "props0--checker--foobar/oneOf/1/properties/foo/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                vErrors.push(err10)
                errors++;
            }
        }
        if (data.bar !== undefined) {
            let data3 = data.bar;
            if (typeof data3 !== "string") {
                const err11: ErrorObject = { instancePath: instancePath + "/bar", schemaPath: "props0--checker--foobar/oneOf/1/properties/bar/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                vErrors.push(err11)
                errors++;
            }
            if ("" !== data3) {
                const err12: ErrorObject = { instancePath: instancePath + "/bar", schemaPath: "props0--checker--foobar/oneOf/1/properties/bar/const", keyword: "const", params: { allowedValue: "" }, message: "must be equal to constant" };
                vErrors.push(err12)
                errors++;
            }
        }
    }
    else {
        const err13: ErrorObject = { instancePath, schemaPath: "props0--checker--foobar/oneOf/1/type", keyword: "type", params: { type: "object" }, message: "must be object" };
        vErrors.push(err13)
        errors++;
    }
    var _valid0 = _errs9 === errors;
    if (_valid0 && valid2) {
        valid2 = false;
        passing0 = [passing0, 1];
    }
    else {
        if (_valid0) {
            valid2 = true;
            passing0 = 1;
            if (ajv_utilities__is_definitely_not_true(props0)) {
                props0 = props0 || {};
                (props0 as ajv_EvaluatedProperties<foobar>).foo = true;
                (props0 as ajv_EvaluatedProperties<foobar>).bar = true;
            }
        }
        const _errs15 = errors;
        if (ajv_utilities__is_probably_object(data)) {
            if (data.foo === undefined) {
                const err14: ErrorObject = { instancePath, schemaPath: "props0--checker--foobar/oneOf/2/required", keyword: "required", params: { missingProperty: "foo" }, message: "must have required property '" + "foo" + "'" };
                vErrors.push(err14)
                errors++;
            }
            if (data.bar === undefined) {
                const err15: ErrorObject = { instancePath, schemaPath: "props0--checker--foobar/oneOf/2/required", keyword: "required", params: { missingProperty: "bar" }, message: "must have required property '" + "bar" + "'" };
                vErrors.push(err15)
                errors++;
            }
            if (data.foo !== undefined) {
                let data4 = data.foo;
                if (typeof data4 !== "string") {
                    const err16: ErrorObject = { instancePath: instancePath + "/foo", schemaPath: "props0--checker--foobar/oneOf/2/properties/foo/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                    vErrors.push(err16)
                    errors++;
                }
                if ("" !== data4) {
                    const err17: ErrorObject = { instancePath: instancePath + "/foo", schemaPath: "props0--checker--foobar/oneOf/2/properties/foo/const", keyword: "const", params: { allowedValue: "" }, message: "must be equal to constant" };
                    vErrors.push(err17)
                    errors++;
                }
            }
            if (data.bar !== undefined) {
                let data5 = data.bar;
                if (typeof data5 !== "string") {
                    const err18: ErrorObject = { instancePath: instancePath + "/bar", schemaPath: "props0--checker--foobar/oneOf/2/properties/bar/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                    vErrors.push(err18)
                    errors++;
                }
                if ("" !== data5) {
                    const err19: ErrorObject = { instancePath: instancePath + "/bar", schemaPath: "props0--checker--foobar/oneOf/2/properties/bar/const", keyword: "const", params: { allowedValue: "" }, message: "must be equal to constant" };
                    vErrors.push(err19)
                    errors++;
                }
            }
        }
        else {
            const err20: ErrorObject = { instancePath, schemaPath: "props0--checker--foobar/oneOf/2/type", keyword: "type", params: { type: "object" }, message: "must be object" };
            vErrors.push(err20)
            errors++;
        }
        var _valid0 = _errs15 === errors;
        if (_valid0 && valid2) {
            valid2 = false;
            passing0 = [passing0, 2];
        }
        else {
            if (_valid0) {
                valid2 = true;
                passing0 = 2;
                if (ajv_utilities__is_definitely_not_true(props0)) {
                    props0 = props0 || {};
                    (props0 as ajv_EvaluatedProperties<foobar>).foo = true;
                    (props0 as ajv_EvaluatedProperties<foobar>).bar = true;
                }
            }
        }
    }
    if (!valid2) {
        const err21: ErrorObject = { instancePath, schemaPath: "props0--checker--foobar/oneOf", keyword: "oneOf", params: { passingSchemas: passing0 }, message: "must match exactly one schema in oneOf" };
        vErrors.push(err21)
        errors++;
    }
    else {
        errors = _errs2;
        if (vErrors.length) {
            if (_errs2) {
                vErrors.length = _errs2;
            }
            else {
                vErrors = [];
            }
        }
    }
    if (ajv_utilities__is_probably_object(data)) {
        if (data.baz === undefined) {
            const err22: ErrorObject = { instancePath, schemaPath: "props0--checker--bazbat/required", keyword: "required", params: { missingProperty: "baz" }, message: "must have required property '" + "baz" + "'" };
            vErrors.push(err22)
            errors++;
        }
        if (data.bat === undefined) {
            const err23: ErrorObject = { instancePath, schemaPath: "props0--checker--bazbat/required", keyword: "required", params: { missingProperty: "bat" }, message: "must have required property '" + "bat" + "'" };
            vErrors.push(err23)
            errors++;
        }
        if (data.baz !== undefined) {
            let data6 = data.baz;
            if (typeof data6 === "string") {
                if (!pattern7.test(data6)) {
                    const err24: ErrorObject = { instancePath: instancePath + "/baz", schemaPath: "props0--checker--bazbat/properties/baz/pattern", keyword: "pattern", params: { pattern: "^baz\\d+$" }, message: "must match pattern \"" + "^baz\\d+$" + "\"" };
                    vErrors.push(err24)
                    errors++;
                }
            }
            else {
                const err25: ErrorObject = { instancePath: instancePath + "/baz", schemaPath: "props0--checker--bazbat/properties/baz/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                vErrors.push(err25)
                errors++;
            }
        }
        if (data.bat !== undefined) {
            let data7 = data.bat;
            if (typeof data7 === "string") {
                if (!pattern8.test(data7)) {
                    const err26: ErrorObject = { instancePath: instancePath + "/bat", schemaPath: "props0--checker--bazbat/properties/bat/pattern", keyword: "pattern", params: { pattern: "^bat\\d+$" }, message: "must match pattern \"" + "^bat\\d+$" + "\"" };
                    vErrors.push(err26)
                    errors++;
                }
            }
            else {
                const err27: ErrorObject = { instancePath: instancePath + "/bat", schemaPath: "props0--checker--bazbat/properties/bat/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                vErrors.push(err27)
                errors++;
            }
        }
    }
    else {
        const err28: ErrorObject = { instancePath, schemaPath: "props0--checker--bazbat/type", keyword: "type", params: { type: "object" }, message: "must be object" };
        vErrors.push(err28)
        errors++;
    }
    if (ajv_utilities__is_definitely_not_true(props0)) {
        props0 = props0 || {};
        props0.baz = true;
        props0.bat = true;
    }
    if (ajv_utilities__is_probably_object(data)) {
        if (data.nested === undefined) {
            const err29: ErrorObject = { instancePath, schemaPath: "#/allOf/2/required", keyword: "required", params: { missingProperty: "nested" }, message: "must have required property '" + "nested" + "'" };
            vErrors.push(err29)
            errors++;
        }
        if (data.nested !== undefined) {
            let data8 = data.nested;
            if (ajv_utilities__is_probably_object(data8)) {
                if (data8.ohhai === undefined) {
                    const err30: ErrorObject = { instancePath: instancePath + "/nested", schemaPath: "#/allOf/2/properties/nested/required", keyword: "required", params: { missingProperty: "ohhai" }, message: "must have required property '" + "ohhai" + "'" };
                    vErrors.push(err30)
                    errors++;
                }
                if (data8.ohhai !== undefined) {
                    let data9 = data8.ohhai;
                    if (typeof data9 !== "string") {
                        const err31: ErrorObject = { instancePath: instancePath + "/nested/ohhai", schemaPath: "#/allOf/2/properties/nested/properties/ohhai/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        vErrors.push(err31)
                        errors++;
                    }
                    if ("there" !== data9) {
                        const err32: ErrorObject = { instancePath: instancePath + "/nested/ohhai", schemaPath: "#/allOf/2/properties/nested/properties/ohhai/const", keyword: "const", params: { allowedValue: "there" }, message: "must be equal to constant" };
                        vErrors.push(err32)
                        errors++;
                    }
                }
            }
            else {
                const err33: ErrorObject = { instancePath: instancePath + "/nested", schemaPath: "#/allOf/2/properties/nested/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                vErrors.push(err33)
                errors++;
            }
        }
    }
    else {
        const err34: ErrorObject = { instancePath, schemaPath: "#/allOf/2/type", keyword: "type", params: { type: "object" }, message: "must be object" };
        vErrors.push(err34)
        errors++;
    }
    if (ajv_utilities__is_definitely_not_true(props0)) {
        props0 = props0 || {};
        props0.nested = true;
    }
    (validate20 as IsStandalone).errors = vErrors.length ? vErrors : null;
    evaluated0.props = props0;
    return errors === 0;
}
(validate20 as IsStandalone).evaluated = { "dynamicProps": true, "dynamicItems": false };
