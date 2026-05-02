// ===============================
// 🔥 ANTI SCREEN SAVER REAL (PIXEL ACTIVITY)
// ===============================

// 1. Overlay com ruído invisível
function criarRuidoInvisible() {
    const el = document.createElement("div");

    el.style.position = "fixed";
    el.style.top = 0;
    el.style.left = 0;
    el.style.width = "100%";
    el.style.height = "100%";
    el.style.pointerEvents = "none";
    el.style.zIndex = "9999";
    el.style.opacity = "0.015";

    el.style.backgroundImage =
        "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=')";

    document.body.appendChild(el);

    setInterval(() => {
        el.style.opacity = el.style.opacity === "0.015" ? "0.02" : "0.015";
    }, 4000);
}

// 2. Micro movimento do layout
function moverTelaLevemente() {
    const el = document.getElementById("main-layout");

    if (!el) return;

    setInterval(() => {
        const x = (Math.random() * 0.5).toFixed(2);
        const y = (Math.random() * 0.5).toFixed(2);

        el.style.transform = `translate(${x}px, ${y}px)`;
    }, 30000);
}

// 3. Inicialização
document.addEventListener("DOMContentLoaded", () => {
    criarRuidoInvisible();
    moverTelaLevemente();
});