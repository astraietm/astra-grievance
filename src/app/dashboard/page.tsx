'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  Clock,
  Search,
  ExternalLink,
  Lock,
  PlusCircle,
  Paperclip,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

interface UserGrievance {
  id: string;
  publicId: string;
  categoryName: string;
  subject: string;
  priority: string;
  status: string;
  wantsResponse: boolean;
  createdAt: string;
  updatedAt: string;
  responses: Array<{ id: string; message: string; createdAt: string }>;
  attachments: Array<{ id: string; originalFilename: string; fileSize: number }>;
}

export default function UserDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [grievances, setGrievances] = useState<UserGrievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchUserGrievances() {
      if (status !== 'authenticated') return;
      try {
        setLoading(true);
        const res = await fetch('/api/user/grievances');
        const data = await res.json();
        if (data.success && data.grievances) {
          setGrievances(data.grievances);
        } else {
          setError(data.error || 'Failed to load grievances.');
        }
      } catch (err) {
        setError('Failed to connect to server.');
      } finally {
        setLoading(false);
      }
    }

    fetchUserGrievances();
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-mono">Loading your submitted grievances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-mono font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Confidential User Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">My Submitted Grievances</h1>
          <p className="text-xs text-slate-400 mt-1">
            Grievance submissions linked exclusively to account: <span className="text-cyan-400 font-mono">{session?.user?.email}</span>
          </p>
        </div>

        <Link
          href="/submit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Submit New Grievance</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Table of Grievances */}
      {grievances.length > 0 ? (
        <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/90 text-xs uppercase font-mono text-cyan-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Grievance ID</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {grievances.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-cyan-300">
                      {item.publicId}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      {item.categoryName}
                    </td>
                    <td className="px-6 py-4 text-slate-200 max-w-xs truncate">
                      {item.subject}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold badge-priority-${item.priority}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold badge-status-${item.status}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/track?id=${item.publicId}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-all"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>Track</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <FileText className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-xl font-bold text-white">No Submitted Grievances</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            You have not submitted any grievances yet under this authenticated account.
          </p>
          <div className="pt-2">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit First Grievance</span>
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
