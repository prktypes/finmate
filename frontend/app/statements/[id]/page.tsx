'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertCircle, Loader2, FileText } from 'lucide-react';

type Statement = {
  statement_id: string;
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  upload_time: string;
  error_message?: string;
  extracted_text?: string;
};

export default function StatementPage() {
  const params = useParams();
  const router = useRouter();
  const statementId = params.id as string;

  const [statement, setStatement] = useState<Statement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!statementId) return;

    const fetchStatement = async () => {
      try {
        const response = await fetch(`http://localhost:8000/statements/${statementId}/status`);
        if (response.ok) {
          const data = await response.json();
          setStatement(data);

          if (data.status === 'completed') {
            const contentResponse = await fetch(`http://localhost:8000/statements/${statementId}`);
            if (contentResponse.ok) {
              const contentData = await contentResponse.json();
              setStatement(contentData);
            }
          }
        } else if (response.status === 404) {
          setError('Statement not found');
        } else {
          setError('Failed to fetch statement');
        }
      } catch (err) {
        console.error('Error fetching statement:', err);
        setError('Network error. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatement();

    const interval = setInterval(() => {
      if (statement?.status === 'pending' || statement?.status === 'processing') {
        fetchStatement();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [statementId, statement?.status]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5" strokeWidth={2} />;
      case 'processing':
      case 'pending':
        return <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" strokeWidth={2} />;
      default:
        return <Loader2 className="w-5 h-5" strokeWidth={2} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-foreground';
      case 'processing':
      case 'pending':
        return 'text-muted';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-muted';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
      >
        <div className="container mx-auto px-8 py-5 flex justify-between items-center">
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            FinMate
          </Link>
          <div className="hidden md:flex gap-10">
            <Link href="/" className="text-sm font-medium hover:text-muted transition-colors">
              Home
            </Link>
            <Link href="/upload" className="text-sm font-medium hover:text-muted transition-colors">
              Upload
            </Link>
            <Link href="/dashboard" className="text-sm font-medium hover:text-muted transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            Back
          </Link>

          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="w-16 h-16 mx-auto mb-6 animate-spin text-muted" strokeWidth={1.5} />
              <p className="text-muted text-xl">Loading statement...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <AlertCircle className="w-16 h-16 mx-auto mb-6 text-red-600" strokeWidth={1.5} />
              <h2 className="text-3xl font-bold mb-4">{error}</h2>
              <Link
                href="/upload"
                className="inline-block bg-foreground text-background px-8 py-4 font-medium hover:opacity-80 transition-opacity"
              >
                Upload New Statement
              </Link>
            </div>
          ) : statement ? (
            <>
              {/* Header */}
              <div className="mb-12">
                <FileText className="w-8 h-8 inline-block mb-4" strokeWidth={1.5} />
                <h1 className="text-5xl font-bold mb-4 tracking-tight">{statement.filename}</h1>
                <p className="text-muted text-lg">
                  Uploaded: {new Date(statement.upload_time).toLocaleString()}
                </p>
              </div>

              {/* Status Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="border border-border p-10 mb-10"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">Status</h2>
                  <span className={`inline-flex items-center gap-2 text-sm font-medium uppercase ${getStatusColor(statement.status)}`}>
                    {getStatusIcon(statement.status)}
                    {statement.status}
                  </span>
                </div>

                {statement.status === 'processing' || statement.status === 'pending' ? (
                  <div>
                    <div className="h-2 bg-border overflow-hidden mb-4">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-full bg-foreground"
                      />
                    </div>
                    <p className="text-sm text-muted">
                      Processing your statement... This may take a few moments.
                    </p>
                  </div>
                ) : statement.status === 'failed' ? (
                  <div className="text-red-600">
                    <p>Processing failed: {statement.error_message}</p>
                  </div>
                ) : null}
              </motion.div>

              {/* Extracted Text */}
              {statement.extracted_text && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="border border-border p-10"
                >
                  <h2 className="text-2xl font-semibold mb-8">Extracted Text</h2>
                  <div className="bg-background border border-border p-8 max-h-[600px] overflow-y-auto font-mono text-sm whitespace-pre-wrap">
                    {statement.extracted_text}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-8">
                    <button className="bg-foreground text-background px-8 py-4 font-medium hover:opacity-80 transition-opacity">
                      Analyze with AI
                    </button>
                    <button className="border border-border px-8 py-4 font-medium hover:bg-foreground/5 transition-colors">
                      Export
                    </button>
                  </div>
                </motion.div>
              )}
            </>
          ) : null}
        </motion.div>
      </main>
    </div>
  );
}