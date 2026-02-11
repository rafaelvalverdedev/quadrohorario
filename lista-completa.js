/* ===================================== */
/* ===== LISTAGEM COMPLETA DIREITA ===== */
/* ===================================== */

let scrollIndex = 0;
let totalItens = 0;

async function carregarListaCompleta() {
    try {
        const response = await fetch("./plano.json");
        let dados = await response.json();

        dados.sort((a, b) => {
            return horarioParaMinutos(a.horario) - horarioParaMinutos(b.horario);
        });

        totalItens = dados.length;
        renderizarListaCompleta(dados);
        configurarBotoes();

    } catch (erro) {
        console.error("Erro ao carregar lista completa:", erro);
    }
}

function renderizarListaCompleta(lista) {

    const container = document.getElementById("lista-completa");
    container.innerHTML = "";

    lista.forEach(item => {

        const card = document.createElement("div");
        card.className = "item-completo";

        card.innerHTML = `
            <div class="item-horario">${item.horario}</div>
            <div class="item-nome">${item.nome}</div>
            <div class="item-tipo">${item.tipo}</div>
        `;

        container.appendChild(card);
    });
}

function configurarBotoes() {

    const btnUp = document.getElementById("btn-up");
    const btnDown = document.getElementById("btn-down");

    const wrapper = document.getElementById("lista-completa-wrapper");
    const lista = document.getElementById("lista-completa");

    btnUp.addEventListener("click", () => {
        scrollIndex -= 1;
        atualizarScroll(wrapper, lista);
    });

    btnDown.addEventListener("click", () => {
        scrollIndex += 1;
        atualizarScroll(wrapper, lista);
    });
}

function atualizarScroll(wrapper, lista) {

    const alturaWrapper = wrapper.clientHeight;
    const alturaLista = lista.scrollHeight;

    const alturaItem = lista.querySelector(".item-completo")?.offsetHeight || 45;

    const maxScroll = Math.max(0, alturaLista - alturaWrapper);

    let deslocamento = scrollIndex * alturaItem;

    // 🔒 trava superior
    if (deslocamento < 0) {
        deslocamento = 0;
        scrollIndex = 0;
    }

    // 🔒 trava inferior
    if (deslocamento > maxScroll) {
        deslocamento = maxScroll;
        scrollIndex = Math.floor(maxScroll / alturaItem);
    }

    lista.style.transform = `translateY(-${deslocamento}px)`;
}

function horarioParaMinutos(horario) {
    const [h, m] = horario.split(":").map(Number);
    return h * 60 + m;
}

carregarListaCompleta();
