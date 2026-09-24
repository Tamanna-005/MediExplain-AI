document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("login-form");

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");


    function showError(input, errorElement, message) {

        input.classList.remove("input-success");
        input.classList.add("input-error");

        errorElement.textContent = message;
    }


    function showSuccess(input, errorElement) {

        input.classList.remove("input-error");
        input.classList.add("input-success");

        errorElement.textContent = "";
    }


    form.addEventListener("submit", function (event) {

        event.preventDefault();

        let isValid = true;


        // Validate email

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailInput.value.trim() === "") {

            showError(
                emailInput,
                emailError,
                "Please enter your email."
            );

            isValid = false;

        } else if (!emailPattern.test(emailInput.value.trim())) {

            showError(
                emailInput,
                emailError,
                "Please enter a valid email address."
            );

            isValid = false;

        } else {

            showSuccess(emailInput, emailError);
        }


        // Validate password

        if (passwordInput.value === "") {

            showError(
                passwordInput,
                passwordError,
                "Please enter your password."
            );

            isValid = false;

        } else {

            showSuccess(passwordInput, passwordError);
        }


        // Temporary success

       if (isValid) {

    window.location.href = "dashboard.html";

}

    });


    // Email real-time validation

    emailInput.addEventListener("input", function () {

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailInput.value.trim() === "") {

            showError(
                emailInput,
                emailError,
                "Please enter your email."
            );

        } else if (!emailPattern.test(emailInput.value.trim())) {

            showError(
                emailInput,
                emailError,
                "Please enter a valid email address."
            );

        } else {

            showSuccess(emailInput, emailError);
        }

    });


    // Password real-time validation

    passwordInput.addEventListener("input", function () {

        if (passwordInput.value === "") {

            showError(
                passwordInput,
                passwordError,
                "Please enter your password."
            );

        } else {

            showSuccess(passwordInput, passwordError);
        }

    });

});