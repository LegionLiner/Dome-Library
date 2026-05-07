import { defineStore, ref, computed, method } from "../../Dome-Library/dome.js";

// Избранное — храним id товаров.
export const favStore = defineStore('fav', () => {
    const ids = ref(['ids'], []);

    const count = computed(['count'], () => ids.value.length, [ids]);

    const has = method('has', (id) => ids.value.includes(+id));

    const toggle = method('toggle', (id) => {
        const nid = +id;
        if (ids.value.includes(nid)) {
            ids.value = ids.value.filter((x) => x !== nid);
        } else {
            ids.value = [...ids.value, nid];
        }
    });

    return { ids, count, has, toggle };
});
