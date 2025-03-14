//1º URL PARA EDITAR
const BASE_URL = 'http://localhost:3333/api';

//2º Função para pegar o id da URL
const pegarParametroDaUrl = (name) => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(name)
}
const itemId = pegarParametroDaUrl('id')

//3º Função para listar o item específico
const buscarItem = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/tarefas/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        })

        if(!res.ok){
            console.log("Erro ao buscar item")
            return
        }
        const item = await res.json()
        mostrarItem(item)
    } catch (error) {
        console.log(error)
    }
}

//4º Função para mostrar o item no formulário
const mostrarItem = (objItem) => {
    const formConteiner = document.querySelector('#form-container')
    console.log(formConteiner)
    formConteiner.innerHTML = `
            <form id="item-form" action="#" method="post">
            <h2 class="form-container__title">Cadastro de Atividade</h2>
            <input
              type="text"
              name="titulo"
              id="titulo"
              class="item-form__input"
              placeholder="Digite a atividade"
              value="${objItem.titulo}"
            />
            <input
              type="text"
              name="status"
              id="status"
              class="item-form__input"
              placeholder="Digite o status da atividade"
              value="${objItem.status}"
            />
            <textarea
              id="descricao"
              name="descricao"
              class="item-form__textarea"
              placeholder="Descreva sua atividade"
            >${objItem.descricao}</textarea>
            <button type="submit" class="item-form__button">Cadastrar</button>
          </form>
    `
    const form = document.getElementById("item-form")
    form.addEventListener('submit', (event)=> {
        event.preventDefault();
        atualizarItem(objItem.id)
    })
}

//5º Atualizar o item
const atualizarItem = async (id) => {
    const titulo = document.getElementById('titulo').value
    const descricao = document.getElementById('descricao').value

    try {
        const res = await fetch(`${BASE_URL}/tarefas/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({titulo, descricao})
        })
        if(!res.ok){
            console.log("Erro ao editar")
            return
        }
    } catch (error) {
        console.log(error)
    }
}

//6º Evento para quando abrir a página buscar o item selecionado
document.addEventListener("DOMContentLoaded", () => {
    if(itemId){
        //Mostrar os itens
        buscarItem(itemId)
    } else {
        console.log("Id da atividade não encontrado")
    }
})
