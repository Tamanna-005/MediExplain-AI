console.log("LATEST DASHBOARD JS LOADED");
document.addEventListener("DOMContentLoaded", function () {

        const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    fetch("http://localhost:5000/api/test-protected", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {

        if (!data.success) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }

        console.log("Authenticated user:", data.userId);
        
loadReportHistory();


    })
    .catch(error => {

        console.error("Authentication error:", error);

    });

    const uploadBox =
    document.querySelector(".upload-box"); 

    const logoutButton =
        document.getElementById("logout-button");

    const chooseFileButton =
        document.getElementById("choose-file-button");

    const reportFile =
        document.getElementById("report-file");
        console.log("Report file input:", reportFile);

        const selectedFile =
    document.getElementById("selected-file");

    const analyzeButton=document.getElementById("analyze-button");


    logoutButton.addEventListener("click", function () {
localStorage.removeItem("token");
        window.location.href = "index.html";

    });


    chooseFileButton.addEventListener("click", function () {
    reportFile.click();
});

reportFile.addEventListener("change", function () {
    console.log("Selected files:", reportFile.files.length);
    console.log("Selected file:", reportFile.files[0]);
});

    analyzeButton.addEventListener("click", async function () {
        console.log("ANALYZE CLICK EVENT WORKING");
console.log("Analyze button clicked");
console.log("Files available:", reportFile.files.length);

    if (!reportFile.files.length) {
        selectedFile.textContent = "Please select a report first.";
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const file = reportFile.files[0];

    // Prepare the file for upload
    const formData = new FormData();
    formData.append("report", file);

    try {

        analyzeButton.disabled = true;
        selectedFile.textContent = "Uploading report...";

        const response = await fetch(
            "http://localhost:5000/api/reports/upload",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            }
        );

        const data = await response.json();

        if (response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }

        if (!response.ok) {
            throw new Error(
                data.message || "Report upload failed."
            );
        }

        selectedFile.textContent =
            "Report uploaded successfully!";

        console.log("Uploaded report:", data.report);

    } catch (error) {

        console.error("Upload error:", error);

        selectedFile.textContent =
            error.message === "Failed to fetch"
                ? "Cannot connect to the server. Please try again."
                : error.message;

    } finally {

        analyzeButton.disabled = false;

    }

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


async function loadReportHistory() {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            "http://localhost:5000/api/reports",
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Could not load report history"
            );
        }

       displayReportHistory(data.reports);

    } catch (error) {
        console.error("Report history error:", error);
    }
}

function displayReportHistory(reports) {
    const historyContainer =
        document.getElementById("report-history");

    if (!historyContainer) {
        console.error("Report history container not found.");
        return;
    }

    if (!reports || reports.length === 0) {
        historyContainer.innerHTML = `
            <div class="empty-reports">
                <h3>No reports yet</h3>
                <p>Your uploaded reports will appear here.</p>
            </div>
        `;
        return;
    }

    historyContainer.replaceChildren();

    reports.forEach(function (report) {
        const reportCard = document.createElement("article");
        reportCard.className = "report-card";

        const reportName = document.createElement("h3");
        reportName.textContent = report.fileName;

        const reportType = document.createElement("p");
        reportType.textContent =
            "File type: " + report.fileType;

        const reportDate = document.createElement("p");
        reportDate.textContent =
            "Uploaded: " +
            new Date(report.createdAt).toLocaleString();

        reportCard.append(
            reportName,
            reportType,
            reportDate
        );

        historyContainer.appendChild(reportCard);
    });
}


});