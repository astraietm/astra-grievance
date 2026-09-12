'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  UploadCloud,
  FileText,
  CheckCircle2,
  Copy,
  Check,
  Search,
  Home,
  AlertCircle,
  Paperclip,
  X,
  AlertTriangle,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function SubmitGrievancePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'NORMAL' | 'URGENT'>('NORMAL');
  const [wantsResponse, setWantsResponse] = useState(false);
  const [confirmationTruthful, setConfirmationTruthful] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedPublicId, setSubmittedPublicId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/submit');
    }
  }, [status, router]);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success && data.categories) {
          setCategories(data.categories);
          if (data.categories.length > 0) {
            setCategoryId(data.categories[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    fetchCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size exceeds maximum limit of 10MB.');
        return;
      }
      setError('');
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!confirmationTruthful) {
      setError('You must confirm that the information provided is truthful.');
      return;
    }

    if (!categoryId || !subject.trim() || !description.trim()) {
      setError('Please fill in all required fields (Category, Subject, Description).');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('categoryId', categoryId);
      formData.append('subject', subject);
      formData.append('description', description);
      formData.append('priority', priority);
      formData.append('wantsResponse', wantsResponse ? 'true' : 'false');
      formData.append('confirmationTruthful', confirmationTruthful ? 'true' : 'false');

      if (file) {
        formData.append('attachment', file);
      }

      const res = await fetch('/api/grievances', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit grievance.');
      }

      setSubmittedPublicId(data.publicId);
    } catch (err: any) {
      setError(err.message || 'Your grievance could not be submitted. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (submittedPublicId) {
      navigator.clipboard.writeText(submittedPublicId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-mono">Verifying authentication status...</p>
        </div>
      </div>
    );
  }

  // SUCCESS CONFIRMATION MODAL / SCREEN
  if (submittedPublicId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-cyan-500/30 text-center space-y-8 shadow-2xl relative">
          
          <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white">Grievance Submitted Successfully</h1>
            <p className="text-sm text-slate-400">
              Your report has been logged securely into the ASTRA IETM Confidential Grievance System.
            </p>
          </div>

          {/* Grievance ID Display Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-3">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">
              Your Unique Grievance ID
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-cyan-300 tracking-wider">
              {submittedPublicId}
            </div>
            <p className="text-xs text-slate-400">
              Save this ID to monitor progress and view official administrator responses.
            </p>
            <button
              onClick={copyToClipboard}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Grievance ID</span>
                </>
              )}
            </button>
          </div>

          {/* Privacy Note */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3 text-left">
            <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p>
              Your Google identity is saved securely on the backend but is <strong>not visible to grievance reviewers</strong>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={`/track?id=${submittedPublicId}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20"
            >
              <Search className="w-4 h-4" />
              <span>Track Grievance Now</span>
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-sm border border-slate-700"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="space-y-8">
        
        {/* Page Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-mono font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure Confidential Submission</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Submit a Grievance</h1>
          <p className="text-sm text-slate-400">
            Report concerns or suggestions to the Cyber Security Department Association of ASTRA IETM.
          </p>
        </div>

        {/* Security Notice Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 text-xs sm:text-sm flex items-start gap-3.5 backdrop-blur-md">
          <ShieldCheck className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white mb-0.5">Verified & Confidential Reporting</h4>
            <p className="text-slate-300 leading-relaxed text-xs">
              Your identity is verified for security purposes via your Google account. Your name and email address will <strong className="text-cyan-400">not</strong> be displayed to grievance reviewers.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-6">
          
          {/* Category Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-200">
              Grievance Category <span className="text-rose-400">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-200">
              Subject <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Concise summary of your concern..."
              required
              maxLength={150}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-200">
              Detailed Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide specific details, context, dates, and background regarding this concern..."
              required
              rows={6}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-y"
            />
          </div>

          {/* Priority Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-200">Priority Level</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPriority('NORMAL')}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  priority === 'NORMAL'
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Normal Priority
              </button>
              <button
                type="button"
                onClick={() => setPriority('URGENT')}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  priority === 'URGENT'
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                Urgent Priority
              </button>
            </div>
          </div>

          {/* Optional Attachments Dropzone */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-200">
              Supporting Attachments <span className="text-slate-500 font-normal">(Optional, Max 10MB)</span>
            </label>
            
            {file ? (
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-cyan-500/30 text-sm">
                <div className="flex items-center gap-3">
                  <Paperclip className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="font-semibold text-white truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-800 hover:border-cyan-500/40 bg-slate-900/40 hover:bg-slate-900/80 cursor-pointer transition-all">
                <UploadCloud className="w-8 h-8 text-cyan-400 mb-2" />
                <span className="text-sm font-semibold text-slate-300">Click to upload file attachment</span>
                <span className="text-xs text-slate-500 mt-1">PDF, JPG, PNG, WEBP, DOCX, TXT, or ZIP (up to 10MB)</span>
                <input type="file" onChange={handleFileChange} className="hidden" />
              </label>
            )}
          </div>

          {/* Response Requested Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={wantsResponse}
                onChange={(e) => setWantsResponse(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-xs sm:text-sm text-slate-300">
                I request an official response regarding this grievance.
              </span>
            </label>
          </div>

          {/* Confirmation Checkbox */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmationTruthful}
                onChange={(e) => setConfirmationTruthful(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500 mt-0.5"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                I confirm that the information provided is truthful and submitted in good faith.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !confirmationTruthful}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base shadow-xl shadow-cyan-500/25 border border-cyan-400/40 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Encrypting & Submitting...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Submit Grievance</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
