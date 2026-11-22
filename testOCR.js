const { extractTextFromScannedPdf } = require("./services/ocrService");

async function testOCR() {
    const pdfPath = process.argv[2];

    if (!pdfPath) {
        console.log("Please provide a PDF file path.");
        return;
    }

    console.log("Starting OCR...\n");

    const extractedText = await extractTextFromScannedPdf(pdfPath);

    console.log("\n========== EXTRACTED TEXT ==========\n");
    console.log(extractedText);
    console.log("\n==================================");
}

testOCR().catch((error) => {
    console.error("OCR failed:", error.message);
});