// ===============================
// 🔁 KEEP ALIVE + MICRO MUDANÇA
// ===============================

function manterTelaAtiva() {
    // Alterna leve opacity
    document.body.style.opacity =
        document.body.style.opacity === "0.99" ? "1" : "0.99";

    // Pequena mudança de cor imperceptível
    document.body.style.filter =
        document.body.style.filter === "brightness(1.00)"
            ? "brightness(1.01)"
            : "brightness(1.00)";
}

setInterval(manterTelaAtiva, 20000);