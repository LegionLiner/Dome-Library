import { computed, method, useStore } from "../../Dome-Library/dome.js";

export function favSetup() {
    const menu = useStore('menu');
    const fav = useStore('fav');
    const cart = useStore('cart');

    const favItems = computed(['favItems'],
        () => menu.items.value.filter((it) => fav.ids.value.includes(it.id)),
        [menu.items, fav.ids]
    );
    const hasFav = computed(['hasFav'], () => favItems.value.length > 0, [favItems]);
    const noFav  = computed(['noFav'],  () => favItems.value.length === 0, [favItems]);

    method('addToCart', (id) => cart.add(menu.getById(id)));
    method('removeFromFav', (id) => fav.toggle(id));

    return /* html */ `
        <h1 class="page-title">Избранное <span class="badge" d-text="fav.count"></span></h1>

        <div class="empty" d-if="noFav">
            Пока пусто. Нажмите на ☆ в меню, чтобы сохранить напиток сюда.
        </div>

        <div d-if="hasFav" class="grid">
            <div class="card" d-for="item in favItems">
                <div class="emoji">{{ item.emoji }}</div>
                <h3>{{ item.name }}</h3>
                <div class="desc">{{ item.desc }}</div>
                <div class="row">
                    <span class="price">{{ item.price }} ₽</span>
                    <div style="display: flex; gap: 6px;">
                        <button class="btn ghost" d-on="click: removeFromFav(item.id)">Убрать ★</button>
                        <button class="btn" d-on="click: addToCart(item.id)">В корзину</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
