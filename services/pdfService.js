
const fs = require("fs/promises");
const { PDFParse } = require("pdf-parse");

async function extractPdfText(filePath) {
    const fileBuffer = await fs.readFile(filePath);

    const parser = new PDFParse({
        data: fileBuffer
    });

    try {
        const result = await parser.getText();
        const extractedText = result.text.trim();

        if (!extractedText) {
            throw new Error(
                "No readable text found in this PDF. It may be a scanned document."
            );
        }

        return extractedText;
    } finally {
        await parser.destroy();
    }
}

module.exports = {
    extractPdfText
};
