import { ref, method } from "../../Dome-Library/dome.js";

export function homeSetup() {
    ref(['heroTitle'], 'Dome Brew');
    ref(['heroSubtitle'], 'Уютная кофейня, собранная на собственном мини-фреймворке Dome.js');
    ref(['year'], new Date().getFullYear());

    method('goMenu', () => {
        // router лежит в instance, обращаемся через глобальный объект
        window.__dome_router.push('/menu');
    });

    return /* html */ `
        <section class="card" style="padding: 36px; text-align: center;">
            <div style="font-size: 72px;">☕</div>
            <h1 class="page-title" style="font-size: 40px; margin-top: 12px;">
                {{ heroTitle }}
            </h1>
            <p class="lead" style="font-size: 18px; margin-bottom: 20px;">
                {{ heroSubtitle }}
            </p>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button class="btn" d-on="click: goMenu">Смотреть меню</button>
                <a class="btn ghost" router-link to="/about"
                   style="text-decoration: none; display: inline-block;">
                    О нас
                </a>
            </div>
        </section>

        <section style="margin-top: 28px;">
            <h2 class="section-title">Почему к нам?</h2>
            <div class="grid">
                <div class="card">
                    <div class="emoji">🌱</div>
                    <h3>Свежая обжарка</h3>
                    <div class="desc">Зёрна обжариваем каждую неделю, чтобы вы пили максимум вкуса.</div>
                </div>
                <div class="card">
                    <div class="emoji">🍰</div>
                    <h3>Десерты от шефа</h3>
                    <div class="desc">Чизкейки, тарты и фирменные раффаэлло собственного производства.</div>
                </div>
                <div class="card">
                    <div class="emoji">💛</div>
                    <h3>Атмосфера</h3>
                    <div class="desc">Мягкий свет, неспешная музыка и свободный Wi-Fi. Приходите работать или просто отдыхать.</div>
                </div>
            </div>
        </section>

        <footer class="footer">© {{ year }} Dome Brew — университетский проект на Dome.js</footer>
    `;
}
