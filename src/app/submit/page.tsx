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
          <div className="w-10 h-10 border-4 border-neo-cyan border-t-transparent animate-spin" />
          <p className="text-xs text-neo-yellow font-pixel">Verifying authentication status...</p>
        </div>
      </div>
    );
  }

  // SUCCESS CONFIRMATION MODAL / SCREEN
  if (submittedPublicId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="neo-card p-8 sm:p-12 border-3 border-black shadow-[8px_8px_0px_0px_#00FF66] text-center space-y-8 relative bg-[#161622]">
          
          <div className="mx-auto w-20 h-20 bg-neo-green text-black border-3 border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 stroke-[3]" />
          </div>

          <div className="space-y-2">
            <h1 className="font-pixel text-2xl sm:text-3xl font-extrabold text-white">Grievance Submitted Successfully</h1>
            <p className="text-xs text-slate-300 font-mono">
              Your report has been logged securely into the ASTRA IETM Confidential Grievance System.
            </p>
          </div>

          {/* Grievance ID Display Card */}
          <div className="p-6 bg-[#121218] border-3 border-black shadow-[4px_4px_0px_0px_#FFE600] space-y-3">
            <span className="font-pixel text-xs uppercase font-bold text-neo-yellow">
              Your Unique Grievance ID
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-pixel text-neo-cyan tracking-wider">
              {submittedPublicId}
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Save this ID to monitor progress and view official administrator responses.
            </p>
            <button
              onClick={copyToClipboard}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-neo-yellow text-black border-2 border-black font-pixel text-xs font-bold shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-black stroke-[3]" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-black stroke-[2.5]" />
                  <span>Copy Grievance ID</span>
                </>
              )}
            </button>
          </div>

          {/* Privacy Note */}
          <div className="p-4 bg-[#121218] border-2 border-black text-xs text-slate-300 font-mono flex items-start gap-3 text-left">
            <Lock className="w-4 h-4 text-neo-cyan shrink-0 mt-0.5 stroke-[2.5]" />
            <p>
              Your Google identity is saved securely on the backend but is <strong className="text-neo-yellow">not visible to grievance reviewers</strong>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={`/track?id=${submittedPublicId}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-neo-cyan text-black font-pixel text-xs font-bold border-3 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>Track Grievance Now</span>
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-neo-card text-white font-pixel text-xs font-bold border-3 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              <Home className="w-4 h-4 stroke-[2.5]" />
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neo-yellow text-black font-pixel text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_#000]">
            <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>[SECURE CONFIDENTIAL SUBMISSION]</span>
          </div>
          <h1 className="font-pixel text-3xl sm:text-4xl font-extrabold text-white">Submit a Grievance</h1>
          <p className="text-xs sm:text-sm text-slate-300 font-mono">
            Report concerns or suggestions to the Cyber Security Department Association of ASTRA IETM.
          </p>
        </div>

        {/* Security Notice Banner */}
        <div className="p-5 bg-[#161622] border-3 border-black shadow-[4px_4px_0px_0px_#00F0FF] text-xs sm:text-sm flex items-start gap-3.5 font-mono">
          <ShieldCheck className="w-6 h-6 text-neo-cyan shrink-0 mt-0.5 stroke-[2.5]" />
          <div>
            <h2 className="font-pixel font-bold text-neo-yellow text-sm mb-0.5">Verified & Confidential Reporting</h2>
            <p className="text-slate-300 leading-relaxed text-xs">
              Your identity is verified for security purposes via your Google account. Your name and email address will <strong className="text-neo-cyan font-pixel font-bold">NOT</strong> be displayed to grievance reviewers.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-neo-pink text-white border-3 border-black shadow-[3px_3px_0px_0px_#000] text-xs font-mono flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 stroke-[2.5]" />
            <span>{error}</span>
          </div>
        )}

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="neo-card p-6 sm:p-10 border-3 border-black shadow-[8px_8px_0px_0px_#FFE600] space-y-6 bg-[#161622]">
          
          {/* Category Dropdown */}
          <div className="space-y-2">
            <label className="block font-pixel text-xs font-bold text-white uppercase">
              Grievance Category <span className="text-neo-pink">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#121218] border-2 border-black text-white font-mono text-sm focus:outline-none focus:border-neo-cyan focus:shadow-[3px_3px_0px_0px_#00F0FF]"
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
            <label className="block font-pixel text-xs font-bold text-white uppercase">
              Subject <span className="text-neo-pink">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Concise summary of your concern..."
              required
              maxLength={150}
              className="w-full px-4 py-3 bg-[#121218] border-2 border-black text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-neo-cyan focus:shadow-[3px_3px_0px_0px_#00F0FF]"
            />
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <label className="block font-pixel text-xs font-bold text-white uppercase">
              Detailed Description <span className="text-neo-pink">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide specific details, context, dates, and background regarding this concern..."
              required
              rows={6}
              className="w-full px-4 py-3 bg-[#121218] border-2 border-black text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-neo-cyan focus:shadow-[3px_3px_0px_0px_#00F0FF] resize-y"
            />
          </div>

          {/* Priority Selection */}
          <div className="space-y-2">
            <label className="block font-pixel text-xs font-bold text-white uppercase">Priority Level</label>
            <div className="grid grid-cols-2 gap-4 font-pixel text-xs">
              <button
                type="button"
                onClick={() => setPriority('NORMAL')}
                className={`py-3 px-4 border-2 border-black font-bold transition-all ${
                  priority === 'NORMAL'
                    ? 'bg-neo-cyan text-black shadow-[3px_3px_0px_0px_#000]'
                    : 'bg-[#121218] text-slate-400 hover:text-white'
                }`}
              >
                NORMAL PRIORITY
              </button>
              <button
                type="button"
                onClick={() => setPriority('URGENT')}
                className={`py-3 px-4 border-2 border-black font-bold transition-all flex items-center justify-center gap-2 ${
                  priority === 'URGENT'
                    ? 'bg-neo-pink text-white shadow-[3px_3px_0px_0px_#FFE600] animate-pulse'
                    : 'bg-[#121218] text-slate-400 hover:text-white'
                }`}
              >
                <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
                URGENT PRIORITY
              </button>
            </div>
          </div>

          {/* Optional Attachments Dropzone */}
          <div className="space-y-2">
            <label className="block font-pixel text-xs font-bold text-white uppercase">
              Supporting Attachments <span className="text-slate-400 font-normal font-mono">(Optional, Max 10MB)</span>
            </label>
            
            {file ? (
              <div className="flex items-center justify-between p-4 bg-[#121218] border-2 border-black text-xs font-mono">
                <div className="flex items-center gap-3">
                  <Paperclip className="w-5 h-5 text-neo-cyan stroke-[2.5]" />
                  <div>
                    <p className="font-bold text-white truncate max-w-xs">{file.name}</p>
                    <p className="text-[11px] text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-1 bg-neo-pink text-white border border-black shadow-[2px_2px_0px_0px_#000]"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-6 border-3 border-dashed border-black bg-[#121218] hover:border-neo-cyan cursor-pointer transition-all">
                <UploadCloud className="w-8 h-8 text-neo-cyan mb-2 stroke-[2.5]" />
                <span className="font-pixel text-xs font-bold text-white">CLICK TO UPLOAD FILE ATTACHMENT</span>
                <span className="text-[11px] text-slate-400 mt-1 font-mono">PDF, JPG, PNG, WEBP, DOCX, TXT, or ZIP (up to 10MB)</span>
                <input type="file" onChange={handleFileChange} className="hidden" />
              </label>
            )}
          </div>

          {/* Response Requested Checkbox */}
          <div className="pt-2 font-mono">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={wantsResponse}
                onChange={(e) => setWantsResponse(e.target.checked)}
                className="w-4 h-4 border-2 border-black bg-[#121218] accent-neo-cyan"
              />
              <span className="text-xs text-slate-300 font-bold">
                I request an official response regarding this grievance.
              </span>
            </label>
          </div>

          {/* Confirmation Checkbox */}
          <div className="p-4 bg-[#121218] border-2 border-black font-mono">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmationTruthful}
                onChange={(e) => setConfirmationTruthful(e.target.checked)}
                className="w-4 h-4 border-2 border-black bg-[#121218] accent-neo-yellow mt-0.5"
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
            className="w-full py-4 bg-neo-cyan text-black font-pixel font-bold text-sm border-3 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 uppercase"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-3 border-black border-t-transparent rounded-full animate-spin" />
                <span>Encrypting & Submitting...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                <span>Submit Grievance</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}

