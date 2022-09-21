let allProducts = [];

const navigateToSingleProductPage = ({ dataset }) => {
    window.location.href = `./product.html?productId=${dataset.productid}`;
};

// Home Page

(async () => {
    const res = await fetch("https://dummyjson.com/products");
    const { products } = await res.json();
    allProducts = products;
    console.log("allProducts", allProducts);
})();

const embedProducts = async () => {
    try {
        const res = await fetch("https://dummyjson.com/products");
        const { products } = await res.json();
        allProducts = products;
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const productCards = products.map((product) => {
            return `<div class="productCard">
                    <div class="productImage">
                        <img
                            src="${product.images[0]}"
                            alt="${product.name}"
                        />
                    </div>
                    <div class="productDetails">
                        <h3>${product.title}</h3>
                        <p>${product.description}</p>
                        <p>$ ${product.price}</p>
                    </div>
                    <div class="productActions">
                        <button
                            style="display: ${
                                cart.find((itemId) => itemId === product.id)
                                    ? "none"
                                    : "block"
                            }"       
                        id="addToCartBtn_${
                            product.id
                        }" class="addToCartBtn" onclick="addToCart(${
                product.id
            })">Add to Cart</button>

                        <button style="display: ${
                            cart.find((itemId) => itemId === product.id)
                                ? "block"
                                : "none"
                        }"  id="removeFromCartBtn_${
                product.id
            }" class="removeFromCartBtn" onclick="removeFromCart(${
                product.id
            })">Remove From Cart</button>
                        <button class="buyNowBtn">Buy Now</button>
                    </div>
                </div>`;
        });
        const productsWrapper = document.getElementById("productsWrapper");
        console.log(products);
        productsWrapper.innerHTML = productCards.join("");
    } catch (error) {
        console.log("[embedProducts] error", error);
    }
};

const searchProducts = (e) => {
    const { value } = e.target;
    console.log(value);
    if (!value) {
        const searchListDropDown =
            document.getElementById("searchListDropDown");
        searchListDropDown.style.display = "none";
        return;
    }
    const filteredProducts = allProducts.filter((product) => {
        return product.title.toLowerCase().includes(value.toLowerCase());
    });
    console.log(filteredProducts);
    const searchListDropDown = document.getElementById("searchListDropDown");
    searchListDropDown.style.display = "block";
    const searchList = filteredProducts.map((product) => {
        return `<div class="searchItem" data-productid="${product.id}" onclick="navigateToSingleProductPage(this)" >
        <div class="searchItemImgWrapper">
             <img src="${product.thumbnail}" alt="${product.title}" />
        </div>
                <div>${product.title}</div>
        </div>`;
    });
    searchListDropDown.innerHTML = searchList.join("");
};

const hideSearchListDropDownOnBlur = () => {
    const searchListDropDown = document.getElementById("searchListDropDown");
    searchListDropDown.style.display = "none";
};

document.addEventListener("click", hideSearchListDropDownOnBlur);

const init = () => {
    const cartCount = document.getElementById("cartCount");
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cartCount.innerHTML = cart.length;
    }
    if (window.location.pathname === "/index.html") {
        embedProducts();
    }
    console.log("allProducts", allProducts);
    const searchField = document.getElementById("searchField");
    console.log(searchField);
    searchField.onkeydown = searchProducts;
};

init();

// Single Product Page

const getProductDetails = async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get("productId");
        const res = await fetch(`https://dummyjson.com/products/${productId}`);
        const product = await res.json();
        console.log(product);
        const productDetails = document.getElementById("productDetails");
        productDetails.innerHTML = `
        <div class="productWrapper">

            <div class="carouselWrapper">
                <div class="carousel">
                    ${
                        product.images &&
                        product.images.map((image) => {
                            return `<img src="${image}" alt="${product.title}" />`;
                        })
                    }
                </div>
                <div class="carouselButtons">
                    <button id="prevBtn" class="carouselButton"><</button>
                    <button id="nextBtn" class="carouselButton">></button>
                </div>
            </div>

            <div class="productDetails">
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <p>$ ${product.price}</p>
            </div>

        </div>         
        `;

        const carousel = document.querySelector(".carousel");
        const carouselImages = document.querySelectorAll(".carousel img");
        const prevBtn = document.querySelector("#prevBtn");
        const nextBtn = document.querySelector("#nextBtn");

        let counter = 1;
        const size = carouselImages[0].clientWidth;
        console.log(size);

        carousel.style.transform = "translateX(" + -size * counter + "px)";

        nextBtn.addEventListener("click", () => {
            if (counter >= carouselImages.length - 1) return;
            carousel.style.transition = "transform 0.4s ease-in-out";
            counter++;
            carousel.style.transform = "translateX(" + -size * counter + "px)";
        });

        prevBtn.addEventListener("click", () => {
            if (counter <= 0) return;
            carousel.style.transition = "transform 0.4s ease-in-out";
            counter--;
            carousel.style.transform = "translateX(" + -size * counter + "px)";
        });

        carousel.addEventListener("transitionend", () => {
            if (carouselImages[counter].id === "lastClone") {
                carousel.style.transition = "none";
                counter = carouselImages.length - 2;
                carousel.style.transform =
                    "translateX(" + -size * counter + "px)";
            }
            if (carouselImages[counter].id === "firstClone") {
                carousel.style.transition = "none";
                counter = carouselImages.length - counter;
                carousel.style.transform =
                    "translateX(" + -size * counter + "px)";
            }
        });
    } catch (error) {
        console.log("[getProductDetails] error", error);
    }
};

if (window.location.pathname.includes("product.html")) {
    getProductDetails();
}

const addToCart = (productId) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    const cartCount = document.getElementById("cartCount");
    cartCount.innerHTML = cart.length;
    const addToCartBtn = document.getElementById(`addToCartBtn_${productId}`);
    addToCartBtn.style.display = "none";
    const removeFromCartBtn = document.getElementById(
        `removeFromCartBtn_${productId}`
    );
    removeFromCartBtn.style.display = "block";
    console.log("added to cart:", productId);
};

const removeFromCart = (productId) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.filter((id) => id !== productId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    const cartCount = document.getElementById("cartCount");
    cartCount.innerHTML = updatedCart.length;
    const addToCartBtn = document.getElementById(`addToCartBtn_${productId}`);
    addToCartBtn.style.display = "block";
    const removeFromCartBtn = document.getElementById(
        `removeFromCartBtn_${productId}`
    );
    removeFromCartBtn.style.display = "none";
    console.log("removed from cart:", productId);
};

// cart page

const removeFromCartPage = (productId) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.filter((id) => id !== productId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    const cartItem = document.getElementById(`cartItem_${productId}`);
    cartItem.remove();
    console.log("removed from cart:", productId);
    const cartCount = document.getElementById("cartTotal");
    cartCount.innerHTML = `<div> Total Products: ${
        cart.length - 1
    } items</div>`;
};

const embedCartProducts = async () => {
    try {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const products = await Promise.all(
            cart.map((productId) => {
                return fetch(`https://dummyjson.com/products/${productId}`);
            })
        )
            .then((responses) => {
                return Promise.all(
                    responses.map((response) => {
                        return response.json();
                    })
                );
            })
            .then((products) => {
                return products;
            });

        const cartItemsWrapper = document.getElementById("cartItemsWrapper");
        cartItemsWrapper.innerHTML = products
            .map((product) => {
                return `
                <div class="cartItem" id="cartItem_${product.id}">
                    <div class="cartItemImage">
                        <img src="${product.images[0]}" alt="${product.title}" />
                    </div>
                    <div class="cartItemDetails">
                        <h3>${product.title}</h3>
                        <p>$ ${product.price}</p>
                            <button class="removeFromCart2" onclick="removeFromCartPage(${product.id})">Remove from cart</button>
                    </div>
                </div>
                `;
            })
            .join("");

        const cartCount = document.getElementById("cartTotal");
        cartCount.innerHTML = `<div> Total Products: ${
            products.length
        } items</div>
        <div> Amount To Pay: $ ${products.reduce((acc, product) => {
            return acc + product.price;
        }, 0)}</div>`;
    } catch (error) {
        console.log("[embedCartProducts] error", error);
    }
};

if (window.location.pathname.includes("cart.html")) {
    embedCartProducts();
}
