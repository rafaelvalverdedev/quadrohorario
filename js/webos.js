document.addEventListener("DOMContentLoaded", () => {

    if (window.webOS && window.webOS.service) {

        console.log("Rodando em WebOS");

        // ⚠️ tentativa (nem sempre funciona)
        webOS.service.request("luna://com.webos.service.tvpower/power", {
            method: "setScreenSaver",
            parameters: {
                enable: false
            }
        });

        // 🔁 heartbeat
        setInterval(() => {
            webOS.service.request(
                "luna://com.webos.service.applicationmanager/getForegroundAppInfo",
                { method: "getForegroundAppInfo" }
            );
        }, 20000);

    }
});