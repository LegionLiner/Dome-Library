import { ref, computed, method, useStore } from "../../Dome-Library/dome.js";

export function cartSetup() {
    const cart = useStore('cart');

    const name = ref(['name'], '');
    const address = ref(['address'], '');
    const placed = ref(['placed'], false);
    const notPlaced = computed(['notPlaced'], () => !placed.value, [placed]);
    const notEmpty = computed(['notEmpty'], () => !cart.isEmpty.value, [cart.isEmpty]);
    const lastTotal = ref(['lastTotal'], 0);

    method('place', () => {
        if (!name.value.trim() || !address.value.trim()) {
            alert('Заполните имя и адрес доставки');
            return;
        }
        if (cart.isEmpty.value) return;
        lastTotal.value = cart.total.value;
        cart.clear();
        placed.value = true;
        name.value = '';
        address.value = '';
    });

    method('keepShopping', () => {
        placed.value = false;
        window.__dome_router.push('/menu');
    });

    return /* html */ `
        <h1 class="page-title">Корзина</h1>

        <div d-if="placed">
            <div class="card" style="text-align: center; padding: 36px;">
                <div style="font-size: 64px;">✅</div>
                <h2 class="section-title">Заказ оформлен!</h2>
                <p class="lead">Сумма заказа: <b>{{ lastTotal }} ₽</b>. Курьер скоро свяжется с вами.</p>
                <button class="btn" d-on="click: keepShopping">Вернуться в меню</button>
            </div>
        </div>

        <div d-if="notPlaced">
            <div class="empty" d-if="cart.isEmpty">
                Корзина пуста. Загляните в
                <a router-link to="/menu" style="color: var(--accent-dark);">меню</a>.
            </div>

            <div d-if="notEmpty" class="cart-list">
                <div class="cart-row" d-for="line in cart.lines">
                    <div>
                        <b>{{ line.emoji }} {{ line.name }}</b>
                        <div style="color: var(--muted); font-size: 13px;">
                            {{ line.price }} ₽ × {{ line.qty }}
                        </div>
                    </div>
                    <div class="qty">
                        <button d-on="click: cart.dec(line.id)">−</button>
                        <span d-text="line.qty"></span>
                        <button d-on="click: cart.inc(line.id)">+</button>
                    </div>
                    <b>{{ line.price }} ₽ × {{ line.qty }}</b>
                    <button class="btn ghost" d-on="click: cart.remove(line.id)">Убрать</button>
                </div>

                <div class="summary">
                    <span>Итого ({{ cart.totalQty }} шт.)</span>
                    <span class="total">{{ cart.total }} ₽</span>
                </div>
            </div>

            <div d-if="notEmpty" class="form-grid" style="margin-top: 18px;">
                <div>
                    <label>Имя</label>
                    <input class="input" d-text="name" placeholder="Иван">
                </div>
                <div>
                    <label>Адрес доставки</label>
                    <input class="input" d-text="address" placeholder="ул. Пушкина, д. 7">
                </div>
                <div class="full" style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button class="btn ghost" d-on="click: cart.clear">Очистить</button>
                    <button class="btn" d-on="click: place">Оформить заказ</button>
                </div>
            </div>
        </div>
    `;
}
