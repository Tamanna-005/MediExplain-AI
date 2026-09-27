document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("register-form");

    const nameInput = document.getElementById("full-name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const termsInput = document.getElementById("terms");

    const nameError = document.getElementById("name-error");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");
    const confirmPasswordError = document.getElementById("confirm-password-error");
    const termsError = document.getElementById("terms-error");

    const strengthFill = document.getElementById("strength-fill");
    const strengthText = document.getElementById("strength-text");


    // -----------------------------
    // Show an error
    // -----------------------------
    function showError(input, errorElement, message) {

        input.classList.remove("input-success");
        input.classList.add("input-error");

        errorElement.textContent = message;
    }


    // -----------------------------
    // Show success
    // -----------------------------
    function showSuccess(input, errorElement) {

        input.classList.remove("input-error");
        input.classList.add("input-success");

        errorElement.textContent = "";
    }


    // -----------------------------
    // Email validation pattern
    // -----------------------------
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    // -----------------------------
    // Confirm password validation
    // -----------------------------
    function validateConfirmPassword() {

        if (confirmPasswordInput.value === "") {

            showError(
                confirmPasswordInput,
                confirmPasswordError,
                "Please confirm your password."
            );

        } else if (
            passwordInput.value !== confirmPasswordInput.value
        ) {

            showError(
                confirmPasswordInput,
                confirmPasswordError,
                "Passwords do not match."
            );

        } else {

            showSuccess(
                confirmPasswordInput,
                confirmPasswordError
            );
        }
    }


    // -----------------------------
    // Form submission
    // -----------------------------
    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        let isValid = true;


        // -----------------------------
        // Full name
        // -----------------------------
        if (nameInput.value.trim() === "") {

            showError(
                nameInput,
                nameError,
                "Please enter your full name."
            );

            isValid = false;

        } else {

            showSuccess(nameInput, nameError);
        }


        // -----------------------------
        // Email
        // -----------------------------
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


        // -----------------------------
        // Password
        // -----------------------------
        if (passwordInput.value.length < 8) {

            showError(
                passwordInput,
                passwordError,
                "Password must be at least 8 characters."
            );

            isValid = false;

        } else {

            showSuccess(passwordInput, passwordError);
        }


        // -----------------------------
        // Confirm password
        // -----------------------------
        if (confirmPasswordInput.value === "") {

            showError(
                confirmPasswordInput,
                confirmPasswordError,
                "Please confirm your password."
            );

            isValid = false;

        } else if (
            passwordInput.value !== confirmPasswordInput.value
        ) {

            showError(
                confirmPasswordInput,
                confirmPasswordError,
                "Passwords do not match."
            );

            isValid = false;

        } else {

            showSuccess(
                confirmPasswordInput,
                confirmPasswordError
            );
        }


        // -----------------------------
        // Terms and conditions
        // -----------------------------
        if (!termsInput.checked) {

            termsError.textContent =
                "Please accept the terms and conditions.";

            isValid = false;

        } else {

            termsError.textContent = "";
        }


        // -----------------------------
        // Stop if frontend validation fails
        // -----------------------------
        if (!isValid) {
            return;
        }


        // -----------------------------
        // Send registration data
        // to Express backend
        // -----------------------------
        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        fullName: nameInput.value.trim(),
                        email: emailInput.value.trim(),
                        password: passwordInput.value
                    })
                }
            );


            const data = await response.json();


            // -----------------------------
            // Backend returned an error
            // -----------------------------
            if (!response.ok) {

                alert(data.message || "Registration failed.");

                return;
            }


            // -----------------------------
            // Registration successful
            // -----------------------------
            alert("Registration successful!");

            form.reset();

            // Remove success styling
            nameInput.classList.remove("input-success");
            emailInput.classList.remove("input-success");
            passwordInput.classList.remove("input-success");
            confirmPasswordInput.classList.remove("input-success");

            // Reset password strength
            strengthFill.style.width = "0%";
            strengthText.textContent = "Password strength";

            // Go to login page
            window.location.href = "login.html";


        } catch (error) {

            console.error("Registration error:", error);

            alert(
                "Unable to connect to the server. Please make sure the backend is running."
            );
        }

    });


    // -----------------------------
    // Real-time name validation
    // -----------------------------
    nameInput.addEventListener("input", function () {

        if (nameInput.value.trim() === "") {

            showError(
                nameInput,
                nameError,
                "Please enter your full name."
            );

        } else {

            showSuccess(nameInput, nameError);
        }
    });


    // -----------------------------
    // Real-time email validation
    // -----------------------------
    emailInput.addEventListener("input", function () {

        const email = emailInput.value.trim();

        if (email === "") {

            showError(
                emailInput,
                emailError,
                "Please enter your email."
            );

        } else if (!emailPattern.test(email)) {

            showError(
                emailInput,
                emailError,
                "Please enter a valid email address."
            );

        } else {

            showSuccess(emailInput, emailError);
        }
    });


    // -----------------------------
    // Password validation + strength
    // -----------------------------
    passwordInput.addEventListener("input", function () {

        let strength = 0;

        const password = passwordInput.value;


        if (password.length >= 8) {
            strength++;
        }

        if (/[A-Z]/.test(password)) {
            strength++;
        }

        if (/[0-9]/.test(password)) {
            strength++;
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            strength++;
        }


        // Password strength display
        if (strength === 0) {

            strengthFill.style.width = "0%";
            strengthText.textContent = "Password strength";

        } else if (strength === 1) {

            strengthFill.style.width = "25%";
            strengthText.textContent = "Weak password";

        } else if (strength === 2) {

            strengthFill.style.width = "50%";
            strengthText.textContent = "Fair password";

        } else if (strength === 3) {

            strengthFill.style.width = "75%";
            strengthText.textContent = "Good password";

        } else {

            strengthFill.style.width = "100%";
            strengthText.textContent = "Strong password";
        }


        // Password validation
        if (password.length < 8) {

            showError(
                passwordInput,
                passwordError,
                "Password must be at least 8 characters."
            );

        } else {

            showSuccess(passwordInput, passwordError);
        }


        // Recheck confirm password
        if (confirmPasswordInput.value !== "") {

            validateConfirmPassword();
        }
    });


    // -----------------------------
    // Confirm password
    // -----------------------------
    confirmPasswordInput.addEventListener(
        "input",
        validateConfirmPassword
    );


    // -----------------------------
    // Terms checkbox
    // -----------------------------
    termsInput.addEventListener("change", function () {

        if (termsInput.checked) {

            termsError.textContent = "";

        } else {

            termsError.textContent =
                "Please accept the terms and conditions.";
        }
    });

});