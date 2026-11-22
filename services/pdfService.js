const fs = require("fs/promises");
const { PDFParse } = require("pdf-parse");
const { extractTextFromScannedPdf } = require("./ocrService");

async function extractPdfText(filePath) {
    const fileBuffer = await fs.readFile(filePath);

    const parser = new PDFParse({
        data: fileBuffer
    });

    let extractedText = "";

    try {
        const result = await parser.getText();
        extractedText = result.text.trim();
    } finally {
        await parser.destroy();
    }

    // If PDF contains selectable text, return it directly
    if (extractedText.length > 0) {
        console.log("Text extracted using PDF parser");
        return extractedText;
    }

    // If PDF is scanned, use OCR automatically
    console.log("Scanned PDF detected. Starting OCR...");

    const ocrText = await extractTextFromScannedPdf(filePath);

    if (!ocrText.trim()) {
        throw new Error("Could not extract readable text from this PDF.");
    }

    console.log("Text extracted using OCR");

    return ocrText;
}

module.exports = {
    extractPdfText
};