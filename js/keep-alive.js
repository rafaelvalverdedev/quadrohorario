function manterTelaAtiva() {
    document.body.style.opacity =
        document.body.style.opacity === "0.99" ? "1" : "0.99";
}

setInterval(manterTelaAtiva, 20000);