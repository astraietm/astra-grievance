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
        <div className="mx-auto w-14 h-14 bg-neo-pink text-white border-3 border-black shadow-[3px_3px_0px_0px_#FFE600] flex items-center justify-center">
          <Search className="w-7 h-7 stroke-[2.5]" />
        </div>
        <h1 className="font-pixel text-3xl font-extrabold text-white">Track Grievance Status</h1>
        <p className="text-xs text-slate-300 font-mono max-w-md mx-auto">
          Enter your unique Grievance Reference ID to monitor review progress and view official admin responses.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="neo-card p-4 sm:p-6 border-3 border-black shadow-[6px_6px_0px_0px_#00F0FF] space-y-4 bg-[#161622]">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <input
              type="text"
              value={inputPublicId}
              onChange={(e) => setInputPublicId(e.target.value)}
              placeholder="e.g. GRV-2026-0001"
              required
              className="w-full pl-4 pr-10 py-3.5 bg-[#121218] border-2 border-black text-neo-cyan font-pixel text-base uppercase placeholder:normal-case placeholder-slate-500 focus:outline-none focus:border-neo-yellow focus:shadow-[3px_3px_0px_0px_#FFE600]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-neo-cyan text-black font-pixel text-xs font-bold border-3 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-3 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>Track Status</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
          <Lock className="w-3.5 h-3.5 text-neo-cyan shrink-0 stroke-[2.5]" />
          <span>Identity confidentiality strictly enforced. Submitter details are not exposed.</span>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="p-6 bg-neo-pink text-white border-3 border-black shadow-[4px_4px_0px_0px_#000] text-xs font-mono flex items-center gap-3">
          <AlertCircle className="w-6 h-6 shrink-0 stroke-[2.5]" />
          <div>
            <h2 className="font-pixel font-bold text-sm">Grievance Not Found</h2>
            <p className="text-xs text-slate-100 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* RESULT DISPLAY */}
      {result && (
        <div className="neo-card p-6 sm:p-10 border-3 border-black shadow-[8px_8px_0px_0px_#FFE600] space-y-8 bg-[#161622]">
          
          {/* Result Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-3 border-black">
            <div>
              <span className="font-pixel text-xs uppercase font-bold text-neo-yellow tracking-wider">
                Grievance Reference
              </span>
              <h2 className="text-2xl font-extrabold font-pixel text-neo-cyan mt-0.5">
                {result.publicId}
              </h2>
            </div>
            <div className="flex items-center gap-2 font-pixel">
              <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider badge-status-${result.status}`}>
                {result.status.replace('_', ' ')}
              </span>
              <span className={`px-3 py-1 text-xs font-bold badge-priority-${result.priority}`}>
                {result.priority}
              </span>
            </div>
          </div>

          {/* Timeline Progress */}
          {result.status !== 'REJECTED' && (
            <div className="space-y-4">
              <h2 className="font-pixel text-xs uppercase font-bold text-neo-cyan tracking-wider">
                Review Status Timeline
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {statusSteps.map((stepName, idx) => {
                  const currentIdx = getStatusIndex(result.status);
                  const isDone = currentIdx >= idx;
                  const isCurrent = currentIdx === idx;

                  return (
                    <div
                      key={stepName}
                      className={`p-3 border-2 border-black text-center space-y-1 transition-all ${
                        isCurrent
                          ? 'bg-neo-cyan text-black font-bold shadow-[3px_3px_0px_0px_#FFE600]'
                          : isDone
                          ? 'bg-neo-yellow text-black font-bold shadow-[2px_2px_0px_0px_#000]'
                          : 'bg-[#121218] text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1 text-[10px] font-pixel">
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-black stroke-[3]" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-slate-500 stroke-[2]" />
                        )}
                        <span>Step 0{idx + 1}</span>
                      </div>
                      <p className="text-xs font-pixel font-bold truncate">
                        {stepName.replace('_', ' ')}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Details Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-[#121218] border-2 border-black shadow-[4px_4px_0px_0px_#000]">
            <div>
              <span className="text-xs font-pixel text-neo-yellow uppercase font-bold">Category</span>
              <p className="font-bold font-mono text-white mt-0.5">{result.categoryName}</p>
            </div>
            <div>
              <span className="text-xs font-pixel text-neo-yellow uppercase font-bold">Subject</span>
              <p className="font-bold font-mono text-white mt-0.5">{result.subject}</p>
            </div>
            <div>
              <span className="text-xs font-pixel text-neo-cyan uppercase font-bold">Submitted On</span>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                {new Date(result.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-xs font-pixel text-neo-cyan uppercase font-bold">Last Updated</span>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                {new Date(result.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Official Admin Responses Section */}
          <div className="space-y-4 pt-4 border-t-3 border-black">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-neo-cyan stroke-[2.5]" />
              <h3 className="font-pixel text-lg font-bold text-white">Official Administrator Responses</h3>
            </div>

            {result.responses && result.responses.length > 0 ? (
              <div className="space-y-4">
                {result.responses.map((resp) => (
                  <div
                    key={resp.id}
                    className="p-5 bg-[#121218] border-3 border-black shadow-[4px_4px_0px_0px_#00F0FF] space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs text-neo-cyan font-pixel font-bold">
                      <span>[★] ASTRA Grievance Reviewer Response</span>
                      <span className="font-mono text-slate-400">{new Date(resp.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-200 font-mono leading-relaxed whitespace-pre-wrap">
                      {resp.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-[#121218] border-2 border-black text-center text-xs text-slate-400 font-mono space-y-1">
                <Clock className="w-6 h-6 text-neo-yellow mx-auto stroke-[2.5]" />
                <p className="font-pixel font-bold text-white uppercase">[UNDER REVIEW]</p>
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
      <Suspense fallback={<div className="w-8 h-8 border-4 border-neo-cyan border-t-transparent animate-spin" />}>
        <TrackGrievanceContent />
      </Suspense>
    </div>
  );
}

