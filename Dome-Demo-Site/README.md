# Dome Brew ☕ — учебный сайт на Dome.js

Мини-сайт кофейни, построенный на собственном мини-фреймворке **Dome.js**
(лежит соседней папкой `../Dome-Library`). Демонстрирует:

- **Composition API**: `ref`, `computed`, `method`, `watch`, `onMounted` и т.д.;
- **Сторы** через `defineStore` / `useStore` (каталог, корзина, избранное);
- **Роутинг** через `defineRouter` / `router.push` (режим `hash`) и навигацию
  по `<a router-link to="...">` и программно;
- **Директивы шаблонов**: `d-text`, `d-for`, `d-if` / `d-else`, `d-on`,
  `d-model`, `d-bind`, `{{ mustaches }}`.

## Структура

```
Dome-Demo-Site/
├── index.html
├── styles.css
└── src/
    ├── app.js              # точка входа: layout + регистрация роутера
    ├── stores/
    │   ├── menu.js         # каталог напитков и десертов
    │   ├── cart.js         # корзина + сумма и кол-во
    │   └── fav.js          # избранные позиции
    └── pages/
        ├── home.js         # главная
        ├── menu.js         # каталог с поиском и фильтром
        ├── item.js         # карточка позиции
        ├── cart.js         # корзина + оформление заказа
        ├── fav.js          # избранное
        ├── about.js        # о нас + форма отзывов
        └── notFound.js     # 404
```

## Запуск

ES-модули требуют http-сервер.

```powershell
# Node.js
npx http-server -p 5173
```

Откройте `http://localhost:5173/`.

## Маршруты

- `#/` — главная
- `#/menu` — меню
- `#/item/1` … `#/item/8` — карточка позиции
- `#/cart` — корзина
- `#/fav` — избранное
- `#/about` — о нас
- всё остальное — 404
