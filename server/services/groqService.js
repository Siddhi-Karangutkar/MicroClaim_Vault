const Groq = require('groq-sdk');

// If GROQ_API_KEY is not set, we will simulate the AI extraction for demo purposes
// so the app doesn't completely crash for the user if they haven't set up the key yet.
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

/**
 * Sends OCR text to Groq (Llama 3) to extract structured receipt data.
 * @param {string} ocrText - The raw text extracted from the receipt
 * @returns {Promise<Object>} - Parsed JSON containing receipt details
 */
async function parseReceiptData(ocrText) {
  if (!groq) {
    console.warn("GROQ_API_KEY not found in .env! Simulating AI extraction.");
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      store_name: "Simulated Store",
      purchase_date: new Date().toISOString().split('T')[0],
      items: [
        { brand: "Simulated Brand 1", product_name: "Simulated Product 1", price: "$100.00", warranty_months: 12 },
        { brand: "Simulated Brand 2", product_name: "Simulated Product 2", price: "$50.00", warranty_months: 24 }
      ]
    };
  }

  try {
    const prompt = `
      You are an expert at extracting purchase details from raw receipt OCR text.
      Extract the following information from the text below:
      - store_name (string): Name of the retail store.
      - purchase_date (string): Date of purchase in YYYY-MM-DD format.
      - items (array of objects): A list of ALL items purchased on the receipt. For each item, include:
        - brand (string): Brand of the item (e.g. Sony, Logitech). If unknown, use "Unknown".
        - product_name (string): Name of the item.
        - price (string): The exact price of the item including the currency symbol (e.g. "$649.99" or "Rs 5000").
        - warranty_months (number): Guess the likely warranty duration in months based on the product type and standard industry rules (e.g., electronics usually have 12-24 months). If it's a food item, bag, or consumable, return 0.

      Respond ONLY in strict JSON format. Do not include markdown formatting or explanations.

      Receipt OCR Text:
      """
      ${ocrText}
      """
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that strictly outputs JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'qwen/qwen3.8-27b',
      temperature: 0.1,
    });

    const jsonString = chatCompletion.choices[0].message.content;
    
    // Safely parse JSON even if the model wraps it in markdown blocks
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    
    const parsedData = JSON.parse(jsonMatch[0]);
    
    return parsedData;

  } catch (error) {
    console.error('Error in groqService:', error);
    throw new Error('Failed to parse receipt data with AI.');
  }
}

module.exports = {
  parseReceiptData
};
