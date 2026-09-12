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
          <div className="w-10 h-10 border-4 border-neo-cyan border-t-transparent animate-spin" />
          <p className="text-xs text-neo-yellow font-pixel">Loading your submitted grievances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-3 border-black">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neo-yellow text-black font-pixel text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_#000]">
            <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>[CONFIDENTIAL USER DASHBOARD]</span>
          </div>
          <h1 className="font-pixel text-3xl font-extrabold text-white mt-2">My Submitted Grievances</h1>
          <p className="text-xs text-slate-300 font-mono mt-1">
            Grievances linked exclusively to account: <span className="text-neo-cyan font-pixel font-bold">{session?.user?.email}</span>
          </p>
        </div>

        <Link
          href="/submit"
          className="inline-flex items-center gap-2 px-6 py-3 bg-neo-cyan text-black font-pixel text-xs font-bold border-3 border-black shadow-[4px_4px_0px_0px_#FFE600] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all self-start md:self-auto uppercase"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>Submit New Grievance</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-neo-pink text-white border-3 border-black shadow-[3px_3px_0px_0px_#000] text-xs font-mono flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 stroke-[2.5]" />
          <span>{error}</span>
        </div>
      )}

      {/* Table of Grievances */}
      {grievances.length > 0 ? (
        <div className="neo-card border-3 border-black shadow-[6px_6px_0px_0px_#00F0FF] overflow-hidden bg-[#161622]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-200 font-mono">
              <thead className="bg-[#121218] font-pixel text-xs uppercase text-neo-yellow border-b-3 border-black">
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
              <tbody className="divide-y-2 divide-black">
                {grievances.map((item) => (
                  <tr key={item.id} className="hover:bg-[#1C1C2B] transition-colors">
                    <td className="px-6 py-4 font-pixel font-bold text-neo-cyan">
                      {item.publicId}
                    </td>
                    <td className="px-6 py-4 text-white font-bold">
                      {item.categoryName}
                    </td>
                    <td className="px-6 py-4 text-slate-300 max-w-xs truncate font-mono">
                      {item.subject}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-pixel font-bold badge-priority-${item.priority}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-pixel font-bold badge-status-${item.status}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/track?id=${item.publicId}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neo-yellow text-black border-2 border-black font-pixel text-xs font-bold shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                      >
                        <Search className="w-3.5 h-3.5 stroke-[2.5]" />
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
        <div className="neo-card p-12 border-3 border-black shadow-[6px_6px_0px_0px_#FFE600] text-center space-y-4 bg-[#161622]">
          <FileText className="w-12 h-12 text-neo-yellow mx-auto stroke-[2.5]" />
          <h2 className="font-pixel text-xl font-bold text-white">No Submitted Grievances</h2>
          <p className="text-xs text-slate-300 font-mono max-w-md mx-auto">
            You have not submitted any grievances yet under this authenticated account.
          </p>
          <div className="pt-2">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neo-cyan text-black font-pixel text-xs font-bold border-3 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none uppercase"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Submit First Grievance</span>
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}

