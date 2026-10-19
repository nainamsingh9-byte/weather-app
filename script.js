const products = [
    {
        id: 1,
        name: "Floral Summer Dress",
        category: "Women",
        price: 799,
        description: "Light and comfortable",
        image:
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Classic White Shirt",
        category: "Men",
        price: 599,
        description: "Perfect for every day",
        image:
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Elegant Beige Outfit",
        category: "Women",
        price: 999,
        description: "Effortless everyday style",
        image:
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Casual Denim Jacket",
        category: "Men",
        price: 1199,
        description: "A timeless wardrobe piece",
        image:
            "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Chic Summer Top",
        category: "Women",
        price: 499,
        description: "Easy and versatile",
        image:
            "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Smart Casual Blazer",
        category: "Men",
        price: 1499,
        description: "Sharp and sophisticated",
        image:
            "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "Everyday Casual Tee",
        category: "Men",
        price: 399,
        description: "Comfort meets style",
        image:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        name: "Minimal Fashion Look",
        category: "Women",
        price: 899,
        description: "Modern and elegant",
        image:
            "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80"
    }
];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const emptyMessage = document.getElementById("emptyMessage");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

let activeCategory = "All";
let cart = [];

// Format price in Indian Rupees
function money(amount) {
    return "₹" + amount.toLocaleString("en-IN");
}

// Display products
function showProducts() {
    const query = (searchInput?.value || "")
        .trim()
        .toLowerCase();

    const filtered = products.filter(product => {
        const matchesCategory =
            activeCategory === "All" ||
            product.category === activeCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
    });

    productGrid.innerHTML = filtered.map(product => `
        <article class="product-card">

            <div class="product-image">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy">

                <span class="product-category">
                    ${product.category}
                </span>
            </div>

            <div class="product-info">
                <h3>${product.name}</h3>

                <p class="description">
                    ${product.description}
                </p>

                <div class="product-bottom">
                    <span class="price">
                        ${money(product.price)}
                    </span>

                    <button
                        class="add-button"
                        data-add="${product.id}"
                    >
                        + Add to Cart
                    </button>
                </div>
            </div>

        </article>
    `).join("");

    emptyMessage.hidden = filtered.length !== 0;
}

// Add product to cart
function addToCart(id) {
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: id,
            quantity: 1
        });
    }

    showCart();
}

// Remove product completely from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    showCart();
}

// Increase or decrease product quantity
function changeQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (!item) return;
    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(id);
    } else {
        showCart();
    }
}

// Display cart items and total price
function showCart() {
    const count = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const total = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);

        return sum + product.price * item.quantity;
    }, 0);

    cartCount.textContent = count;
    cartTotal.textContent = money(total);

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <p style="font-size: 35px;">🛍️</p>
                <p>Your bag is empty.</p>
                <p>Add something you love!</p>
            </div>
        `;

        return;
    }

    cartItems.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);

        return `
            <div class="cart-item">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div>
                    <h3>${product.name}</h3>

                    <p>
                        ${money(product.price * item.quantity)}
                    </p>

                    <div class="quantity-controls">

                        <button
                            data-minus="${item.id}"
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>

                        <span>${item.quantity}</span>

                        <button
                            data-plus="${item.id}"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>

                        <button
                            class="remove-button"
                            data-remove="${item.id}"
                        >
                            Remove
                        </button>

                    </div>
                </div>

            </div>
        `;
    }).join("");
}

// Open cart
function openCart() {
    document.body.classList.add("cart-open");
}

// Close cart
function closeCart() {
    document.body.classList.remove("cart-open");
}

// Add-to-cart button event
productGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");

    if (button) {
        addToCart(Number(button.dataset.add));
    }
});

// Cart quantity and remove button events
cartItems.addEventListener("click", event => {
    const minus = event.target.closest("[data-minus]");
    const plus = event.target.closest("[data-plus]");
    const remove = event.target.closest("[data-remove]");

    if (minus) {
        changeQuantity(Number(minus.dataset.minus), -1);
    }

    if (plus) {
        changeQuantity(Number(plus.dataset.plus), 1);
    }

    if (remove) {
        removeFromCart(Number(remove.dataset.remove));
    }
});

// Search products
searchInput.addEventListener("input", showProducts);

// Category filter buttons
document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        activeCategory = button.dataset.filter;

        document.querySelectorAll(".filter").forEach(filter => {
            filter.classList.toggle(
                "active",
                filter === button
            );
        });

        showProducts();
    });
});

// Navigation category links
document.querySelectorAll("nav [data-filter]").forEach(link => {
    link.addEventListener("click", () => {
        activeCategory = link.dataset.filter;

        document.querySelectorAll(".filter").forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.filter === activeCategory
            );
        });

        showProducts();
    });
});

// Open cart button
document.getElementById("cartToggle")
    .addEventListener("click", openCart);

// Close cart button
document.getElementById("closeCart")
    .addEventListener("click", closeCart);

// Close cart by clicking overlay
document.getElementById("cartOverlay")
    ?.addEventListener("click", closeCart);

// Checkout button
document.getElementById("checkoutButton")
    .addEventListener("click", () => {
        if (cart.length === 0) {
            alert(
                "Your cart is empty! Please add a product first."
            );

            return;
        }

        const total = cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.id);

            return sum + product.price * item.quantity;
        }, 0);

        alert(
            "Demo order successful!\n" +
            "Total: " + money(total) +
            "\nThis is a demo only. No payment was taken."
        );

        cart = [];

        showCart();
        closeCart();
    });

// Initial display
showProducts();
showCart();