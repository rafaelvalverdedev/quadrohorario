const CORES_POR_TIPO = {
    "MEDICACAO": "#ff0000",     
    "HIDRATACAO": "#2563eb",    
    "NEBULIZACAO": "#516fd3ff", 
    "SINAIS VITAIS": "#ea580c", 
    "DIETA": "#16a34a",
    "HIGIENE": "#2563eb",
};

const audioAlerta = new Audio("./alerta.mp3");
audioAlerta.volume = 1;

let ultimoIndiceAtual = null;
let medicamentos = [];

const lista = document.getElementById("lista");

function normalizarTipo(tipo) {
    return tipo
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .trim();
}

async function carregarMedicamentos() {
    try {
        const response = await fetch("./plano.json");
        medicamentos = await response.json();

        // garante ordem por horário
        medicamentos.sort((a, b) => a.horario.localeCompare(b.horario));

        atualizarQuadro();
    } catch (erro) {
        console.error("Erro ao carregar medicamentos:", erro);
    }
}

function atualizarQuadro() {
    const agora = new Date();
    const horaAtual = agora.toTimeString().slice(0, 5);

    /* ===== RELÓGIO ===== */
    document.getElementById("hora-atual").textContent = horaAtual;
    document.getElementById("data-atual").textContent = agora.toLocaleDateString("pt-BR", {weekday: "long", day: "2-digit", month: "long",year: "numeric",});

    /* ===== LIMPA LISTA ===== */
    lista.innerHTML = "";

    /* ===== ENCONTRA ÍNDICE ATUAL ===== */
    let indiceAtual = medicamentos.findIndex((m) => m.horario >= horaAtual);

    // se passou de todos os horários, assume o último
    if (indiceAtual === -1) { indiceAtual = medicamentos.length - 1; }

    const mudouHorario = indiceAtual !== ultimoIndiceAtual;

    if (mudouHorario && ultimoIndiceAtual !== null) {
        audioAlerta.currentTime = 0;
        audioAlerta.play().catch(() => { });
    }

    ultimoIndiceAtual = indiceAtual;

    /* ===================================================== */
    /* ===== RENDERIZA COM CICLO INFINITO (-3 a +3) ===== */
    /* ===================================================== */
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

        cor.style.backgroundColor = CORES_POR_TIPO[tipoNormalizado] || "#6b7280"; // fallback cinza

        const horario = document.createElement("div");
        horario.className = "horario";
        horario.textContent = med.horario;

        const tipo = document.createElement("div");
        tipo.className = "tipo";
        tipo.textContent = med.tipo;

        const nome = document.createElement("div");
        nome.className = "nome";
        nome.textContent = med.nome;

        linhaTopo.append(cor, horario, nome, tipo);

        /* ===== DESCRIÇÃO ===== */
        const desc = document.createElement("div");
        desc.className = "descricao";
        desc.textContent = med.desc;

        /* ===== OBS ===== */
        const obs = document.createElement("div");
        obs.className = "obs";
        obs.textContent = med.observacao;

        li.append(linhaTopo, desc, obs);

        /* ===== CLASSES ===== */
        if (offset === 0) {
            li.classList.add("atual");
            if (mudouHorario) {
                li.classList.add("alerta");
            }
        } else if (offset < 0) {
            li.classList.add(`anterior-${Math.abs(offset)}`);
        } else {
            li.classList.add(`proximo-${offset}`);
        }

        if (mudouHorario) {
            li.classList.add("mudou-horario");
        }

        lista.appendChild(li);
    }
}

/* ===== ATUALIZA A CADA 10s ===== */
setInterval(atualizarQuadro, 10000);
carregarMedicamentos();
