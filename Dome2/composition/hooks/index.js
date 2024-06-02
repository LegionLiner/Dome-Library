const hooks = {
    onMounted: [],
    onUnmounted: [],
    onCreated: [],
};

export function onMounted(method) {
    hooks.onMounted.push(method);
}

export function onUnmounted(method) {
    hooks.onUnmounted.push(method);
}

export function onCreated(method) {
    hooks.onCreated.push(method);
}

export function useMounted() {
    hooks.onMounted.forEach(method => method());
}
export function useUnmounted() {
    hooks.onUnmounted.forEach(method => method());
}
export function useCreated() {
    hooks.onCreated.forEach(method => method());
}