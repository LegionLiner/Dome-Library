import { ref, computed, method, useStore } from "../../Dome-Library/dome.js";

export function itemSetup() {
    const menu = useStore('menu');
    const cart = useStore('cart');
    const fav = useStore('fav');

    const id = ref(['id'], getIdFromHash());

    const current = computed(['current'],
        () => menu.getById(id.value) || null,
        [menu.items, id]
    );
    const hasItem = computed(['hasItem'], () => current.value !== null, [current]);
    const noItem  = computed(['noItem'],  () => current.value === null, [current]);

    const name = computed(['name'], () => current.value ? current.value.name : '', [current]);
    const desc = computed(['desc'], () => current.value ? current.value.desc : '', [current]);
    const emoji = computed(['emoji'], () => current.value ? current.value.emoji : '', [current]);
    const price = computed(['price'], () => current.value ? current.value.price : 0, [current]);

    const favLabel = computed(['favLabel'],
        () => fav.ids.value.includes(+id.value) ? '★ В избранном' : '☆ В избранное',
        [fav.ids, id]
    );

    method('addToCart', () => {
        const it = current.value;
        if (it) cart.add(it);
    });
    method('toggleFav', () => fav.toggle(id.value));
    method('back', () => window.__dome_router.push('/menu'));

    return /* html */ `
        <div d-if="hasItem">
            <button class="btn ghost" d-on="click: back" style="margin-bottom: 14px;">← К меню</button>

            <div class="card" style="padding: 28px;">
                <div style="display: flex; gap: 28px; align-items: center; flex-wrap: wrap;">
                    <div style="font-size: 120px;" d-text="emoji"></div>
                    <div style="flex: 1; min-width: 240px;">
                        <h1 class="page-title" d-text="name"></h1>
                        <p class="lead" d-text="desc"></p>
                        <div class="price" style="font-size: 28px;">{{ price }} ₽</div>

                        <div style="display: flex; gap: 10px; margin-top: 18px;">
                            <button class="btn" d-on="click: addToCart">В корзину</button>
                            <button class="btn ghost" d-on="click: toggleFav" d-text="favLabel"></button>
                        </div>
                    </div>
                </div>

                <h2 class="section-title" style="margin-top: 28px;">Состав</h2>
                <p>Натуральные ингредиенты без искусственных красителей и консервантов.
                Подаётся с фирменным печеньем Dome Brew.</p>
            </div>
        </div>

        <div d-if="noItem" class="empty">
            Позиция не найдена.
            <a router-link to="/menu" style="color: var(--accent-dark);">Вернуться в меню</a>
        </div>
    `;
}

function getIdFromHash() {
    const m = window.location.hash.match(/\/item\/(\d+)/);
    return m ? +m[1] : 0;
}
