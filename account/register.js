document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const regUsername = document.getElementById("regUsername").value.trim();
        const regPassword = document.getElementById("regPassword").value.trim();

        if (regUsername && regPassword) {
            const user = {
                username: regUsername,
                password: regPassword
            };

            // Save the user credentials in localStorage
            localStorage.setItem('user', JSON.stringify(user));
            alert("注册成功!");
            window.location.href = 'login.html'; // Redirect to the login page
        } else {
            alert("请填写所有字段!");
        }
    });
});