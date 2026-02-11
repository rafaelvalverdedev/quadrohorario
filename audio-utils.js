/* ===================================== */
/* ========= AUDIO UTILITIES =========== */
/* ===================================== */

function tocarAudioVariasVezes(audio, vezes = 3, intervalo = 800) {

    if (!audio) return;

    let contador = 0;

    function tocar() {

        audio.currentTime = 0;
        audio.play().catch(() => {});

        contador++;

        if (contador < vezes) {

            const duracao = isNaN(audio.duration) ? 1000 : audio.duration * 1000;

            setTimeout(tocar, duracao + intervalo);
        }
    }

    tocar();
}
