const fs = require("fs");
const path = require("path");

async function testConversion() {
    const pdfPath = process.argv[2];

    if (!pdfPath) {
        console.log("Please provide a PDF file path.");
        return;
    }

    const { pdf } = await import("pdf-to-img");

    const outputFolder = path.join(__dirname, "ocr-test-pages");

    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder);
    }

    const document = await pdf(pdfPath, { scale: 2 });

    let pageNumber = 1;

    for await (const image of document) {
        const outputPath = path.join(
            outputFolder,
            `page-${pageNumber}.png`
        );

        fs.writeFileSync(outputPath, image);

        console.log(`Converted page ${pageNumber}`);
        pageNumber++;
    }

    console.log(`\nConversion complete! Total pages: ${pageNumber - 1}`);
    console.log(`Images saved in: ${outputFolder}`);
}

testConversion().catch(console.error);