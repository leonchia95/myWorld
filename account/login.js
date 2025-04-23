document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        // Check if username and password match stored data
        const storedUser = JSON.parse(localStorage.getItem('user'));

        if (storedUser && storedUser.username === username && storedUser.password === password) {
            alert("登录成功!");
            localStorage.setItem('loggedIn', true);
            window.location.href = 'index.html'; // Redirect to the index page
        } else {
            alert("无效的用户名或密码!");
        }
    });
});