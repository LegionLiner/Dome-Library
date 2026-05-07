export function notFoundSetup() {
    return /* html */ `
        <div class="empty" style="padding: 80px 20px;">
            <div style="font-size: 80px;">☕💤</div>
            <h1 class="page-title">404 — страница уснула</h1>
            <p class="lead">Такого уголка в нашей кофейне нет.</p>
            <a class="btn" router-link to="/" style="text-decoration: none; display: inline-block;">На главную</a>
        </div>
    `;
}
