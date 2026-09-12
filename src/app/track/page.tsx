'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Lock,
} from 'lucide-react';

interface GrievanceTrackResult {
  publicId: string;
  categoryName: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  responses: Array<{
    id: string;
    message: string;
    createdAt: string;
  }>;
}

const statusSteps = [
  'SUBMITTED',
  'UNDER_REVIEW',
  'IN_PROGRESS',
  'RESOLVED',
];

function TrackGrievanceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialId = searchParams.get('id') || '';

  const [inputPublicId, setInputPublicId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<GrievanceTrackResult | null>(null);

  const fetchGrievanceStatus = async (publicId: string) => {
    if (!publicId.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formattedId = publicId.trim().toUpperCase();
      const res = await fetch(`/api/track/${formattedId}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "We couldn't find a grievance with that ID.");
      }

      setResult(data.grievance);
    } catch (err: any) {
      setError(err.message || "We couldn't find a grievance with that ID.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchGrievanceStatus(initialId);
    }
  }, [initialId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPublicId.trim()) {
      router.push(`/track?id=${inputPublicId.trim().toUpperCase()}`);
      fetchGrievanceStatus(inputPublicId.trim());
    }
  };

  const getStatusIndex = (currentStatus: string) => {
    if (currentStatus === 'CLOSED') return 3;
    if (currentStatus === 'REJECTED') return -1;
    if (currentStatus === 'AWAITING_INFO') return 1;
    return statusSteps.indexOf(currentStatus);
  };

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
          <Search className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Track Grievance Status</h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Enter your unique Grievance Reference ID to monitor review progress and view official admin responses.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="glass-card p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <input
              type="text"
              value={inputPublicId}
              onChange={(e) => setInputPublicId(e.target.value)}
              placeholder="e.g. GRV-2026-0001"
              required
              className="w-full pl-4 pr-10 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-base uppercase placeholder:normal-case placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Track Status</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Identity confidentiality strictly enforced. Submitter details are not exposed.</span>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <div>
            <h4 className="font-bold">Grievance Not Found</h4>
            <p className="text-xs text-rose-300/80 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* RESULT DISPLAY */}
      {result && (
        <div className="glass-card p-6 sm:p-10 rounded-3xl border border-cyan-500/30 space-y-8 animate-fadeIn">
          
          {/* Result Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs uppercase font-mono font-bold text-cyan-400 tracking-wider">
                Grievance Reference
              </span>
              <h2 className="text-2xl font-extrabold font-mono text-white mt-0.5">
                {result.publicId}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider badge-status-${result.status}`}>
                {result.status.replace('_', ' ')}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold badge-priority-${result.priority}`}>
                {result.priority}
              </span>
            </div>
          </div>

          {/* Timeline Progress */}
          {result.status !== 'REJECTED' && (
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-mono font-bold text-slate-400 tracking-wider">
                Review Status Timeline
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {statusSteps.map((stepName, idx) => {
                  const currentIdx = getStatusIndex(result.status);
                  const isDone = currentIdx >= idx;
                  const isCurrent = currentIdx === idx;

                  return (
                    <div
                      key={stepName}
                      className={`p-3 rounded-xl border text-center space-y-1 transition-all ${
                        isCurrent
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold shadow-lg shadow-cyan-500/10'
                          : isDone
                          ? 'bg-slate-900 border-slate-800 text-slate-300'
                          : 'bg-slate-950/40 border-slate-900 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1 text-[11px] font-mono">
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                        )}
                        <span>Step 0{idx + 1}</span>
                      </div>
                      <p className="text-xs font-semibold truncate">
                        {stepName.replace('_', ' ')}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Details Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div>
              <span className="text-xs text-slate-400 font-mono uppercase">Category</span>
              <p className="font-semibold text-white mt-0.5">{result.categoryName}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-mono uppercase">Subject</span>
              <p className="font-semibold text-white mt-0.5">{result.subject}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-mono uppercase">Submitted On</span>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                {new Date(result.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-mono uppercase">Last Updated</span>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                {new Date(result.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Official Admin Responses Section */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Official Administrator Responses</h3>
            </div>

            {result.responses && result.responses.length > 0 ? (
              <div className="space-y-4">
                {result.responses.map((resp) => (
                  <div
                    key={resp.id}
                    className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs text-cyan-400 font-mono">
                      <span>ASTRA Grievance Reviewer Response</span>
                      <span>{new Date(resp.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {resp.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400 space-y-1">
                <Clock className="w-6 h-6 text-slate-500 mx-auto" />
                <p className="font-semibold text-slate-300">Under Review</p>
                <p>No official responses published yet. Please check back periodically.</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}

export default function TrackGrievancePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Suspense fallback={<div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />}>
        <TrackGrievanceContent />
      </Suspense>
    </div>
  );
}
