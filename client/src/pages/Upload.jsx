import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, FileImage, Loader2, X, Zap } from 'lucide-react';
import { storage, auth } from '../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Upload() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile.type.startsWith('image/')) {
      alert('Please upload an image file (JPEG, PNG).');
      return;
    }
    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('receipt', file);

      const response = await fetch('http://localhost:5000/api/process-receipt', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Server returned error');
      }

      const extractedData = await response.json();
      
      // If the backend has Cloudinary configured, it returns a live URL.
      // If not, we fallback to the local Base64 preview for testing.
      if (!extractedData.receipt_url) {
        extractedData.receipt_url = preview;
      }

      // Navigate to verify page and pass state
      navigate('/verify', { state: { extractedData } });
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to process receipt. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 animate-fade-in-up">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Upload Receipt</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Our AI will automatically extract the purchase details.</p>
      </div>

      {!file ? (
        <div 
          className={`glass-card p-12 flex flex-col items-center justify-center text-center border-dashed border-2 transition-all duration-300 ${
            dragActive 
              ? 'border-neon bg-neon/5 scale-105 shadow-[0_0_30px_rgba(0,255,204,0.15)]' 
              : 'border-slate-300 dark:border-white/20 hover:border-neon hover:bg-slate-100/50 dark:hover:bg-white/5'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input 
            ref={inputRef}
            type="file" 
            accept="image/*"
            className="hidden" 
            onChange={handleChange}
          />
          
          <div className="w-20 h-20 bg-slate-200 dark:bg-white/10 rounded-full flex items-center justify-center mb-6">
            <UploadIcon className={`w-10 h-10 ${dragActive ? 'text-neon animate-bounce' : 'text-slate-500 dark:text-slate-400'}`} />
          </div>
          
          <h3 className="text-xl font-bold mb-2">Drag & Drop your receipt</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">or click to browse from your computer (JPEG, PNG)</p>
          
          <button className="px-6 py-2.5 rounded-lg font-medium bg-slate-900 dark:bg-white text-white dark:text-dark hover:scale-105 transition-transform pointer-events-none">
            Browse Files
          </button>
        </div>
      ) : (
        <div className="glass-card p-8 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            
            {/* Image Preview */}
            <div className="w-full md:w-1/2 relative group">
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-black/10 border border-slate-200 dark:border-white/10 relative">
                <img src={preview} alt="Receipt preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <div className="flex items-center gap-2 text-white">
                    <FileImage className="w-5 h-5" />
                    <span className="text-sm font-medium truncate">{file.name}</span>
                  </div>
                </div>
              </div>
              {!isLoading && (
                <button 
                  onClick={clearFile}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Action Area */}
            <div className="w-full md:w-1/2 flex flex-col items-center text-center">
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 border-4 border-slate-200 dark:border-white/10 border-t-neon rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-neon animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">AI is analyzing...</h3>
                  <p className="text-slate-500 dark:text-slate-400">Extracting brand, product, and warranty details.</p>
                </div>
              ) : (
                <div className="w-full">
                  <h3 className="text-2xl font-bold mb-2">Ready to scan</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-8">Our AI will read the receipt and extract all necessary information automatically.</p>
                  
                  <button 
                    onClick={handleUpload}
                    className="w-full py-4 bg-neon text-slate-900 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,204,0.2)]"
                  >
                    <Zap className="w-5 h-5" /> Start AI Extraction
                  </button>
                  <button 
                    onClick={clearFile}
                    className="w-full mt-4 py-3 bg-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
