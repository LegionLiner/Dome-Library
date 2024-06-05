import { instance } from "../instance.js";

const hooks = {
    onMounted: {},
    onUnmounted: {},
    onCreated: {},
};

export function onMounted(method) {
    if (instance.activeComponent) {
        if (hooks.onMounted[instance.activeComponent]) {
            return hooks.onMounted[instance.activeComponent].push(method);
        }
        return hooks.onMounted[instance.activeComponent] = [method];
    }
    if (hooks.onMounted.instance) {
        return hooks.onMounted.instance.push(method);
    }
    return hooks.onMounted.instance = [method];
}

export function onUnmounted(method) {
    hooks.onUnmounted.push(method);
}

export function onCreated(method) {
    if (instance.activeComponent) {
        if (hooks.onCreated[instance.activeComponent]) {
            return hooks.onCreated[instance.activeComponent].push(method);
        }
        return hooks.onCreated[instance.activeComponent] = [method];
    }
    if (hooks.onCreated.instance) {
        return hooks.onCreated.instance.push(method);
    }
    return hooks.onCreated.instance = [method];
}

export function useMounted(name) {
    if (!name.startsWith('d-')) {
        hooks.onMounted.instance?.forEach(method => method());
    } else {
        hooks.onMounted[name]?.forEach(method => method());
    }
}
export function useUnmounted(name) {
    if (!name.startsWith('d-')) {
        hooks.onUnmounted.instance?.forEach(method => method());
    } else {
        hooks.onUnmounted[name]?.forEach(method => method());
    }
}
export function useCreated(name) {
    if (!name.startsWith('d-')) {
        hooks.onCreated.instance?.forEach(method => method());
    } else {
        hooks.onCreated[name]?.forEach(method => method());
    }
}