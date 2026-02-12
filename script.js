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

// alerta geral
const audioAlerta = new Audio("./audio/alerta.mp3");

// áudios por tipo
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

function liberarAudio() {
    if (audioLiberado) return;

    audioAlerta.play().then(() => {
        audioAlerta.pause();
        audioAlerta.currentTime = 0;
        audioLiberado = true;
        console.log("Áudio liberado");
    }).catch(() => { });
}

window.addEventListener("click", liberarAudio, { once: true });
window.addEventListener("touchstart", liberarAudio, { once: true });



const lista = document.getElementById("lista");

/* ============================= */
/* ============ UTIL ========== */
//  Padronização de tipos: acentos, cedilha, minusculas e maiúscias 
function normalizarTipo(tipo) {
    return tipo
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .trim();
}

/* ============================= */
/* ======= CARREGAR JSON ====== */

function atualizarQuadroPrincipal(dados) {
    medicamentos = dados;
    atualizarQuadro();
}

/* ============================= */
/* ===== ATUALIZAR QUADRO ===== */

function atualizarQuadro() {
    lista.innerHTML = "";

    const agora = new Date();  // Formato completo
    const horaAtual = agora.toTimeString().slice(0, 5); // Formato reduzido HH:mm

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

    /* ===== ÍNDICE ATUAL ===== */
    const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

    let indiceAtual = -1;

    for (let i = 0; i < medicamentos.length; i++) {
        if (horarioParaMinutos(medicamentos[i].horario) <= minutosAgora) {
            indiceAtual = i;
        } else {
            break;
        }
    }

    if (indiceAtual === -1) { indiceAtual = 0; }

    const mudouHorario = indiceAtual !== ultimoIndiceAtual;

    /* ============================= */
    /* ===== ALERTAS SONOROS ===== */
    /* ============================= */
    if (mudouHorario && ultimoIndiceAtual !== null) {

        // 🔊 alerta por tipo
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
    /* ===== RENDERIZA (-5 a +5) ===== */
    /* ============================= */
    for (let offset = -5; offset <= 5; offset++) {

        const index =
            (indiceAtual + offset + medicamentos.length) %
            medicamentos.length;

        const med = medicamentos[index];

        const li = document.createElement("li");

        /* ===== TOPO ===== */
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
        if (offset === 0) {
            tipo.style.backgroundColor = CORES_POR_TIPO[tipoNormalizado];
        }
        tipo.textContent = med.tipo;


        /* ===== DESCRIÇÃO ===== */
        const desc = document.createElement("div");
        desc.className = "descricao";
        desc.textContent = med.desc;

        /* ===== OBS ===== */
        const obs = document.createElement("div");
        obs.className = "obs";
        obs.textContent = med.observacao;

        linhaTopo.append(cor, horario, nome, tipo);

        if (offset === 0) {
            li.append(linhaTopo, desc, obs);
        } else {
            li.append(linhaTopo);
        }


        /* ===== CLASSES ===== */
        if (offset === 0) {
            li.classList.add("atual");
            if (mudouHorario) li.classList.add("alerta");
        } else if (offset < 0) {
            li.classList.add(`anterior-${Math.abs(offset)}`);
        } else {
            li.classList.add(`proximo-${offset}`);
        }

        if (mudouHorario) {
            li.classList.add("alerta");
        }
console.log(offset);
console.log(mudouHorario);

        lista.appendChild(li);
    }
}


//  Converte horário de texto em numero
function horarioParaMinutos(horario) {
    const [h, m] = horario.split(":").map(Number);
    return h * 60 + m;
}

/* ============================= */
/* ===== LOOP ===== */
/* ============================= */

setInterval(atualizarQuadro, 20000);
