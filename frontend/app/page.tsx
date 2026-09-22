'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Lock, Brain, LineChart, Zap, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            FinMate
          </Link>
          <div className="hidden md:flex gap-10">
            <Link href="#features" className="text-sm font-medium hover:text-muted transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-muted transition-colors">
              How It Works
            </Link>
            <Link href="/upload" className="text-sm font-medium hover:text-muted transition-colors">
              Upload
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-32 md:py-40">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-7xl lg:text-[4.5rem] font-bold leading-tight mb-8 tracking-tighter">
              AI-Powered
              <br />
              Financial
              <br />
              Analysis
            </h1>
            <p className="text-xl text-muted mb-10 max-w-[520px] leading-relaxed">
              Transform your bank statements into actionable insights with local AI processing. Your data stays private, always.
            </p>
            <div className="flex gap-4">
              <Link
                href="/upload"
                className="bg-foreground text-background px-10 py-4 font-medium hover:opacity-80 transition-opacity inline-block"
              >
                Get Started
              </Link>
              <button className="border border-border px-10 py-4 font-medium hover:bg-foreground/5 transition-colors">
                Learn More
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="aspect-square border border-border relative overflow-hidden">
              {/* Grid background */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-[1px] bg-border p-[1px]">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-background" />
                ))}
              </div>
              {/* Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <BarChart3 className="w-32 h-32" strokeWidth={1.5} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-border py-32">
        <div className="max-w-7xl mx-auto px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold text-center mb-20 tracking-tight"
          >
            Why Choose FinMate?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Lock,
                title: 'Privacy First',
                description: 'All processing happens locally on your device. No data leaves your computer. Your financial information stays completely private.',
              },
              {
                icon: Brain,
                title: 'AI-Powered Insights',
                description: 'Leverage local Small Language Models to automatically categorize transactions, identify spending patterns, and get personalized recommendations.',
              },
              {
                icon: LineChart,
                title: 'Beautiful Visualizations',
                description: 'See your spending habits come alive with clean, intuitive charts and graphs that make understanding your finances effortless.',
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Optimized for performance with instant uploads, real-time processing, and smooth animations throughout the experience.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="border border-border p-10 hover:border-foreground transition-all duration-300"
              >
                <feature.icon className="w-12 h-12 mb-6" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold mb-4 tracking-snug">{feature.title}</h3>
                <p className="text-muted leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 border-t border-border">
        <div className="max-w-7xl mx-auto px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold text-center mb-20 tracking-tight"
          >
            How It Works
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto">
            {[
              {
                number: '1',
                title: 'Upload Your Statement',
                description: 'Securely upload your bank statement in PDF format. We support all major banks and statement formats.',
              },
              {
                number: '2',
                title: 'AI Processing',
                description: 'Our local AI model extracts transactions, categorizes expenses, and identifies patterns - all without sending your data anywhere.',
              },
              {
                number: '3',
                title: 'Get Insights',
                description: 'View your financial dashboard with spending insights, category breakdowns, and personalized recommendations to improve your financial health.',
              },
            ].map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-foreground rounded-full text-2xl font-bold mb-8">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-4 tracking-snug">{step.title}</h3>
                <p className="text-muted leading-relaxed max-w-[280px]">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-20 mt-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-16 mb-16">
            <div>
              <h3 className="font-semibold mb-6 tracking-snug">FinMate</h3>
              <p className="text-sm text-muted leading-relaxed">
                AI-powered financial analysis tool built for privacy-conscious users who want to understand their spending without compromising security.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-6 tracking-snug">Features</h3>
              <div className="flex flex-col gap-3 text-sm text-muted">
                <a href="#" className="hover:text-foreground transition-colors">
                  PDF Upload
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  Transaction Categorization
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  Spending Insights
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  Local AI Processing
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-6 tracking-snug">Resources</h3>
              <div className="flex flex-col gap-3 text-sm text-muted">
                <a href="#" className="hover:text-foreground transition-colors">
                  Documentation
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  GitHub
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-6 tracking-snug">Connect</h3>
              <div className="flex flex-col gap-3 text-sm text-muted">
                <a href="#" className="hover:text-foreground transition-colors">
                  Twitter
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  GitHub
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted">
            © 2026 FinMate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
