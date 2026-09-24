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


    // Show an error
    function showError(input, errorElement, message) {
        input.classList.remove("input-success");
        input.classList.add("input-error");
        errorElement.textContent = message;
    }


    // Show success
    function showSuccess(input, errorElement) {
        input.classList.remove("input-error");
        input.classList.add("input-success");
        errorElement.textContent = "";
    }


    // Validate the complete form
    form.addEventListener("submit", function (event) {

        event.preventDefault();

        let isValid = true;


        // Full name
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


        // Email
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


        // Password
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


        // Confirm password
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


        // Terms checkbox
        if (!termsInput.checked) {

            termsError.textContent =
                "Please accept the terms and conditions.";

            isValid = false;

        } else {

            termsError.textContent = "";
        }


        // If everything is valid
        if (isValid) {

            alert("Registration form is valid!");

            form.reset();

            nameInput.classList.remove("input-success");
            emailInput.classList.remove("input-success");
            passwordInput.classList.remove("input-success");
            confirmPasswordInput.classList.remove("input-success");
        }
    });


    // Real-time name validation
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


    // Real-time email validation
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


    // Real-time password validation
    passwordInput.addEventListener("input", function () {

        let strength = 0;

if (passwordInput.value.length >= 8) {
    strength++;
}

if (/[A-Z]/.test(passwordInput.value)) {
    strength++;
}

if (/[0-9]/.test(passwordInput.value)) {
    strength++;
}

if (/[^A-Za-z0-9]/.test(passwordInput.value)) {
    strength++;
}

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

        if (passwordInput.value.length < 8) {

            showError(
                passwordInput,
                passwordError,
                "Password must be at least 8 characters."
            );

        } else {

            showSuccess(passwordInput, passwordError);
        }

        // Recheck confirmation password
        if (confirmPasswordInput.value !== "") {
            validateConfirmPassword();
        }
    });


    // Confirm password validation
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


    confirmPasswordInput.addEventListener(
        "input",
        validateConfirmPassword
    );


    // Checkbox validation
    termsInput.addEventListener("change", function () {

        if (termsInput.checked) {
            termsError.textContent = "";
        } else {
            termsError.textContent =
                "Please accept the terms and conditions.";
        }
    });

});