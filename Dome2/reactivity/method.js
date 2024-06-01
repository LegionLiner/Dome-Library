import { addMethod } from "../composition/instance.js";

export const isMethod = Symbol('MethodType');

export function method(name, method) {
    addMethod(name, method);
    return method;
};