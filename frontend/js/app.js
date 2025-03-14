const BASE_URL = "http://localhost:3333/api";

// Obtém os elementos do DOM de forma segura
const formCadastro = document.getElementById("item-form");

// Funções utilitárias
const resetForm = () => {
  const titulo = document.getElementById("titulo");
  const descricao = document.getElementById("descricao");
  if (titulo) titulo.value = "";
  if (descricao) descricao.value = "";
};

const showMessage = (text, color = 'green') => {
  const message = document.getElementById('message');
  if (message) {
    message.textContent = text;
    message.style.color = color;
  }
};

// Início do cadastro do item
const handleFormSubmit = async (event) => {
  event.preventDefault();

  const titulo = document.getElementById("titulo");
  const descricao = document.getElementById("descricao");

  if (!titulo || !descricao) {
    showMessage("Título ou descrição não encontrados", "red");
    return;
  }

  const item = {
    titulo: titulo.value,
    descricao: descricao.value
  };

  await sendItem(item);
};

// Enviar itens para a API
const sendItem = async (objItem) => {
  try {
    const res = await fetch(`${BASE_URL}/tarefas`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        connection: 'close'
      },
      body: JSON.stringify(objItem)
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Erro Desconhecido" }));
      if (error.messages && Array.isArray(error.messages)) {
        const errorContainer = document.getElementById('message');
        if (errorContainer) {
          errorContainer.innerHTML = '';
          error.messages.forEach((err) => {
            const errorMessage = document.createElement('p');
            errorMessage.textContent = `${err.field}: ${err.error}`;
            errorMessage.style.color = 'red';
            errorContainer.appendChild(errorMessage);
          });
        }
      } else {
        showMessage(`Erro: ${error.messages || 'Erro Inesperado'}`, 'red');
      }
      return;
    }

    showMessage('Item cadastrado com sucesso');
    resetForm();
    listItems();
  } catch (error) {
    console.error(error);
  }
};

// Buscar itens da API
const listItems = async () => {
  try {
    const res = await fetch(`${BASE_URL}/tarefas`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      showMessage("Não existe nenhum item cadastrado", "red");
      const itemList = document.getElementById("item-list");
      if (itemList) itemList.textContent = "";
      return;
    }

    const response = await res.json();
    if (!response.data || !Array.isArray(response.data)) {
      console.error("A propriedade 'data' não é um array:", response);
      showMessage("Erro na estrutura dos dados recebidos", "red");
      return;
    }

    showItems(response.data);
  } catch (error) {
    console.error(error);
  }
};

// Mostrar itens na tela
const showItems = (arrayItems) => {
  const itemList = document.getElementById('item-list');
  if (!itemList) return;

  itemList.innerHTML = '';

  if (!Array.isArray(arrayItems)) {
    console.error("O argumento fornecido para showItems não é um array:", arrayItems);  
    return;
  }

  const cards = arrayItems.map((tarefas) => `
    <article class="item-card">
      <header class="item-card__header">
        <h1 class="item-card__title">${tarefas.titulo}</h1>
      </header>
      <section class="item-card__body">
        <p class="item-card__description">${tarefas.descricao}</p>
      </section>
      <footer class="item-card__footer">
        <button onclick="editItem('${tarefas.id}')" class="item-card__button item-card__button--edit">Editar</button>
        <button onclick="deleteItem('${tarefas.id}')" class="item-card__button item-card__button--delete">Excluir</button>
      </footer>
    </article>
  `).join("");

  itemList.innerHTML = cards;
};

// Deletar item
const deleteItem = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/tarefas/${id}`, {
      method: 'DELETE'
    })

    if(!res.ok){
      console.log('Erro ao excluir')
      return
    }
  } catch (error) {
    console.log(error)

  }
}


// Editar item
const editItem = (id) => {
  const url = `pages/item.html?id=${id}`;
  window.location = url;
};

// Eventos de interação
formCadastro.addEventListener("submit", handleFormSubmit);
document.addEventListener("DOMContentLoaded", listItems);