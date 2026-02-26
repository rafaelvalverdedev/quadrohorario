/* ============================= */
/* ===== CORES POR TIPO ======= */
const CORES_POR_TIPO = {
    "MEDICACAO": "#D9534F",
    "HIDRATACAO": "#4A90E2",
    "NEBULIZACAO": "#8E7CC3",
    "SINAIS VITAIS": "#F5A623",
    "DIETA": "#4CAF50",
    "HIGIENE": "#0ea5e9",
};

/* ============================= */
/* =========== ÁUDIOS ========= */

const audioAlerta = new Audio("./audio/alerta.mp3");

const AUDIOS_POR_TIPO = {
    "MEDICACAO": new Audio("./audio/medicacao.mp3"),
    "HIDRATACAO": new Audio("./audio/hidratacao.mp3"),
    "NEBULIZACAO": new Audio("./audio/nebulizacao.mp3"),
    "SINAIS VITAIS": new Audio("./audio/sinais-vitais.mp3"),
    "DIETA": new Audio("./audio/dieta.mp3"),
    "HIGIENE": new Audio("./audio/higiene.mp3"),
};

/* ============================= */
/* ========= VARIÁVEIS ======== */

let audioLiberado = false;
let ultimoIndiceAtual = null;
let medicamentos = [];

const lista = document.getElementById("lista");

/* ============================= */
/* ===== LIBERAR ÁUDIO ======== */

function liberarAudio() {
    if (audioLiberado) return;

    audioAlerta.play().then(() => {
        audioAlerta.pause();
        audioAlerta.currentTime = 0;
        audioLiberado = true;
    }).catch(() => { });
}

window.addEventListener("click", liberarAudio, { once: true });
window.addEventListener("touchstart", liberarAudio, { once: true });

/* ============================= */
/* ========= UTILIDADES ======= */

function normalizarTipo(tipo) {
    return tipo
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .trim();
}

function horarioParaMinutos(horario) {
    const [h, m] = horario.split(":").map(Number);
    return h * 60 + m;
}

/* ============================= */
/* ===== LÓGICA CICLO 24H ===== */

function obterIndiceAtual(listaMedicamentos) {
    const agora = new Date();
    const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

    const minutosLista = listaMedicamentos.map(m =>
        horarioParaMinutos(m.horario)
    );

    for (let i = 0; i < minutosLista.length; i++) {
        if (minutosLista[i] > minutosAgora) {
            return i - 1 >= 0 ? i - 1 : minutosLista.length - 1;
        }
    }

    // Se passou do último horário do dia
    return minutosLista.length - 1;
}

/* ============================= */
/* ===== CARREGAR DADOS ======= */

function atualizarQuadroPrincipal(dados) {
    medicamentos = dados;
    atualizarQuadro();
}

/* ============================= */
/* ===== ATUALIZAR QUADRO ===== */

function atualizarQuadro() {

    if (!medicamentos.length) return;

    const agora = new Date();
    const horaAtual = agora.toTimeString().slice(0, 5);

    const dataFormatada = agora.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    const dataComDiaMaiusculo = dataFormatada.replace(
        /\b([a-zà-ú])/i,
        letra => letra.toUpperCase()
    );

    document.getElementById("data-atual").textContent = dataComDiaMaiusculo;
    document.getElementById("hora-atual").textContent = horaAtual;

    const indiceAtual = obterIndiceAtual(medicamentos);

    const mudouHorario = indiceAtual !== ultimoIndiceAtual;
    if (!mudouHorario) return;

    lista.innerHTML = "";

    /* ============================= */
    /* ===== ALERTA SONORO ========= */
    /* ============================= */

    if (ultimoIndiceAtual !== null) {
        const medAtual = medicamentos[indiceAtual];
        const tipoNormalizado = normalizarTipo(medAtual.tipo);
        const audioTipo = AUDIOS_POR_TIPO[tipoNormalizado];

        if (audioTipo) {
            setTimeout(() => {
                audioTipo.currentTime = 0;
                audioTipo.play().catch(() => { });
            }, 800);
        }
    }

    ultimoIndiceAtual = indiceAtual;

    /* ============================= */
    /* ===== RENDERIZAÇÃO ========= */
    /* ============================= */

    for (let offset = -5; offset <= 5; offset++) {

        const index = (indiceAtual + offset + medicamentos.length) % medicamentos.length;
        const med = medicamentos[index];
        const li = document.createElement("li");

        const linhaTopo = document.createElement("div");
        linhaTopo.className = "linha-topo";

        const cor = document.createElement("div");
        cor.className = "cor";

        const tipoNormalizado = normalizarTipo(med.tipo);
        cor.style.backgroundColor = CORES_POR_TIPO[tipoNormalizado] || "#6b7280";

        const horario = document.createElement("div");
        horario.className = "horario";
        horario.textContent = med.horario;

        const nome = document.createElement("div");
        nome.className = "nome";
        nome.textContent = med.nome;

        const tipo = document.createElement("div");
        tipo.className = "tipo";
        tipo.textContent = med.tipo;

        if (offset === 0) {
            tipo.style.backgroundColor = CORES_POR_TIPO[tipoNormalizado];
        }

        const desc = document.createElement("div");
        desc.className = "descricao";
        desc.textContent = med.desc;

        const obs = document.createElement("div");
        obs.className = "obs";
        obs.textContent = med.observacao;

        linhaTopo.append(cor, horario, nome, tipo);

        if (offset === 0) {
            li.append(linhaTopo, desc, obs);
        } else {
            li.append(linhaTopo);
        }

        if (offset === 0) {
            li.classList.add("atual", "alerta");
        } else if (offset < 0) {
            li.classList.add(`anterior-${Math.abs(offset)}`);
        } else {
            li.classList.add(`proximo-${offset}`);
        }

        lista.appendChild(li);
    }
}

/* ============================= */
/* ===== LOOP PRECISO ========= */
/* ============================= */

function iniciarLoopPreciso() {

    atualizarQuadro();

    const agora = new Date();
    const segundosRestantes = 60 - agora.getSeconds();

    setTimeout(() => {
        atualizarQuadro();
        setInterval(atualizarQuadro, 60000);
    }, segundosRestantes * 1000);
}

iniciarLoopPreciso();
