const BASE_URL = "http://localhost:3333/api";

const formCadastro = document.getElementById("item-form");

const resetForm = () => {
  document.getElementById("titulo").value = "";
  document.getElementById("descricao").value = "";
};

const showMessage = (text, cor) => {
  const message = document.getElementById('message')
  message.textContent = text
  message.style.color = cor
}

const handleFormSubmit = async(event) => {
  event.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const descricao = document.getElementById("descricao").value;

  const item = {
    titulo: titulo,
    descricao: descricao
  }

  await sendItem(item);

};
const sendItem = async (objItem) => {
    try {
        const res = await fetch(`${BASE_URL}/tarefas`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                connection: 'close'
            },
            body: JSON.stringify(objItem)
        })

        if(!res.ok){
            const error = await res.json().catch(() => {
              message: "Erro Desconhecido"
            })

            console.log(error)

            if(error.messages && Array.isArray(error.messages)){
              const errorContainer = document.getElementById('message')
              errorContainer.innerHTML = ''

              error.messages.forEach((err) => {
                const errorMessage = document.createElement('p')
                errorMessage.textContent = `${err.field}: ${err.error}`
                errorMessage.style.color = 'red'
                errorContainer.appendChild(errorMessage)
              })
            }else{
              showMessage(`Erro: ${error.messages || 'Erro Inesperado'}`, 'red')
            }
            return
        }
        showMessage('Item Cadastrado com sucesso!', 'green')
        resetForm()
    } catch (error) {
        console.log(error)
    }
};

const listItems = async () => {
  try {
    const res = await fetch(`${BASE_URL}/tarefas`,{
      method: 'GET',
      headers: {
        "Content-Type":"application/json"

      }
    });

    if(!res.ok){
    const error = document.getElementById('message')
    error.textContent = "Não existe nenhum item cadastrado"
    error.style.color = 'red'
    document.getElementById("item-list").textContent = ''
    return
  }
  const items = await res.json()
  console.log(items);
  showItems(items)
  } catch (error) {
    console.log(error);
  }
};

const showItems = async (arrayItems) => {
  const itemList = document.getElementById('item-list')
  itemList.innerHTML = ''

  const cards = arrayItems((item) => `  
    <article class="item-card">
            <header class="item-card__header">
              <h1 class="item-card__title">${item.titulo}</h1>
            </header>

            <section class="item-card__body">
              <p class="item-card__description">
                ${item.descricao}
              </p>
            </section>

            <footer class="item-card__footer">
              <button onclick="editItem(${item.id})" class="item-card__button item-card__button--edit">
                Editar
              </button>
              <button onclick="deleteItem(${item.id})" class="item-card__button item-card__button--delete">
                Excluir
              </button>
            </footer>
          </article>
  `).join("")
  itemList.innerHTML = cards
};

const deleteItem = async (objId) => {
  try {
    const res = await fetch(`${BASE_URL}/tarefas/${objId}`, {
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

const editItem = (objId) => {
  const url = `pages/item.html?id=${objId}`
  window.location = url
}

formCadastro.addEventListener("submit", handleFormSubmit);
document.addEventListener("DOMContentLoaded", listItems);
