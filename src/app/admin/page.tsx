'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  Lock,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  MessageSquare,
  UserCheck,
  X,
  Send,
  AlertTriangle,
  ChevronDown,
  ShieldCheck,
  Paperclip,
} from 'lucide-react';

interface AdminGrievance {
  id: string;
  publicId: string;
  categoryName: string;
  categorySlug: string;
  subject: string;
  priority: string;
  status: string;
  wantsResponse: boolean;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  attachmentCount: number;
  noteCount: number;
  responseCount: number;
  identityRestricted: boolean;
}

interface GrievanceDetail extends AdminGrievance {
  description: string;
  attachments: Array<{ id: string; originalFilename: string; fileSize: number; mimeType: string }>;
  adminNotes: Array<{ id: string; note: string; createdAt: string; admin: { name: string; role: string } }>;
  responses: Array<{ id: string; message: string; createdAt: string; admin: { name: string } }>;
  identityLogsCount: number;
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [grievances, setGrievances] = useState<AdminGrievance[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    underReview: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  });
  const [userRole, setUserRole] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter States
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  // Selected Detail Modal
  const [selectedGrievanceId, setSelectedGrievanceId] = useState<string | null>(null);
  const [detail, setDetail] = useState<GrievanceDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Note / Response Input States
  const [newNote, setNewNote] = useState('');
  const [newResponse, setNewResponse] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  // Identity Unlock State
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [identityReason, setIdentityReason] = useState('');
  const [unlockedIdentity, setUnlockedIdentity] = useState<any>(null);
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [unlockError, setUnlockError] = useState('');

  // CSV Export Modal State
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportIncludeIdentity, setExportIncludeIdentity] = useState(false);
  const [exportReason, setExportReason] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin');
    }
  }, [status, router]);

  const fetchGrievances = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({
        search,
        category: categoryFilter,
        status: statusFilter,
        priority: priorityFilter,
        sort,
      });

      const res = await fetch(`/api/admin/grievances?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Access denied.');
      }

      setGrievances(data.grievances);
      setStats(data.stats);
      setUserRole(data.userRole);
    } catch (err: any) {
      setError(err.message || 'Failed to load admin dashboard.');
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, statusFilter, priorityFilter, sort]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchGrievances();
    }
  }, [status, fetchGrievances]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGrievances();
  };

  const openDetailModal = async (id: string) => {
    setSelectedGrievanceId(id);
    setDetailLoading(true);
    setUnlockedIdentity(null);
    try {
      const res = await fetch(`/api/admin/grievances/${id}`);
      const data = await res.json();
      if (data.success) {
        setDetail(data.grievance);
      }
    } catch (err) {
      console.error('Failed to load detail', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!detail) return;
    try {
      const res = await fetch(`/api/admin/grievances/${detail.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setDetail({ ...detail, status: newStatus });
        fetchGrievances();
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail || !newNote.trim()) return;
    setSubmittingAction(true);
    try {
      const res = await fetch(`/api/admin/grievances/${detail.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'note', text: newNote }),
      });
      const data = await res.json();
      if (data.success) {
        setDetail({
          ...detail,
          adminNotes: [data.note, ...detail.adminNotes],
        });
        setNewNote('');
      }
    } catch (err) {
      console.error('Failed to add note', err);
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleAddResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail || !newResponse.trim()) return;
    setSubmittingAction(true);
    try {
      const res = await fetch(`/api/admin/grievances/${detail.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'response', text: newResponse }),
      });
      const data = await res.json();
      if (data.success) {
        setDetail({
          ...detail,
          responses: [data.response, ...detail.responses],
          status: detail.status === 'SUBMITTED' ? 'UNDER_REVIEW' : detail.status,
        });
        setNewResponse('');
        fetchGrievances();
      }
    } catch (err) {
      console.error('Failed to publish response', err);
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleUnlockIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail || !identityReason.trim()) return;
    setUnlockLoading(true);
    setUnlockError('');

    try {
      const res = await fetch('/api/admin/identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grievanceId: detail.id,
          reason: identityReason,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to unlock identity.');
      }

      setUnlockedIdentity(data.complainantIdentity);
      setShowIdentityModal(false);
      setIdentityReason('');
    } catch (err: any) {
      setUnlockError(err.message || 'Failed to access identity.');
    } finally {
      setUnlockLoading(false);
    }
  };

  const triggerExport = () => {
    let url = '/api/admin/export';
    if (exportIncludeIdentity) {
      if (!exportReason.trim()) {
        alert('Mandatory justification reason required to export complainant identity details.');
        return;
      }
      url += `?includeIdentity=true&reason=${encodeURIComponent(exportReason.trim())}`;
    }
    window.open(url, '_blank');
    setShowExportModal(false);
    setExportReason('');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-mono">Authenticating admin portal access...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20">
        <div className="glass-card p-8 rounded-3xl border border-rose-500/30 text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Access Restricted</h2>
          <p className="text-sm text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800/60 text-purple-300 text-xs font-mono font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>ROLE: {userRole}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Admin Grievance Portal</h1>
          <p className="text-xs text-slate-400 mt-1">
            ASTRA IETM Cyber Security Department • Reviewer Interface
          </p>
        </div>

        <button
          onClick={() => setShowExportModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-sm font-semibold transition-all self-start md:self-auto"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Grievances (CSV)</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center space-y-1">
          <span className="text-2xl font-extrabold font-mono text-white">{stats.total}</span>
          <p className="text-xs text-slate-400 font-mono uppercase">Total</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-blue-500/30 text-center space-y-1 bg-blue-500/5">
          <span className="text-2xl font-extrabold font-mono text-blue-400">{stats.new}</span>
          <p className="text-xs text-blue-400 font-mono uppercase">New</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-amber-500/30 text-center space-y-1 bg-amber-500/5">
          <span className="text-2xl font-extrabold font-mono text-amber-400">{stats.underReview}</span>
          <p className="text-xs text-amber-400 font-mono uppercase">Under Review</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-purple-500/30 text-center space-y-1 bg-purple-500/5">
          <span className="text-2xl font-extrabold font-mono text-purple-400">{stats.inProgress}</span>
          <p className="text-xs text-purple-400 font-mono uppercase">In Progress</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-emerald-500/30 text-center space-y-1 bg-emerald-500/5">
          <span className="text-2xl font-extrabold font-mono text-emerald-400">{stats.resolved}</span>
          <p className="text-xs text-emerald-400 font-mono uppercase">Resolved</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-slate-700 text-center space-y-1 bg-slate-900/40">
          <span className="text-2xl font-extrabold font-mono text-slate-400">{stats.closed}</span>
          <p className="text-xs text-slate-400 font-mono uppercase">Closed</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="lg:col-span-2 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, subject, text..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </form>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="AWAITING_INFO">Awaiting Info</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Priorities</option>
            <option value="NORMAL">Normal</option>
            <option value="URGENT">Urgent</option>
          </select>

          {/* Sort Filter */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

        </div>
      </div>

      {/* Grievances Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/90 text-xs uppercase font-mono text-purple-300 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Identity</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {grievances.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-cyan-400">
                    {item.publicId}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString()}
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
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800 text-[11px] font-mono">
                      <Lock className="w-3 h-3 text-cyan-400" />
                      <span>Restricted</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openDetailModal(item.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL REVIEW DRAWER / MODAL */}
      {selectedGrievanceId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-fadeIn">
          <div className="w-full max-w-2xl bg-slate-950 border-l border-slate-800 h-full overflow-y-auto p-6 sm:p-8 space-y-8 relative">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setSelectedGrievanceId(null);
                setDetail(null);
                setUnlockedIdentity(null);
              }}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {detailLoading || !detail ? (
              <div className="min-h-[50vh] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-8">
                
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-2xl font-extrabold text-cyan-400">
                      {detail.publicId}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold badge-status-${detail.status}`}>
                      {detail.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{detail.subject}</h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Category: {detail.categoryName} • Created: {new Date(detail.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Submitter Identity Protection Box */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                      <Lock className="w-4 h-4 text-cyan-400" />
                      <span>Complainant Identity Protection</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                      CONFIDENTIAL
                    </span>
                  </div>

                  {unlockedIdentity ? (
                    <div className="p-4 rounded-xl bg-cyan-950/50 border border-cyan-500/40 space-y-2 text-xs">
                      <p className="text-emerald-400 font-mono font-bold">Identity Unlocked (Logged in Audit Trail)</p>
                      <div className="grid grid-cols-2 gap-2 text-slate-300">
                        <p><strong>Name:</strong> {unlockedIdentity.name}</p>
                        <p><strong>Email:</strong> {unlockedIdentity.email}</p>
                        <p><strong>Department:</strong> {unlockedIdentity.department}</p>
                        <p><strong>Year:</strong> {unlockedIdentity.year}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Status: <strong className="text-slate-200">Restricted from Reviewers</strong></span>
                      {userRole === 'SUPER_ADMIN' ? (
                        <button
                          onClick={() => setShowIdentityModal(true)}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-semibold text-xs transition-all"
                        >
                          Request Identity Access
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">Identity access restricted to SUPER_ADMIN</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Status Update Control */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase font-mono">
                    Change Grievance Status
                  </label>
                  <select
                    value={detail.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="SUBMITTED">SUBMITTED</option>
                    <option value="UNDER_REVIEW">UNDER REVIEW</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="AWAITING_INFO">AWAITING INFO</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>

                {/* Grievance Description */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-mono font-bold text-slate-400">Grievance Description</h4>
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {detail.description}
                  </div>
                </div>

                {/* Attachments */}
                {detail.attachments && detail.attachments.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase font-mono font-bold text-slate-400">Submitted Attachments</h4>
                    <div className="space-y-2">
                      {detail.attachments.map((att) => (
                        <a
                          key={att.id}
                          href={`/api/attachments/${att.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-cyan-400 font-mono transition-all"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Paperclip className="w-4 h-4 shrink-0 text-cyan-400" />
                            <span className="truncate">{att.originalFilename}</span>
                          </div>
                          <span className="text-slate-500 text-[11px]">Download</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Official Public Responses */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <h4 className="text-xs uppercase font-mono font-bold text-cyan-400">
                    Official Responses (Visible to Submitter)
                  </h4>

                  <form onSubmit={handleAddResponse} className="space-y-2">
                    <textarea
                      value={newResponse}
                      onChange={(e) => setNewResponse(e.target.value)}
                      placeholder="Write official response message..."
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="submit"
                      disabled={submittingAction || !newResponse.trim()}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publish Response</span>
                    </button>
                  </form>

                  <div className="space-y-2 pt-2">
                    {detail.responses.map((resp) => (
                      <div key={resp.id} className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-cyan-400 font-mono">
                          <span>{resp.admin?.name || 'Admin'}</span>
                          <span>{new Date(resp.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-200">{resp.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Internal Admin Notes */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <h4 className="text-xs uppercase font-mono font-bold text-purple-400">
                    Internal Reviewer Notes (Private to Admins)
                  </h4>

                  <form onSubmit={handleAddNote} className="space-y-2">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add internal investigation note..."
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="submit"
                      disabled={submittingAction || !newNote.trim()}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                    >
                      Add Internal Note
                    </button>
                  </form>

                  <div className="space-y-2 pt-2">
                    {detail.adminNotes.map((n) => (
                      <div key={n.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span>{n.admin?.name} ({n.admin?.role})</span>
                          <span>{new Date(n.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-300">{n.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* SUPER_ADMIN IDENTITY UNLOCK REASON MODAL */}
      {showIdentityModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-card p-6 rounded-3xl border border-rose-500/40 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
                <AlertTriangle className="w-5 h-5" />
                <span>Restricted Identity Access</span>
              </div>
              <button onClick={() => setShowIdentityModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Accessing complainant identity requires explicit justification. This request will be permanently logged in the <code className="text-cyan-400 font-mono">IdentityAccessLog</code> audit table.
            </p>

            {unlockError && (
              <div className="p-3 rounded-xl bg-rose-500/20 text-rose-300 text-xs">
                {unlockError}
              </div>
            )}

            <form onSubmit={handleUnlockIdentity} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Mandatory Justification Reason <span className="text-rose-400">*</span>
                </label>
                <textarea
                  value={identityReason}
                  onChange={(e) => setIdentityReason(e.target.value)}
                  placeholder="State legitimate operational or safety reason..."
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowIdentityModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={unlockLoading || !identityReason.trim()}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                >
                  {unlockLoading ? 'Logging & Unlocking...' : 'Unlock Identity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV EXPORT MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-card p-6 rounded-3xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Export Grievances (CSV)</h3>
              <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Export all grievances in CSV format for administrative recordkeeping.
            </p>

            <div className="space-y-3 pt-2">
              {userRole === 'SUPER_ADMIN' && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportIncludeIdentity}
                    onChange={(e) => setExportIncludeIdentity(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-rose-500"
                  />
                  <span className="text-xs text-rose-300 font-semibold">Include Complainant Identity Details (SUPER_ADMIN)</span>
                </label>
              )}

              {exportIncludeIdentity && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Justification Reason for Identity Export
                  </label>
                  <input
                    type="text"
                    value={exportReason}
                    onChange={(e) => setExportReason(e.target.value)}
                    placeholder="Reason for exporting identities..."
                    required
                    className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={triggerExport}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs"
              >
                Download CSV
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
