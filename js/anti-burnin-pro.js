// ===============================
// 🧠 ANTI BURN-IN PROFISSIONAL ENGINE
// ===============================

const AntiBurnIn = (() => {

    let offsetX = 0;
    let offsetY = 0;
    let driftDirection = 1;

    // ===============================
    // 1. PIXEL DRIFT CONTÍNUO
    // ===============================
    function pixelDrift() {
        const el = document.getElementById("main-layout");
        if (!el) return;

        offsetX += (Math.random() * 0.6 - 0.3);
        offsetY += (Math.random() * 0.6 - 0.3);

        el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }

    // ===============================
    // 2. OSCILAÇÃO GLOBAL DE BRILHO
    // ===============================
    function dynamicBrightness() {
        const value = 0.96 + Math.random() * 0.08;
        document.body.style.filter = `brightness(${value})`;
    }

    // ===============================
    // 3. NOISE OVERLAY (PIXEL VARIATION)
    // ===============================
    function createNoise() {
        const noise = document.createElement("canvas");
        noise.width = window.innerWidth;
        noise.height = window.innerHeight;

        noise.style.position = "fixed";
        noise.style.top = 0;
        noise.style.left = 0;
        noise.style.pointerEvents = "none";
        noise.style.opacity = "0.03";
        noise.style.zIndex = 9999;

        document.body.appendChild(noise);

        const ctx = noise.getContext("2d");

        function drawNoise() {
            const imageData = ctx.createImageData(noise.width, noise.height);
            const buffer = new Uint32Array(imageData.data.buffer);

            for (let i = 0; i < buffer.length; i++) {
                if (Math.random() > 0.995) {
                    buffer[i] = 0xffffffff;
                }
            }

            ctx.putImageData(imageData, 0, 0);
        }

        setInterval(drawNoise, 3000);
    }

    // ===============================
    // 4. LAYOUT SHIFT (MACRO)
    // ===============================
    function layoutShift() {
        const shift = Math.floor(Math.random() * 5);
        document.body.style.paddingTop = shift + "px";
    }

    // ===============================
    // 5. MICRO COLOR SHIFT
    // ===============================
    function colorShift() {
        const hue = Math.floor(Math.random() * 5);
        document.body.style.filter += ` hue-rotate(${hue}deg)`;
    }

    // ===============================
    // 6. FAKE USER INPUT
    // ===============================
    function simulateUserActivity() {
        document.dispatchEvent(new KeyboardEvent("keydown", {
            key: "ArrowDown",
            keyCode: 40
        }));
    }

    // ===============================
    // 7. WAKE SCREEN (WEBOS)
    // ===============================
    function wakeScreen() {
        if (window.webOS && webOS.service) {
            webOS.service.request("luna://com.webos.service.tvpower/power", {
                method: "turnOnScreen",
                parameters: {}
            });
        }
    }

    // ===============================
    // 8. RECOVERY VISUAL (SE ESCURECER)
    // ===============================
    function visibilityWatchdog() {
        setInterval(() => {
            if (document.hidden) {
                console.warn("Tela possivelmente em proteção — tentando recuperar");
                wakeScreen();
                simulateUserActivity();
            }
        }, 15000);
    }

    // ===============================
    // INIT
    // ===============================
    function init() {

        createNoise();

        setInterval(pixelDrift, 8000);
        setInterval(dynamicBrightness, 12000);
        setInterval(layoutShift, 120000);
        setInterval(colorShift, 20000);
        setInterval(simulateUserActivity, 55000);
        setInterval(wakeScreen, 60000);

        visibilityWatchdog();
    }

    return { init };

})();

document.addEventListener("DOMContentLoaded", AntiBurnIn.init);