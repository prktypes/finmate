'use client';

import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Upload, FileText, Check, X } from 'lucide-react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statementId, setStatementId] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      if (files[0].type === 'application/pdf') {
        setFile(files[0]);
      } else {
        alert('Please upload a PDF file');
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('http://localhost:8000/statements/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const data = await response.json();
        setStatementId(data.statement_id);
      } else {
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please ensure the backend is running.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800"
      >
        <div className="container mx-auto px-8 py-5 flex justify-between items-center">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-white">
            FinMate
          </Link>
          <div className="hidden md:flex gap-10">
            <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-5xl font-bold mb-6 tracking-tight text-white">Upload Statement</h1>
          <p className="text-xl text-zinc-400 mb-16 leading-relaxed">
            Upload your bank statement PDF to get started with AI-powered financial analysis.
          </p>

          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed p-20 text-center transition-all duration-300 ${
              isDragging
                ? 'border-white bg-white/5'
                : 'border-zinc-800 hover:border-zinc-600'
            }`}
          >
            {!file ? (
              <div className="flex flex-col items-center">
                <Upload className="w-20 h-20 mb-8 text-zinc-500" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Drop your PDF here or click to browse
                </h3>
                <p className="text-zinc-500 mb-8">Supports PDF files up to 10MB</p>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  className="inline-block bg-white text-black px-8 py-4 font-medium cursor-pointer hover:bg-zinc-200 transition-colors"
                >
                  Select File
                </label>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <FileText className="w-20 h-20 mb-8 text-white" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold mb-3 text-white">{file.name}</h3>
                <p className="text-zinc-500 mb-8">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="bg-white text-black px-10 py-4 font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Upload & Process'}
                  </button>
                  <button
                    onClick={() => setFile(null)}
                    disabled={uploading}
                    className="border border-zinc-800 px-10 py-4 font-medium text-white hover:bg-zinc-900 transition-colors disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Progress Bar */}
          {uploading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10"
            >
              <div className="h-2 bg-zinc-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-white"
                />
              </div>
              <p className="text-center text-sm text-zinc-500 mt-3">
                Processing... {uploadProgress}%
              </p>
            </motion.div>
          )}

          {/* Success Message */}
          {statementId && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-10 border border-emerald-500 bg-emerald-500/10 p-12 text-center"
            >
              <Check className="w-16 h-16 mx-auto mb-6 text-emerald-400" strokeWidth={1.5} />
              <h3 className="text-2xl font-semibold mb-3 text-white">Upload Successful!</h3>
              <p className="text-zinc-400 mb-8">
                Your statement is being processed. Statement ID: {statementId}
              </p>
              <Link
                href={`/statement/${statementId}`}
                className="inline-block bg-white text-black px-8 py-4 font-medium hover:bg-zinc-200 transition-colors"
              >
                View Statement
              </Link>
            </motion.div>
          )}

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-8 mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="border border-zinc-800 p-8 hover:border-zinc-700 transition-colors"
            >
              <h3 className="font-semibold mb-3 text-white">Privacy First</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Your data is processed locally and never leaves your device. We don't store or
                share your financial information.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="border border-zinc-800 p-8 hover:border-zinc-700 transition-colors"
            >
              <h3 className="font-semibold mb-3 text-white">AI-Powered Analysis</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Our local AI model automatically categorizes transactions and provides insights
                about your spending patterns.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
