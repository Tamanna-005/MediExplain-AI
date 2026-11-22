const fs = require("fs/promises");
const path = require("path");
const os = require("os");
const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

const TESSERACT_PATH = "D:\\Downloads\\tesseract.exe";

async function extractTextFromScannedPdf(pdfPath) {
    const { pdf } = await import("pdf-to-img");

    const tempFolder = await fs.mkdtemp(
        path.join(os.tmpdir(), "mediexplain-ocr-")
    );

    let fullText = "";

    try {
        const document = await pdf(pdfPath, { scale: 2 });

        let pageNumber = 1;

        for await (const image of document) {
            const imagePath = path.join(
                tempFolder,
                `page-${pageNumber}.png`
            );

            await fs.writeFile(imagePath, image);

            const { stdout } = await execFileAsync(
                TESSERACT_PATH,
                [imagePath, "stdout"],
                { timeout: 60000 }
            );

            fullText += `\n--- Page ${pageNumber} ---\n${stdout}\n`;

            console.log(`OCR completed for page ${pageNumber}`);

            pageNumber++;
        }

        return fullText.trim();
    } finally {
        await fs.rm(tempFolder, { recursive: true, force: true });
    }
}

module.exports = {
    extractTextFromScannedPdf
};