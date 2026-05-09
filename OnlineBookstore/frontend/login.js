const API = "http://127.0.0.1:8082";

function login() {

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();

    const userError =
        document.getElementById("userError");

    const passError =
        document.getElementById("passError");

    const loginError =
        document.getElementById("loginError");

    userError.innerText = "";
    passError.innerText = "";
    loginError.innerText = "";

    let valid = true;

    if (username === "") {
        userError.innerText = "Username is required";
        valid = false;
    }

    else if (username.length < 3) {
        userError.innerText =
            "Minimum 3 characters required";
        valid = false;
    }

    if (password === "") {
        passError.innerText = "Password is required";
        valid = false;
    }

    else if (password.length < 4) {
        passError.innerText =
            "Minimum 4 characters required";
        valid = false;
    }

    if (!valid) return;

    fetch(API + "/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            username: username,
            password: password
        })

    })

    .then(response => response.json())

    .then(data => {

        if (data.status === "success") {

            alert(data.message);

            sessionStorage.setItem(
                "loggedInUser",
                username
            );

            window.location.href = "index.html";
        }

        else {
            loginError.innerText = data.message;
        }

    })

    .catch(error => {

        console.error(error);

        loginError.innerText = "Server error";
    });
}