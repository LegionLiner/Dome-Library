import {
    ref,
    computed,
    method,
    template,
    mount,
    defineRouter,
    router,
    useStore,
} from "../Dome-Library/dome.js";

// Сторы
import { menuStore } from "./stores/menu.js";
import { cartStore } from "./stores/cart.js";
import { favStore } from "./stores/fav.js";

// Страницы
import { homeSetup } from "./pages/home.js";
import { menuSetup } from "./pages/menu.js";
import { cartSetup } from "./pages/cart.js";
import { favSetup } from "./pages/fav.js";
import { itemSetup } from "./pages/item.js";
import { aboutSetup } from "./pages/about.js";
import { notFoundSetup } from "./pages/notFound.js";

// «холодное» использование сторов, чтобы они точно инициализировались
menuStore; cartStore; favStore;

// Реактивные счётчики в шапке
const cart = useStore('cart');
const fav = useStore('fav');

const cartCount = computed(['cartCount'], () => cart.totalQty.value, [cart.totalQty]);
const favCount  = computed(['favCount'],  () => fav.count.value,    [fav.count]);

const currentPath = ref(['currentPath'], window.location.hash.replace(/^#/, '') || '/');

const classHome  = computed(['classHome'],  () => currentPath.value === '/'      ? 'active' : '', [currentPath]);
const classMenu  = computed(['classMenu'],  () => currentPath.value === '/menu'  ? 'active' : '', [currentPath]);
const classFav   = computed(['classFav'],   () => currentPath.value === '/fav'   ? 'active' : '', [currentPath]);
const classAbout = computed(['classAbout'], () => currentPath.value === '/about' ? 'active' : '', [currentPath]);

method('nav', (path) => { router.push(path); });

// когда роутер меняет маршрут — обновляем currentPath для подсветки меню
window.addEventListener('hashchange', () => {
    currentPath.value = window.location.hash.replace(/^#/, '') || '/';
});
window.addEventListener('popstate', () => {
    currentPath.value = window.location.hash.replace(/^#/, '') || '/';
});

// Layout
template(/* html */ `
    <header class="topbar">
        <div class="logo">Dome<span>Brew</span> ☕</div>
        <nav class="menu">
            <a d-on="click: nav('/')"       d-bind="class: classHome">Главная</a>
            <a d-on="click: nav('/menu')"   d-bind="class: classMenu">Меню</a>
            <a d-on="click: nav('/fav')"    d-bind="class: classFav">Избранное</a>
            <a d-on="click: nav('/about')"  d-bind="class: classAbout">О нас</a>
        </nav>
        <div class="cart-pill" d-on="click: nav('/cart')">
            🛒 Корзина · {{ cartCount }}
        </div>
    </header>

    <main>
        <router-view></router-view>
    </main>
`, '.app');

mount('.app');

// даём layout-у отрисоваться, потом подключаем роутер
defineRouter({
    mode: 'hash',
    view: 'router-view',
    routes: [
        { path: '/',      name: 'home',  setup: homeSetup },
        { path: '/menu',  name: 'menu',  setup: menuSetup },
        { path: '/cart',  name: 'cart',  setup: cartSetup },
        { path: '/fav',   name: 'fav',   setup: favSetup },
        { path: '/about', name: 'about', setup: aboutSetup },
        // страница товара — отдельный маршрут на каждый id (учебный проект)
        { path: '/item/1', name: 'item-1', setup: itemSetup },
        { path: '/item/2', name: 'item-2', setup: itemSetup },
        { path: '/item/3', name: 'item-3', setup: itemSetup },
        { path: '/item/4', name: 'item-4', setup: itemSetup },
        { path: '/item/5', name: 'item-5', setup: itemSetup },
        { path: '/item/6', name: 'item-6', setup: itemSetup },
        { path: '/item/7', name: 'item-7', setup: itemSetup },
        { path: '/item/8', name: 'item-8', setup: itemSetup },
        { path: '*',      name: '404',   setup: notFoundSetup },
    ],
});

// пробрасываем роутер в window — страницы пользуются им для программной навигации
window.__dome_router = router;

// если зашли на пустой hash — отправляем на главную
if (!window.location.hash) {
    window.location.hash = '/';
}
