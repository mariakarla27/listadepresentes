// Elementos principais
const ordenarSelect = document.getElementById("ordenar");
const giftContainer = document.getElementById("giftContainer");
const cartButton = document.getElementById("cartButton");
const cartSection = document.getElementById("cartSection");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const addMoreBtn = document.getElementById("addMore");

let cart = [];


document.addEventListener("DOMContentLoaded", () => {
  const savedCart = localStorage.getItem("carrinho");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    atualizarCarrinho();

    if (cart.length > 0) {
      cartSection.classList.remove("hidden");
      giftContainer.classList.add("hidden");
      document.querySelector(".top-bar").style.display = "none";
    }
  }
});


function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(cart));
}


ordenarSelect.addEventListener("change", () => {
  const cards = Array.from(giftContainer.children);
  if (ordenarSelect.value === "az") {
    cards.sort((a, b) =>
      a.querySelector(".gift-title").textContent.localeCompare(
        b.querySelector(".gift-title").textContent
      )
    );
  } else if (ordenarSelect.value === "preco") {
    cards.sort(
      (b,a) => parseFloat(b.dataset.preco) - parseFloat(a.dataset.preco)
    );
  }
  giftContainer.innerHTML = "";
  cards.forEach((c) => giftContainer.appendChild(c));
});


document.querySelectorAll(".gift-button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    const title = card.querySelector(".gift-title").textContent;
    const price = card.querySelector(".gift-price").textContent;
    const image = card.querySelector(".gift-image").src;

    cart.push({ title, price, image });
    atualizarCarrinho();
    salvarCarrinho();

    cartSection.classList.remove("hidden");
    giftContainer.classList.add("hidden");
    document.querySelector(".top-bar").style.display = "none";
  });
});


function atualizarCarrinho() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const precoNum = parseFloat(item.price.replace(/[R$\s.]/g, "").replace(",", "."));
    total += precoNum;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div class="cart-item">
          <img src="${item.image}">
          <div>
            <div class="cart-item-title">${item.title}</div>
            <div class="remove" data-index="${index}">Remover</div>
          </div>
        </div>
      </td>
      <td>R$ ${precoNum.toFixed(2).replace(".", ",")}</td>
    `;
    cartItems.appendChild(tr);
  });

  cartTotal.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
  cartButton.textContent = cart.length
    ? `🛒 Carrinho (${cart.length})`
    : "🛒 Carrinho vazio";
}


cartItems.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove")) {
    const index = e.target.dataset.index;
    cart.splice(index, 1);
    atualizarCarrinho();
    salvarCarrinho();

    if (cart.length === 0) {
      localStorage.removeItem("carrinho");
      cartSection.classList.add("hidden");
      giftContainer.classList.remove("hidden");
      document.querySelector(".top-bar").style.display = "flex";
    }
  }
});

// --- Adicionar mais itens ---
addMoreBtn.addEventListener("click", () => {
  cartSection.classList.add("hidden");
  giftContainer.classList.remove("hidden");
  document.querySelector(".top-bar").style.display = "flex";
});
