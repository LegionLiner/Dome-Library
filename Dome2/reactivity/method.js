import { addMethod, instance } from "../composition/instance.js";

export function method(name, method) {
    addMethod(name, method, instance.activeComponent);
    return method;
};