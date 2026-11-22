const { extractPdfText } = require("./services/pdfService");

async function testPDF() {
    const pdfPath = process.argv[2];

    if (!pdfPath) {
        console.log("Please provide a PDF path.");
        return;
    }

    console.log("Testing integrated PDF extraction...\n");

    const text = await extractPdfText(pdfPath);

    console.log("\nExtraction successful!");
    console.log("Total characters extracted:", text.length);
    console.log("\nFirst 500 characters:\n");
    console.log(text.substring(0, 500));
}

testPDF().catch((error) => {
    console.error("Test failed:", error.message);
});