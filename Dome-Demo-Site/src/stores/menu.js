import { defineStore, ref, computed, method } from "../../Dome-Library/dome.js";

// Каталог напитков. Каждый объект — простой item, не реактивный сам по себе.
// Реактивно меняем только ссылку на массив.
export const menuStore = defineStore('menu', () => {
    const items = ref(['items'], [
        {
            id: 1,
            name: 'Эспрессо',
            emoji: '☕',
            price: 180,
            tag: 'classic',
            desc: 'Классика из свежеобжаренных зёрен Арабики. 30 мл бодрости.',
        },
        {
            id: 2,
            name: 'Капучино',
            emoji: '🥛',
            price: 260,
            tag: 'milk',
            desc: 'Эспрессо с нежной молочной пенкой и щепоткой корицы.',
        },
        {
            id: 3,
            name: 'Латте',
            emoji: '🍼',
            price: 280,
            tag: 'milk',
            desc: 'Много молока, мягкий вкус. Подходит даже тем, кто не любит кофе.',
        },
        {
            id: 4,
            name: 'Раф ванильный',
            emoji: '🍦',
            price: 310,
            tag: 'signature',
            desc: 'Фирменный напиток со сливками и ванилью. Десерт в чашке.',
        },
        {
            id: 5,
            name: 'Флэт уайт',
            emoji: '🤍',
            price: 290,
            tag: 'signature',
            desc: 'Двойной эспрессо и бархатное молоко. Для ценителей.',
        },
        {
            id: 6,
            name: 'Какао',
            emoji: '🍫',
            price: 220,
            tag: 'warm',
            desc: 'Горячий шоколад с маршмеллоу. Согревает в холодный день.',
        },
        {
            id: 7,
            name: 'Матча латте',
            emoji: '🍵',
            price: 320,
            tag: 'signature',
            desc: 'Японский чай матча с молоком. Антиоксиданты и спокойствие.',
        },
        {
            id: 8,
            name: 'Чизкейк Нью-Йорк',
            emoji: '🍰',
            price: 260,
            tag: 'dessert',
            desc: 'Классический десерт с ванильными нотами и хрустящей корочкой.',
        },
    ]);

    const count = computed(['count'], () => items.value.length, [items]);

    const getById = method('getById', (id) => {
        return items.value.find((x) => x.id === +id);
    });

    return { items, count, getById };
});
