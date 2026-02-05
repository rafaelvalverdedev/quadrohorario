/* ============================= */
/* ===== CORES POR TIPO ======= */
const CORES_POR_TIPO = {
    "MEDICACAO": "#ff0000",
    "HIDRATACAO": "#2563eb",
    "NEBULIZACAO": "#516fd3",
    "SINAIS VITAIS": "#ea580c",
    "DIETA": "#16a34a",
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
let ultimoIndiceAtual = null;
let medicamentos = [];

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

async function carregarMedicamentos() {
    try {
        const response = await fetch("./plano.json");
        medicamentos = await response.json();

        // ordena por horário
        medicamentos.sort((a, b) => {
            return horarioParaMinutos(a.horario) - horarioParaMinutos(b.horario);
        });

        atualizarQuadro();
    } catch (erro) {
        console.error("Erro ao carregar plano:", erro);
    }
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

    let indiceAtual = medicamentos.findIndex(m => {
        return horarioParaMinutos(m.horario) >= minutosAgora;
    });

    if (indiceAtual === -1) {
        indiceAtual = medicamentos.length - 1;
    }

    const mudouHorario = indiceAtual !== ultimoIndiceAtual;

    /* ============================= */
    /* ===== ALERTAS SONOROS ===== */
    /* ============================= */
    if (mudouHorario && ultimoIndiceAtual !== null) {

        // 🔔 alerta geral
        audioAlerta.currentTime = 0;
        audioAlerta.play().catch(() => { });

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
    /* ===== RENDERIZA (-3 a +3) ===== */
    /* ============================= */
    for (let offset = -3; offset <= 3; offset++) {

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
            // if (mudouHorario) li.classList.add("alerta");
        } else if (offset < 0) {
            li.classList.add(`anterior-${Math.abs(offset)}`);
        } else {
            li.classList.add(`proximo-${offset}`);
        }

        if (mudouHorario) {
            // li.classList.add("mudou-horario");
        }

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
setInterval(atualizarQuadro, 10000);
carregarMedicamentos();
