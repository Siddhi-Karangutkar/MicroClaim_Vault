# MicroClaim Vault 🛡️

MicroClaim Vault is a full-stack AI-powered web application that allows users to seamlessly digitize, track, and execute warranty claims. By simply uploading an image of a receipt, the system utilizes advanced OCR and Groq's Llama-3 AI to instantly extract the product brand, price, and automatically calculate warranty expiration dates.

When a product breaks, users can generate formal, printable PDF warranty claims or copy pre-filled emails with a single click.

## ✨ Key Features
- **AI-Powered Data Extraction:** Drag-and-drop receipt scanning utilizing Tesseract.js (OCR) and Groq (Llama-3 8B) for intelligent metadata extraction.
- **Glassmorphism UI:** A sleek, premium, responsive interface built with Tailwind CSS v4, completely supporting automatic Light and Dark modes.
- **Cloud Integrations:** Images are permanently stored in Cloudinary; text data is saved to Firebase Firestore in real time.
- **Automated Claims Generation:** Automatically drafts legal warranty claim letters that can be downloaded as a PDF (via `jspdf`) or copied to the clipboard.
- **Real-Time Dashboard:** View all Active and Expired warranties, search by product name, and filter dynamically.
- **Secure Authentication:** User authentication and protected routing utilizing Firebase Auth.

## 🛠️ Tech Stack
**Frontend:**
- React.js (Vite)
- Tailwind CSS v4
- Lucide React (Icons)
- jsPDF (PDF Generation)
- React Router DOM

**Backend:**
- Node.js & Express.js
- Multer (Memory Storage)
- Tesseract.js (Optical Character Recognition)
- Groq AI API (Llama 3 8B model)
- Cloudinary SDK

**Database & Auth:**
- Firebase Firestore (NoSQL Database)
- Firebase Authentication

## 🚀 Getting Started

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/your-username/microclaim-vault.git
cd microclaim-vault
```

### 2. Setup the Frontend (`client/`)
1. Navigate to the client directory:
   ```bash
   cd client
   npm install
   ```
2. Create a `.env` file in the `client/` directory and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

### 3. Setup the Backend (`server/`)
1. Open a new terminal and navigate to the server directory:
   ```bash
   cd server
   npm install
   ```
2. Create a `.env` file in the `server/` directory and add your Groq and Cloudinary keys:
   ```env
   PORT=5000
   GROQ_API_KEY=your_groq_api_key
   
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
3. Start the Node.js server:
   ```bash
   node server.js
   ```

## 📂 Project Structure
```
MicroClaim Vault/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components (GlassCard, etc.)
│   │   ├── context/        # ThemeContext for Light/Dark mode
│   │   ├── pages/          # Dashboard, Upload, ItemDetails, Auth
│   │   └── services/       # Firebase initialization
│   ├── index.css           # Tailwind v4 configuration & base styles
│   └── package.json
├── server/                 # Node.js Backend
│   ├── services/
│   │   ├── groqService.js  # Llama 3 API integration for JSON parsing
│   │   └── ocrService.js   # Tesseract.js integration for raw text extraction
│   ├── server.js           # Express API and Multer configuration
│   └── package.json
└── README.md
```

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
