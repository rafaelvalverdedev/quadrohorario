let scrollIndex = 0;
let totalItens = 0;
let planoGlobal = [];
let ultimoHash = "";

// URLs
const URL_REMOTO = "https://quadrohorario.vercel.app/plano.json";
const URL_LOCAL = "./plano.json";

// ===============================
// CARREGAR PLANO (COM FALLBACK)
// ===============================
async function carregarPlanoSeguro() {
    try {
        const response = await fetch(URL_REMOTO, { cache: "no-store" });
        if (!response.ok) throw new Error("Erro no servidor remoto");


        const texto = await response.text();

        // evita re-render desnecessário
        if (texto === ultimoHash) return null;

        ultimoHash = texto;

        return JSON.parse(texto);

    } catch (erro) {
        console.warn("⚠️ Usando plano local (offline)");

        try {
            const responseLocal = await fetch(URL_LOCAL);
            return await responseLocal.json();
        } catch (e) {
            console.error("Erro ao carregar plano local:", e);
            return null;
        }
    }
}

// ===============================
// CARREGAR LISTA COMPLETA
// ===============================
async function carregarListaCompleta() {
    try {
        const dados = await carregarPlanoSeguro();

        if (!dados) return;

        planoGlobal = dados;

        planoGlobal.sort((a, b) => {
            return horarioParaMinutos(a.horario) - horarioParaMinutos(b.horario);
        });

        totalItens = planoGlobal.length;

        renderizarListaCompleta(planoGlobal);

        if (typeof atualizarQuadroPrincipal === "function") {
            atualizarQuadroPrincipal(planoGlobal);
        }

    } catch (erro) {
        console.error("Erro ao carregar lista completa:", erro);
    }

}

// ===============================
// RENDERIZAÇÃO
// ===============================
function renderizarListaCompleta(lista) {
    const container = document.getElementById("lista-completa");

    if (!lista.length) {
        container.innerHTML = "<p>Sem dados</p>";
        return;
    }

    const fragment = document.createDocumentFragment();

    lista.forEach(item => {
        const card = document.createElement("div");
        card.className = "item-completo";

        card.innerHTML = `
        <div class="item-horario">${item.horario}</div>
        <div class="item-nome">${item.nome}</div>
        <div class="item-tipo">${item.tipo}</div>
    `;

        fragment.appendChild(card);
    });

    container.innerHTML = "";
    container.appendChild(fragment);

}

// ===============================
// BOTÕES DE SCROLL
// ===============================
function configurarBotoes() {
    const btnUp = document.getElementById("btn-up");
    const btnDown = document.getElementById("btn-down");

    const wrapper = document.getElementById("lista-completa-wrapper");
    const lista = document.getElementById("lista-completa");

    btnUp.addEventListener("click", () => {
        scrollIndex--;
        atualizarScroll(wrapper, lista);
    });

    btnDown.addEventListener("click", () => {
        scrollIndex++;
        atualizarScroll(wrapper, lista);
    });

}

// ===============================
// CONTROLE DE SCROLL
// ===============================
function atualizarScroll(wrapper, lista) {
    if (!lista.children.length) return;

    const alturaWrapper = wrapper.clientHeight;
    const alturaLista = lista.scrollHeight;
    const alturaItem = lista.children[0].offsetHeight;

    const maxScroll = Math.max(0, alturaLista - alturaWrapper);

    let deslocamento = scrollIndex * alturaItem;

    if (deslocamento < 0) {
        deslocamento = 0;
        scrollIndex = 0;
    }

    if (deslocamento > maxScroll) {
        deslocamento = maxScroll;
        scrollIndex = Math.floor(maxScroll / alturaItem);
    }

    lista.style.transform = `translateY(-${deslocamento}px)`;

}

// ===============================
// UTIL
// ===============================
function horarioParaMinutos(horario) {
    const [h, m] = horario.split(":").map(Number);
    return h * 60 + m;
}

// ===============================
// INICIALIZAÇÃO
// ===============================
carregarListaCompleta();
configurarBotoes();

// 🔄 Atualiza automaticamente a cada 60 segundos
setInterval(carregarListaCompleta, 60000);
