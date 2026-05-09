const API = "http://127.0.0.1:8082";

let allBooks = [];

if (document.getElementById("welcomeUser")) {

    const user =
        sessionStorage.getItem("loggedInUser");

    document.getElementById("welcomeUser")
        .innerText = "Welcome, " + user;
}

// LOAD BOOKS
if (document.getElementById("books")) {

    fetch(API + "/books")

    .then(response => response.json())

    .then(data => {

        allBooks = data;

        displayBooks(allBooks);
    })

    .catch(error => {
        console.error(error);
    });
}

// DISPLAY BOOKS
function displayBooks(books) {

    let output = "";

    books.forEach(book => {

        output += `

            <div class="book">

                <h3>${book.title}</h3>

                <p>Author: ${book.author}</p>

                <p>Price: ₹${book.price}</p>

                <button onclick="addToCart(${book.id})">
                    Add To Cart
                </button>

            </div>
        `;
    });

    document.getElementById("books").innerHTML =
        output;
}

// SEARCH
function searchBooks() {

    const searchText =
        document.getElementById("searchBar")
        .value
        .toLowerCase();

    const filteredBooks = allBooks.filter(book =>

        book.title.toLowerCase()
        .includes(searchText)

    );

    displayBooks(filteredBooks);
}

// ADD TO CART
function addToCart(id) {

    fetch(API + "/cart/" + id, {

        method: "POST"

    })

    .then(response => response.text())

    .then(message => {

        alert(message);
    })

    .catch(error => {

        console.error(error);

        alert("Failed to add to cart");
    });
}

// LOAD CART
function loadCart() {

    if (document.getElementById("cart")) {

        fetch(API + "/cart")

        .then(response => response.json())

        .then(data => {

            let output = "";

            data.forEach(book => {

                output += `

                    <div class="book">

                        <h3>${book.title}</h3>

                        <p>Author: ${book.author}</p>

                        <p>Price: ₹${book.price}</p>

                        <button
                            onclick="removeFromCart(${book.id})">

                            Remove

                        </button>

                    </div>
                `;
            });

            if (data.length === 0) {

                output = `
                    <h3 style="color:white;">
                        Your cart is empty
                    </h3>
                `;
            }

            document.getElementById("cart").innerHTML =
                output;
        });

        // TOTAL PRICE
        fetch(API + "/cart/total")

        .then(response => response.text())

        .then(total => {

            document.getElementById("totalPrice")
                .innerHTML =
                "Total Price: ₹" + total;
        });
    }
}

// REMOVE ITEM
function removeFromCart(id) {

    fetch(API + "/cart/" + id, {

        method: "DELETE"

    })

    .then(response => response.text())

    .then(message => {

        alert(message);

        loadCart();
    });
}

// CLEAR CART
function clearCart() {

    fetch(API + "/cart/clear", {

        method: "DELETE"

    })

    .then(response => response.text())

    .then(message => {

        alert(message);

        loadCart();
    });
}

// CHECKOUT
function checkout() {

    fetch(API + "/checkout", {

        method: "POST"

    })

    .then(response => response.text())

    .then(message => {

        alert(message);

        loadCart();

        window.location.href = "index.html";
    });
}

// LOGOUT
function logout() {

    sessionStorage.removeItem("loggedInUser");

    window.location.href = "login.html";
}

loadCart();