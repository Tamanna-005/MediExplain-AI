document.addEventListener("DOMContentLoaded", function () {

    const uploadBox =
    document.querySelector(".upload-box"); 

    const logoutButton =
        document.getElementById("logout-button");

    const chooseFileButton =
        document.getElementById("choose-file-button");

    const reportFile =
        document.getElementById("report-file");

        const selectedFile =
    document.getElementById("selected-file");

    const analyzeButton=document.getElementById("analyze-button");


    logoutButton.addEventListener("click", function () {

        window.location.href = "index.html";

    });


    chooseFileButton.addEventListener("click", function () {

        reportFile.click();

    });

    analyzeButton.addEventListener("click", function () {

    if (!reportFile.files.length) {
        return;
    }

    selectedFile.textContent =
        "Report selected. Analysis will be available soon.";

});

   reportFile.addEventListener("change", function () {

    if (reportFile.files.length === 0) {

        selectedFile.textContent =
            "No file selected";

        return;
    }

    const file = reportFile.files[0];

    const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png"
    ];

    const maxFileSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {

        selectedFile.textContent =
            "Invalid file type. Please select a PDF, JPG, or PNG.";

            uploadBox.classList.remove("file-selected");

        reportFile.value = "";

        analyzeButton.disabled = true;

        return;
    }

    if (file.size > maxFileSize) {

    selectedFile.textContent =
        "File is too large. Maximum size is 10 MB.";

    uploadBox.classList.remove("file-selected");

    reportFile.value = "";

    analyzeButton.disabled = true;

    return;
}

    selectedFile.textContent = file.name;

    analyzeButton.disabled = false;

    uploadBox.classList.add("file-selected");

});

});