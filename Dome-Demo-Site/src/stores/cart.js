import { defineStore, ref, computed, method } from "../../Dome-Library/dome.js";

// Корзина. Храним массив {id, qty}. Все мутации — через method,
// чтобы дергать реактивность (проксируется ref-значение).
export const cartStore = defineStore('cart', () => {
    const lines = ref(['lines'], []);

    const totalQty = computed(['totalQty'],
        () => lines.value.reduce((s, l) => s + l.qty, 0),
        [lines]
    );

    const isEmpty = computed(['isEmpty'],
        () => lines.value.length === 0,
        [lines]
    );

    const add = method('add', (item) => {
        const copy = lines.value.slice();
        const found = copy.find((l) => l.id === item.id);
        if (found) {
            found.qty += 1;
        } else {
            copy.push({
                id: item.id,
                name: item.name,
                emoji: item.emoji,
                price: item.price,
                qty: 1,
            });
        }
        lines.value = copy;
    });

    const inc = method('inc', (id) => {
        const copy = lines.value.slice();
        const l = copy.find((x) => x.id === +id);
        if (l) l.qty += 1;
        lines.value = copy;
    });

    const dec = method('dec', (id) => {
        let copy = lines.value.slice();
        const l = copy.find((x) => x.id === +id);
        if (!l) return;
        l.qty -= 1;
        if (l.qty <= 0) copy = copy.filter((x) => x.id !== l.id);
        lines.value = copy;
    });

    const remove = method('remove', (id) => {
        lines.value = lines.value.filter((x) => x.id !== +id);
    });

    const clear = method('clear', () => {
        lines.value = [];
    });

    const total = computed(['total'],
        () => lines.value.reduce((s, l) => s + l.qty * l.price, 0),
        [lines]
    );

    return { lines, totalQty, isEmpty, total, add, inc, dec, remove, clear };
});
