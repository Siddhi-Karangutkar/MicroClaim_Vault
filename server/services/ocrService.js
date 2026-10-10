const axios = require('axios');
const FormData = require('form-data');

/**
 * Sends a file buffer to OCR.space API for text extraction.
 * @param {Buffer} fileBuffer - The image file buffer
 * @param {string} filename - The original filename
 * @returns {Promise<string>} - The extracted raw text
 */
async function extractTextFromImage(fileBuffer, filename) {
  try {
    const formData = new FormData();
    formData.append('file', fileBuffer, { filename });
    formData.append('apikey', process.env.OCR_API_KEY || 'helloworld'); // 'helloworld' is a free tier test key
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');

    const response = await axios.post('https://api.ocr.space/parse/image', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    const data = response.data;
    
    if (data.IsErroredOnProcessing) {
      throw new Error(`OCR Error: ${data.ErrorMessage[0]}`);
    }

    if (!data.ParsedResults || data.ParsedResults.length === 0) {
      return '';
    }

    return data.ParsedResults[0].ParsedText;
  } catch (error) {
    console.error('Error in ocrService:', error.message);
    throw new Error('Failed to extract text from receipt.');
  }
}

module.exports = {
  extractTextFromImage
};
