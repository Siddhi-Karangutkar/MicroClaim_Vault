const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'microclaim-vault' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

const { extractTextFromImage } = require('./services/ocrService');
const { parseReceiptData } = require('./services/groqService');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure multer for memory storage (we pass buffer directly to OCR API)
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MicroClaim Vault API is running' });
});

// AI Ingestion Pipeline Route (Phase 3)
app.post('/api/process-receipt', upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No receipt file provided.' });
    }

    console.log(`Received file: ${req.file.originalname} (${req.file.size} bytes)`);

    // 1. Extract raw text using OCR
    console.log('Sending to OCR...');
    const ocrText = await extractTextFromImage(req.file.buffer, req.file.originalname);
    console.log('OCR Extraction complete. Text length:', ocrText.length);

    // 2. Parse text with Groq Llama 3
    console.log('Sending to Groq AI...');
    const parsedData = await parseReceiptData(ocrText);
    console.log('Groq AI parsing complete:', parsedData);

    // 3. Upload to Cloudinary
    console.log('Uploading image to Cloudinary...');
    let receiptUrl = null;
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name') {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer);
        receiptUrl = uploadResult.secure_url;
        console.log('Cloudinary upload success:', receiptUrl);
      } catch (err) {
        console.error('Cloudinary upload failed:', err);
      }
    } else {
      console.log('Cloudinary not configured. Skipping image upload.');
    }

    // 4. Return JSON to frontend
    parsedData.receipt_url = receiptUrl;
    res.json(parsedData);

  } catch (error) {
    console.error('Error processing receipt:', error);
    res.status(500).json({ error: 'Failed to process receipt.', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
