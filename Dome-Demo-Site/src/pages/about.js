import { ref, method } from '../../Dome-Library/dome.js';

export function aboutSetup() {
    const who = ref(['who'], '');
    const stars = ref(['stars'], '5');
    const text = ref(['text'], '');
    const reviewsHtml = ref(['reviewsHtml'], initialHtml());
    const status = ref(['status'], '');

    function initialHtml() {
        const base = [
            { who: 'Анна', stars: 5, text: 'Лучший раф в городе и очень уютно. Работаю здесь каждую пятницу!' },
            { who: 'Дмитрий', stars: 4, text: 'Хороший флэт уайт, приветливые бариста.' }
        ];
        return base.map(renderReview).join('');
    }

    function renderReview(r) {
        const s = '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars);
        const safeWho = escapeHtml(r.who);
        const safeText = escapeHtml(r.text);
        return `<div class="review-card"><div class="review-head">${safeWho} <span class="stars">${s}</span></div><div class="review-body">${safeText}</div></div>`;
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    method('submit', () => {
        const w = who.value.trim();
        const t = text.value.trim();
        if (!w || !t) {
            status.value = 'Пожалуйста, заполните имя и текст отзыва.';
            return;
        }
        const st = parseInt(stars.value, 10) || 5;
        reviewsHtml.value = renderReview({ who: w, stars: st, text: t }) + reviewsHtml.value;
        who.value = '';
        text.value = '';
        stars.value = '5';
        status.value = 'Спасибо за отзыв!';
    });

    return /* html */ `
    <div>
        <h1 class="page-title">О нас</h1>

        <p class="lead">
            Dome Brew — небольшая кофейня в центре города. Этот сайт — учебный проект
            для университета, полностью написанный на авторском мини-фреймворке
            <b>Dome.js</b>: реактивность (<code>ref</code> / <code>computed</code>),
            сторы, роутинг и директивы <code>d-for</code>, <code>d-if</code>,
            <code>d-text</code>, <code>d-on</code>, <code>d-model</code>, <code>d-bind</code>.
        </p>

        <h2 class="section-title">Отзывы гостей</h2>

        <div class="card form-grid" style="margin-bottom: 18px;">
            <div>
                <label>Ваше имя</label>
                <input class="input" d-model="who" placeholder="Как к вам обращаться?">
            </div>
            <div>
                <label>Оценка</label>
                <select class="input" d-model="stars">
                    <option value="5">★★★★★</option>
                    <option value="4">★★★★☆</option>
                    <option value="3">★★★☆☆</option>
                    <option value="2">★★☆☆☆</option>
                    <option value="1">★☆☆☆☆</option>
                </select>
            </div>
            <div class="full">
                <label>Отзыв</label>
                <textarea class="input" d-model="text" rows="3" placeholder="Расскажите, как прошёл визит..."></textarea>
            </div>
            <div class="full" style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                <span class="muted" d-text="status"></span>
                <button class="btn" d-on="click: submit">Оставить отзыв</button>
            </div>
        </div>

        <div class="reviews" d-html="reviewsHtml"></div>
    </div>
`;
}
