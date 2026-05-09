window.addEventListener("scroll", function () {

    let navbar = document.querySelector(".navbar");

    navbar.classList.toggle("sticky", window.scrollY > 50);

});