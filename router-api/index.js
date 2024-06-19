import { instance, extractComponent } from "../composition/instance.js";
import { defineProperty } from "../utilities/index.js";

const routes = {};

const router = {
    currentRoute: null,
    root: '/',
    mode: '',
    push,
    replace,
    redirect,
    pop,
};
instance.router = router;

export function defineRoute(name) {
    const component = extractComponent(instance.activeComponent, instance);
    routes[name] = {
        name: name.slice(1),
        path: name,
        component: component,
        componentName: instance.activeComponent
    }
}

export function defineRouter() {
    router.mode = window.history.pushState ? 'history' : 'hash';
    return router;
}

function push(path, params) {
    return navigate(path);
}

function replace(path, params) {

}

function redirect(path, to) {

}

function pop(num) {

}

function navigate(path = '') {
    if (router.mode === 'history') {
        window.history.pushState(null, null, router.root + clearSlashes(path));
    } else {
        window.location.href = `${window.location.href.replace(/#(.*)$/, '')}#${path}`;
    }
    return router;
};

function clearSlashes(path) {
    return path
        .toString()
        .replace(/\/$/, '')
        .replace(/^\//, '');
}