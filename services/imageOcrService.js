const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);
const TESSERACT_PATH = String.raw`D:\Downloads\tesseract.exe`;

async function extractTextFromImage(imagePath) {
  if (!imagePath) {
    throw new Error("Image path is required for OCR");
  }

  const { stdout } = await execFileAsync(
    TESSERACT_PATH,
    [imagePath, "stdout", "-l", "eng"],
    {
      windowsHide: true,
      maxBuffer: 10 * 1024 * 1024,
    }
  );

  return stdout.trim();
}

module.exports = { extractTextFromImage };