const API_URL = "http://localhost:3000";

const gridProdutos = document.getElementById("grid-produtos");
const form = document.getElementById("form-inscricao");
const emailInput = document.getElementById("email");
const mensagem = document.getElementById("mensagem");

async function carregarProdutos() {
  try {
    const response = await fetch(`${API_URL}/api/produtos`);
    
    if (!response.ok) {
      throw new Error('Erro na resposta do servidor');
    }
    
    const produtos = await response.json();

    gridProdutos.innerHTML = "";
    produtos.forEach(produto => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <img src="${produto.imagem}" alt="${produto.nome}">
        <div class="card-content">
          <h3>${produto.nome}</h3>
          <p>${produto.descricao}</p>
          <p class="price">R$ ${produto.preco.toFixed(2)}</p>
          <button>Detalhes</button>
        </div>
      `;
      gridProdutos.appendChild(card);
    });

  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);
    gridProdutos.innerHTML = "<p>Erro ao carregar produtos. Verifique se o servidor está rodando.</p>";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  mensagem.textContent = "";

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    mensagem.textContent = "Por favor, digite seu e-mail.";
    mensagem.style.color = "red";
    return;
  }
  if (!regexEmail.test(email)) {
    mensagem.textContent = "Digite um e-mail válido.";
    mensagem.style.color = "red";
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/api/inscricao`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email_inscrito: email
      })
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      mensagem.textContent = dados.mensagem;
      mensagem.style.color = "green";
      form.reset();
    } else {
      mensagem.textContent = dados.mensagem || "Erro ao inscrever.";
      mensagem.style.color = "red";
    }

  } catch (erro) {
    console.error("Erro na inscrição:", erro);
    mensagem.textContent = "Erro de conexão com o servidor.";
    mensagem.style.color = "red";
  }
});

carregarProdutos();
