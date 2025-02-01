let cartCounter = document.querySelector(".cart_counter");
const cartDOM = document.querySelector(".cart__items");
const totalCount = document.querySelector("#total_counter");
const totalCost = document.querySelector(".total__cost");
const checkOutBtnCost = document.querySelector(".check_out_btn");

const addToCartBtn = document.querySelectorAll(".btn__add__to__cart");

let cartItems = (JSON.parse(localStorage.getItem("cart___items")) || []);

console.log(cartItems);

cartCounter.addEventListener("click", () => {
    cartDOM.classList.toggle("active");
});

checkOutBtnCost.addEventListener("click", () => {
    clearCartItems();
})

// Load the cart from localStorage on page load
window.addEventListener("DOMContentLoaded", () => {
    cartItems.forEach(product => addItemToTheDOM(product));
    calculateTotal();
});

addToCartBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        let parentElement = btn.parentElement;
        const product = {
            id: parentElement.querySelector("#product_id").value,
            name: parentElement.querySelector(".product__name").innerText,
            image: parentElement.querySelector("#image").getAttribute("src"),
            price: parentElement.querySelector(".product__price").innerText.replace("$", ""),
            quantity: 1
        };

        let isInCart = cartItems.some(item => item.id === product.id);

        if (!isInCart) {
            addItemToTheDOM(product);
            cartItems.push(product);
            calculateTotal();
            localStorage.setItem("cart___items", JSON.stringify(cartItems)); // Save to localStorage
        } else {
            alert("Product already in the Cart");
        }
    });
});

function addItemToTheDOM(product) {
    cartDOM.insertAdjacentHTML("afterbegin", `
        <div class="cart__item">
            <input type="hidden" id="product___id" value="${product.id}">
            <img src="${product.image}" alt="" id="product__image">
            <h4 class="product__name">${product.name}</h4>
            <a href="#" class="btn__small" action="decrease">&minus;</a>
            <h4 class="product__quantity">${product.quantity}</h4>
            <a href="#" class="btn__small" action="increase">&plus;</a>
            <span class="product__price">${product.price}</span>
            <a href="#" class="btn__small btn__remove" action="remove">&times;</a>
        </div>
    `);

    // Add event listeners for the newly added item
    const cartDOMItems = cartDOM.querySelectorAll(".cart__item");
    cartDOMItems.forEach(individualItem => {
        if (individualItem.querySelector("#product___id").value === product.id) {
            increaseItem(individualItem, product);
            decreaseItem(individualItem, product);
            removeItem(individualItem, product);
        }
    });
}

function calculateTotal() {
    let total = 0;
    cartItems.forEach(item => {
        total += item.quantity * item.price;
    });

    totalCost.innerText = total.toFixed(2); // Format total cost to 2 decimal places
    totalCount.innerText = cartItems.length;
}

function increaseItem(individualItem, product) {
    individualItem.querySelector("[action='increase']").addEventListener("click", () => {
        cartItems.forEach(cartItem => {
            if (cartItem.id === product.id) {
                individualItem.querySelector(".product__quantity").innerText = ++cartItem.quantity;
                calculateTotal();
                localStorage.setItem("cart___items", JSON.stringify(cartItems)); // Update localStorage
            }
        });
    });
}

function decreaseItem(individualItem, product) {
    individualItem.querySelector("[action='decrease']").addEventListener("click", () => {
        cartItems.forEach(cartItem => {
            if (cartItem.id === product.id) {
                if (cartItem.quantity > 1) {
                    individualItem.querySelector(".product__quantity").innerText = --cartItem.quantity;
                } else {
                    cartItems = cartItems.filter(newElements => newElements.id !== product.id);
                    individualItem.remove();
                }
                calculateTotal();
                localStorage.setItem("cart___items", JSON.stringify(cartItems)); // Update localStorage
            }
        });
    });
}

function removeItem(individualItem, product) {
    individualItem.querySelector("[action='remove']").addEventListener("click", () => {
        cartItems = cartItems.filter(newElements => newElements.id !== product.id);
        individualItem.remove();
        calculateTotal();
        localStorage.setItem("cart___items", JSON.stringify(cartItems)); // Update localStorage
    });
}

function clearCartItems() {
    // Clear localStorage and reset cartItems
    localStorage.removeItem("cart___items");
    cartItems = [];

    // Remove all cart items from the DOM
    const cartDOMItems = document.querySelectorAll(".cart__item");
    cartDOMItems.forEach(item => {
        item.remove(); // Remove each item element
    });

    // Recalculate the total to reset it to 0
    calculateTotal();
}