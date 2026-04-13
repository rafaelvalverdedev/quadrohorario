document.addEventListener("DOMContentLoaded", () => {

    if (window.webOS && window.webOS.service) {

        console.log("Rodando em WebOS");

        // Desativa screensaver
        webOS.service.request("luna://com.webos.service.tvpower/power", {
            method: "setScreenSaver",
            parameters: {
                enable: false
            },
            onSuccess: () => console.log("Screensaver OFF"),
            onFailure: (err) => console.error(err)
        });

        // Mantém app ativo (heartbeat)
        setInterval(() => {
            webOS.service.request("luna://com.webos.service.applicationmanager/getForegroundAppInfo", {
                method: "getForegroundAppInfo"
            });
        }, 30000);

    } else {
        console.log("Modo navegador (não WebOS)");
    }

});