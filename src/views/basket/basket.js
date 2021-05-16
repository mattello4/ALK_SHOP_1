import $, { data } from "jquery";
export * from "../../layout/card.css";
import axios from "axios";

export const basket = () => {
  const fragment = $(document.createDocumentFragment());
  const h2 = $("<h2>Twoj koszyk</h2>");

  var oFra = document.createDocumentFragment();
  var productContainer = document.createElement("div");
  productContainer.id = "products";
  oFra.appendChild(productContainer);
  oFra.getElementById("products");

  const section = $(`
  <div class="products-container">
    <div class="product-header">
      </div>
      <button id="Add" class="Add btn btn-elegant">Złóż zamówienie</button>
</div>
  `);

  function displayCart() {
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);
    let cartCost = localStorage.getItem("totalCost");

    if (cartItems && productContainer) {
      productContainer.innerHTML = "";
      Object.values(cartItems).map((item) => {
        if (item.Date === undefined) {
          item.Date = "";
        }

        productContainer.innerHTML += `  
        
        <div class="product">
      
        <ion-icon name="trash"></ion-icon>
        <span>${item.name}</span>
      </div>
        <div class="price">${item.price},00</div>
        <div class="total"><span>${item.Date}</span></div>
        <div class="incart">Aktualnie w koszyku masz: <span>${item.inCart} szt.</span></div>
        </div>
        `;
      });

      productContainer.innerHTML += `
        <div class="basketTotalContainer">
            <h4 class="basketTotalTitle">
               Łączny koszt zamówienia: 
            </h4>
            <h4 class="basketTotal">
                $${cartCost},00
            </h4>
      `;
    }
  }

  //delete basket
  document.querySelector("body").addEventListener("click", function (event) {
    if (event.target.matches(".product ion-icon")) {
      let deleteButtons = document.querySelectorAll(".product ion-icon");
      let productName;
      let productNumbers = localStorage.getItem("cartNumbers");
      let cartItems = localStorage.getItem("productsInCart");
      cartItems = JSON.parse(cartItems);
      let cartCost = localStorage.getItem("totalCost");

      for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener("click", () => {
          // console.log(i);
          productName = deleteButtons[i].parentElement.textContent
            .trim()
            .replace(/ /g, " ");
          //console.log(productName);
          //console.log(
          //cartItems[productName].name + " " + cartItems[productName].inCart  );
          localStorage.setItem(
            "cartNumbers",
            productNumbers - cartItems[productName].inCart
          );

          localStorage.setItem(
            "totalCost",
            cartCost -
              cartItems[productName].price * cartItems[productName].inCart
          );

          delete cartItems[productName];
          localStorage.setItem("productsInCart", JSON.stringify(cartItems));

          displayCart();
        });
      }
    }
  });

  function AddOrder() {
    if (sessionStorage.getItem("user") === null) {
      add.hide();
    } else {
      add.show();
    }
  }
  const add = section.find("#Add");
  add.on("click", (event) => {
    ordersave();
  });

  function ordersave() {
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(localStorage.getItem("productsInCart"));

    let element = sessionStorage.getItem("user");
    element = JSON.parse(sessionStorage.getItem("user"));

    Object.values(cartItems).map((item) => {
      const data = {
        name: item.name,
        inCart: item.inCart,
        price: item.price,
        date: item.Date,
        userID: element.id,
      };

      axios.post("http://localhost:3000/orders", data).then(console.log);
    });
    localStorage.clear();
    displayCart();
  }

  AddOrder();
  displayCart();

  fragment.append(h2, section, oFra);

  return fragment;
};
