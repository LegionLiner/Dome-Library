import { instance } from "../composition/instance.js";
import { parseDOM } from "../parse-dom/parser.js";

// Маршруты регистрируются ДО mount() через defineRouter({ routes: [...] })
// либо через defineRoute(path, name, setup) для последовательного описания.
// setup — функция, возвращающая строку-шаблон. Внутри можно вызывать
// ref/method/computed — они попадают в локальную scope маршрута.

const routes = [];
let mode = 'hash';
let root = '/';
let initialized = false;
let viewSelector = 'router-view';
let viewCounter = 0;

export const router = {
    currentRoute: null,
    get mode() { return mode; },
    get routes() { return routes.slice(); },
    push,
    replace,
    back,
    forward,
    go,
    resolve,
};

instance.router = router;

export function defineRoute(path, name, setup) {
    if (typeof path === 'object' && path !== null) {
        const r = path;
        routes.push({ path: r.path, name: r.name, setup: r.setup, scope: null, template: '' });
        return;
    }
    routes.push({ path, name, setup, scope: null, template: '' });
}

export function defineRouter(options = {}) {
    mode = options.mode || (window.history && window.history.pushState ? 'history' : 'hash');
    root = options.root || '/';
    if (options.view) viewSelector = options.view;

    if (Array.isArray(options.routes)) {
        options.routes.forEach((r) => defineRoute(r));
    }

    if (!initialized) {
        initialized = true;
        window.addEventListener('popstate', render);
        window.addEventListener('hashchange', render);
        document.addEventListener('click', onLinkClick);
        // рендер после завершения mount
        queueMicrotask(() => render());
    }

    return router;
}

function onLinkClick(event) {
    const el = event.target.closest('[router-link]');
    if (!el) return;
    const to = el.getAttribute('to') || el.getAttribute('router-link');
    if (!to) return;
    event.preventDefault();
    push(to);
}

function currentPath() {
    if (mode === 'hash') {
        const h = window.location.hash.replace(/^#/, '');
        return h || '/';
    }
    const base = root.replace(/\/$/, '');
    let p = window.location.pathname;
    if (base && p.startsWith(base)) p = p.slice(base.length);
    return p || '/';
}

function matchRoute(path) {
    return (
        routes.find((r) => r.path === path) ||
        routes.find((r) => r.path === '*') ||
        null
    );
}

function runSetup(route) {
    if (route.scope) return;

    const scopeName = `route-${route.name || routes.indexOf(route)}`;
    const scope = {
        methods: {},
        components: {},
        parent: instance,
    };
    // прокидываем прототип на главный instance, чтобы в шаблонах
    // маршрута были доступны сторы и глобальные ref/method.
    Object.setPrototypeOf(scope, instance);
    instance.components[scopeName] = scope;

    const prev = instance.activeComponent;
    instance.activeComponent = scopeName;
    try {
        const tpl = route.setup && route.setup();
        route.template = typeof tpl === 'string' ? tpl : (instance.components[scopeName].template || '');
    } finally {
        instance.activeComponent = prev;
    }

    route.scope = instance.components[scopeName];
}

function render() {
    const view = document.querySelector(viewSelector);
    if (!view) return;

    const path = currentPath();
    const route = matchRoute(path);
    if (!route) {
        view.innerHTML = '';
        router.currentRoute = null;
        return;
    }

    runSetup(route);

    if (!view.id) {
        view.id = `dome-router-view-${++viewCounter}`;
    }
    view.innerHTML = route.template;

    parseDOM(`#${view.id}`, route.scope);

    router.currentRoute = {
        path: route.path,
        name: route.name,
    };
}

function resolve(path) {
    return matchRoute(path);
}

function push(path) {
    if (mode === 'history') {
        window.history.pushState(null, '', joinRoot(path));
        render();
    } else {
        if (window.location.hash.replace(/^#/, '') === path) {
            render();
        } else {
            window.location.hash = path;
        }
    }
    return router;
}

function replace(path) {
    if (mode === 'history') {
        window.history.replaceState(null, '', joinRoot(path));
        render();
    } else {
        const href = window.location.href.replace(/#.*$/, '');
        window.location.replace(`${href}#${path}`);
    }
    return router;
}

function back() { window.history.back(); return router; }
function forward() { window.history.forward(); return router; }
function go(n) { window.history.go(n); return router; }

function joinRoot(path) {
    const base = root.replace(/\/$/, '');
    const p = path.startsWith('/') ? path : '/' + path;
    return base + p;
}
