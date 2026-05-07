import { ref, computed, method, useStore } from "../../Dome-Library/dome.js";

export function menuSetup() {
    const menu = useStore('menu');
    const cart = useStore('cart');
    const fav = useStore('fav');

    const query = ref(['query'], '');
    const tag = ref(['tag'], 'all');

    const filtered = computed(['filtered'], () => {
        const q = query.value.trim().toLowerCase();
        return menu.items.value.filter((it) => {
            const matchQ = !q || it.name.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q);
            const matchTag = tag.value === 'all' || it.tag === tag.value;
            return matchQ && matchTag;
        });
    }, [menu.items, query, tag]);

    const hasResults = computed(['hasResults'], () => filtered.value.length > 0, [filtered]);
    const noResults  = computed(['noResults'],  () => filtered.value.length === 0, [filtered]);

    method('addToCart', (id) => cart.add(menu.getById(id)));
    method('toggleFav', (id) => fav.toggle(id));
    method('favIcon',   (id) => fav.ids.value.includes(+id) ? '★' : '☆');
    method('openItem',  (id) => window.__dome_router.push('/item/' + id));

    return /* html */ `
        <h1 class="page-title">Меню</h1>
        <p class="lead">Позиций найдено: {{ filtered.length }}</p>

        <div class="form-grid" style="grid-template-columns: 2fr 1fr;">
            <div>
                <label>Поиск</label>
                <input class="input" placeholder="название или описание..." d-text="query">
            </div>
            <div>
                <label>Категория</label>
                <select class="select" d-model="tag">
                    <option value="all">Все категории</option>
                    <option value="classic">Классика</option>
                    <option value="milk">Молочные</option>
                    <option value="signature">Фирменные</option>
                    <option value="warm">Тёплые</option>
                    <option value="dessert">Десерты</option>
                </select>
            </div>
        </div>

        <div d-if="hasResults" class="grid">
            <div class="card" d-for="item in filtered">
                <div class="emoji">{{ item.emoji }}</div>
                <h3>{{ item.name }}</h3>
                <div class="desc">{{ item.desc }}</div>
                <div class="row">
                    <span class="price">{{ item.price }} ₽</span>
                    <div style="display: flex; gap: 6px;">
                        <button class="btn ghost" d-on="click: toggleFav(item.id)">★</button>
                        <button class="btn ghost" d-on="click: openItem(item.id)">Подробнее</button>
                        <button class="btn" d-on="click: addToCart(item.id)">В корзину</button>
                    </div>
                </div>
            </div>
        </div>

        <div d-if="noResults" class="empty">
            Ничего не найдено по вашему запросу 😢
        </div>
    `;
}
