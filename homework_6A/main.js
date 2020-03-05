if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", JSON.stringify({ items: [] }));
    localStorage.setItem("cartOpen", false);
}

// animate the cart div out from the right
const animateCartIn = () => {
    let position = -340;

    const interval = window.setInterval(function() {
        getCart().style.right = `${position}px`;
        position += 20;
        if (position >= 0) {
            window.clearInterval(interval);
        }
    }, 10);
};

// animate out the cart div to the right
const animateCartOut = () => {
    let position = 0;

    const interval = window.setInterval(function() {
        getCart().style.right = `${position}px`;
        position -= 20;
        if (position <= -380) {
            window.clearInterval(interval);
        }
    }, 10);
};

// update the size of the cart displayed in the nav
const updateCartSize = () => {
    const size = JSON.parse(localStorage.getItem("cart")).items.length;
    document.getElementById("cart-link").innerText = `Cart (${size})`;
};

// remove an element from the cart
const removeFromCart = (elt, obj) => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const items = cart.items;

    let index = 0;
    for (let i = 0; i < items.length; i++) {
        if (items[i].flavor === obj.flavor && items[i].glaze === obj.glaze) {
            index = i;
        }
    }
    items.splice(index, 1);

    cart.items = items;
    localStorage.setItem("cart", JSON.stringify(cart));

    buildCart();
};

// build the cart component if it doesn't exist
const getCart = () => {
    if (!document.getElementById("cart-panel")) {
        const div = document.createElement("div");
        div.id = "cart-panel";

        const title = document.createElement("h2");
        title.innerText = "Your Cart";
        title.id = "cart-title";

        const content = document.createElement("div");
        content.id = "cart-content";

        const checkout = document.createElement("button");
        checkout.id = "cart-checkout";
        checkout.className = "action";
        checkout.innerText = "Checkout";

        div.appendChild(title);
        div.appendChild(content);
        div.appendChild(checkout);

        document.getElementById("content").appendChild(div);
        return div;
    } else {
        return document.getElementById("cart-panel");
    }
};

// create and add the components in the cart
const buildCart = () => {
    const cart = getCart();

    const content = document.getElementById("cart-content");
    content.innerHTML = "";

    const items = JSON.parse(localStorage.getItem("cart")).items;

    // for each item in the cart, create a component in the cart panel
    for (const item of items) {
        // create a component to add to the cart
        const div = document.createElement("div");
        div.className = "cart-product";

        const title = document.createElement("div");
        title.className = "cart-product-title";
        title.innerText = `${item.flavor} - ${item.glaze}`;

        const quantity = document.createElement("div");
        quantity.className = "cart-product-quant";
        quantity.innerText = `Quantity: ${item.quantity}`;

        const closeButton = document.createElement("div");
        closeButton.className = "cart-product-remove";
        closeButton.innerText = "X";
        closeButton.onclick = e => {
            removeFromCart(div, item);
        };

        div.appendChild(title);
        div.appendChild(quantity);
        div.appendChild(closeButton);

        content.appendChild(div);
    }
    updateCartSize();
};

const addToCart = bundle => {
    // open the cart if it isn't already
    if (localStorage.getItem("cartOpen") != "true") {
        animateCartIn();
        localStorage.setItem("cartOpen", true);
    }

    const valSelection = document.getElementById("product-select-quantity");
    const quant = valSelection.options[valSelection.selectedIndex].value;
    const glazeSeleciton = document.getElementById("product-select-glaze");
    const glaze = glazeSeleciton.options[glazeSeleciton.selectedIndex].value;

    bundle.quantity = quant;
    bundle.glaze = glaze;

    const currentCart = JSON.parse(localStorage.getItem("cart"));

    let found = false;
    for (const item of currentCart.items) {
        if (item.flavor === bundle.flavor && item.glaze === bundle.glaze) {
            found = true;
            item.quantity = parseInt(item.quantity) + parseInt(quant);
        }
    }

    if (!found) {
        currentCart.items.push(bundle);
    } else {
        buildCart();
    }

    localStorage.setItem("cart", JSON.stringify(currentCart));

    buildCart();
};

const updatePageDisp = price => {
    const valSelection = document.getElementById("product-select-quantity");
    const quant = valSelection.options[valSelection.selectedIndex].value;
    const glazeSeleciton = document.getElementById("product-select-glaze");
    const glaze = glazeSeleciton.options[glazeSeleciton.selectedIndex].value;

    document.getElementById(
        "product-info-display"
    ).innerText = `${quant} ${glaze} - $${price * parseInt(quant)}`;

    document.getElementById("cart-button").className = "action";
};

// provide click functionality for the cart and add to cart buttons
window.addEventListener("DOMContentLoaded", event => {
    // if the cart has already been opened and the page is reloaded, reopen it
    if (localStorage.getItem("cartOpen") == "true") {
        buildCart();
        animateCartIn();
    }

    updateCartSize();

    // cart button
    document.getElementById("cart-link").onclick = () => {
        getCart();

        if (localStorage.getItem("cartOpen") == "true") {
            // close the cart
            animateCartOut();
            localStorage.setItem("cartOpen", false);
        } else {
            // open the cart
            buildCart();
            animateCartIn();
            localStorage.setItem("cartOpen", true);
        }
    };
});
