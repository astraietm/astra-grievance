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
          <div className="w-10 h-10 border-4 border-neo-purple border-t-transparent animate-spin" />
          <p className="text-xs text-neo-yellow font-pixel">Authenticating admin portal access...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20">
        <div className="neo-card p-8 border-3 border-black shadow-[8px_8px_0px_0px_#FF2E93] text-center space-y-4 bg-[#161622]">
          <ShieldAlert className="w-12 h-12 text-neo-pink mx-auto stroke-[2.5]" />
          <h2 className="font-pixel text-2xl font-bold text-white">Access Restricted</h2>
          <p className="text-xs text-slate-300 font-mono">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-3 border-black">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neo-purple text-white font-pixel text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_#FFE600]">
            <ShieldAlert className="w-3.5 h-3.5 text-neo-yellow stroke-[2.5]" />
            <span>ROLE: {userRole}</span>
          </div>
          <h1 className="font-pixel text-3xl font-extrabold text-white mt-2">Admin Grievance Portal</h1>
          <p className="text-xs text-slate-300 font-mono mt-1">
            ASTRA IETM Cyber Security Department • Reviewer Interface
          </p>
        </div>

        <button
          onClick={() => setShowExportModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neo-cyan text-black font-pixel text-xs font-bold border-3 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all self-start md:self-auto uppercase"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Export Grievances (CSV)</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-pixel">
        <div className="neo-card p-4 border-3 border-black shadow-[4px_4px_0px_0px_#000] text-center space-y-1 bg-[#161622]">
          <span className="text-2xl font-extrabold text-white">{stats.total}</span>
          <p className="text-xs text-slate-400 font-bold uppercase">Total</p>
        </div>
        <div className="neo-card p-4 border-3 border-black shadow-[4px_4px_0px_0px_#00F0FF] text-center space-y-1 bg-neo-cyan text-black font-bold">
          <span className="text-2xl font-extrabold">{stats.new}</span>
          <p className="text-xs text-black uppercase font-bold">New</p>
        </div>
        <div className="neo-card p-4 border-3 border-black shadow-[4px_4px_0px_0px_#FFE600] text-center space-y-1 bg-neo-yellow text-black font-bold">
          <span className="text-2xl font-extrabold">{stats.underReview}</span>
          <p className="text-xs text-black uppercase font-bold">Under Review</p>
        </div>
        <div className="neo-card p-4 border-3 border-black shadow-[4px_4px_0px_0px_#A855F7] text-center space-y-1 bg-neo-purple text-white font-bold">
          <span className="text-2xl font-extrabold">{stats.inProgress}</span>
          <p className="text-xs text-white uppercase font-bold">In Progress</p>
        </div>
        <div className="neo-card p-4 border-3 border-black shadow-[4px_4px_0px_0px_#00FF66] text-center space-y-1 bg-neo-green text-black font-bold">
          <span className="text-2xl font-extrabold">{stats.resolved}</span>
          <p className="text-xs text-black uppercase font-bold">Resolved</p>
        </div>
        <div className="neo-card p-4 border-3 border-black shadow-[4px_4px_0px_0px_#000] text-center space-y-1 bg-slate-800 text-slate-300">
          <span className="text-2xl font-extrabold">{stats.closed}</span>
          <p className="text-xs text-slate-300 uppercase font-bold">Closed</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="neo-card p-4 border-3 border-black shadow-[6px_6px_0px_0px_#000] space-y-4 bg-[#161622]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
          
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="lg:col-span-2 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, subject, text..."
              className="w-full pl-9 pr-4 py-2 bg-[#121218] border-2 border-black text-white placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-neo-cyan"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 stroke-[2.5]" />
          </form>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#121218] border-2 border-black text-white font-pixel text-xs focus:outline-none focus:border-neo-cyan"
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
            className="px-3 py-2 bg-[#121218] border-2 border-black text-white font-pixel text-xs focus:outline-none focus:border-neo-cyan"
          >
            <option value="all">All Priorities</option>
            <option value="NORMAL">Normal</option>
            <option value="URGENT">Urgent</option>
          </select>

          {/* Sort Filter */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 bg-[#121218] border-2 border-black text-white font-pixel text-xs focus:outline-none focus:border-neo-cyan"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

        </div>
      </div>

      {/* Grievances Table */}
      <div className="neo-card border-3 border-black shadow-[8px_8px_0px_0px_#A855F7] overflow-hidden bg-[#161622]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-200 font-mono">
            <thead className="bg-[#121218] font-pixel text-xs uppercase text-neo-cyan border-b-3 border-black">
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
            <tbody className="divide-y-2 divide-black">
              {grievances.map((item) => (
                <tr key={item.id} className="hover:bg-[#1C1C2B] transition-colors">
                  <td className="px-6 py-4 font-pixel font-bold text-neo-yellow">
                    {item.publicId}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString()}
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
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#121218] text-neo-cyan border border-black text-[11px] font-pixel font-bold">
                      <Lock className="w-3 h-3 text-neo-cyan stroke-[2.5]" />
                      <span>Restricted</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openDetailModal(item.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neo-purple text-white border-2 border-black font-pixel text-xs font-bold shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-2xl bg-[#161622] border-l-4 border-black h-full overflow-y-auto p-6 sm:p-8 space-y-8 relative">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setSelectedGrievanceId(null);
                setDetail(null);
                setUnlockedIdentity(null);
              }}
              className="absolute top-6 right-6 p-2 bg-neo-pink text-white border-2 border-black shadow-[2px_2px_0px_0px_#000]"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>

            {detailLoading || !detail ? (
              <div className="min-h-[50vh] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-neo-cyan border-t-transparent animate-spin" />
              </div>
            ) : (
              <div className="space-y-8">
                
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-2xl font-extrabold text-neo-cyan">
                      {detail.publicId}
                    </span>
                    <span className={`px-2.5 py-1 text-xs font-pixel font-bold badge-status-${detail.status}`}>
                      {detail.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h2 className="font-pixel text-xl font-bold text-white">{detail.subject}</h2>
                  <p className="text-xs text-slate-300 font-mono">
                    Category: {detail.categoryName} • Created: {new Date(detail.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Submitter Identity Protection Box */}
                <div className="p-5 bg-[#121218] border-3 border-black shadow-[4px_4px_0px_0px_#00F0FF] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neo-cyan font-pixel">
                      <Lock className="w-4 h-4 text-neo-cyan stroke-[2.5]" />
                      <span>Complainant Identity Protection</span>
                    </div>
                    <span className="text-[10px] uppercase font-pixel font-bold px-2 py-0.5 bg-neo-yellow text-black border border-black">
                      CONFIDENTIAL
                    </span>
                  </div>

                  {unlockedIdentity ? (
                    <div className="p-4 bg-neo-green text-black border-2 border-black space-y-2 text-xs font-mono font-bold">
                      <p className="font-pixel uppercase">★ Identity Unlocked (Logged in Audit Trail)</p>
                      <div className="grid grid-cols-2 gap-2 text-black">
                        <p><strong>Name:</strong> {unlockedIdentity.name}</p>
                        <p><strong>Email:</strong> {unlockedIdentity.email}</p>
                        <p><strong>Department:</strong> {unlockedIdentity.department}</p>
                        <p><strong>Year:</strong> {unlockedIdentity.year}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                      <span>Status: <strong className="text-neo-yellow font-pixel font-bold">Restricted from Reviewers</strong></span>
                      {userRole === 'SUPER_ADMIN' ? (
                        <button
                          onClick={() => setShowIdentityModal(true)}
                          className="px-3 py-1.5 bg-neo-pink text-white border-2 border-black font-pixel font-bold text-xs shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5"
                        >
                          Request Identity Access
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Identity access restricted to SUPER_ADMIN</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Status Update Control */}
                <div className="p-5 bg-[#121218] border-3 border-black space-y-2">
                  <label className="block text-xs font-bold text-neo-yellow uppercase font-pixel">
                    Change Grievance Status
                  </label>
                  <select
                    value={detail.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#161622] border-2 border-black text-white font-pixel text-xs focus:outline-none focus:border-neo-cyan"
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
                  <h3 className="text-xs uppercase font-pixel font-bold text-neo-cyan">Grievance Description</h3>
                  <div className="p-5 bg-[#121218] border-2 border-black text-sm text-slate-200 font-mono leading-relaxed whitespace-pre-wrap">
                    {detail.description}
                  </div>
                </div>

                {/* Attachments */}
                {detail.attachments && detail.attachments.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs uppercase font-pixel font-bold text-neo-yellow">Submitted Attachments</h3>
                    <div className="space-y-2 font-mono">
                      {detail.attachments.map((att) => (
                        <a
                          key={att.id}
                          href={`/api/attachments/${att.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3.5 bg-[#121218] border-2 border-black text-xs text-neo-cyan font-bold transition-all hover:bg-neo-cyan hover:text-black"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Paperclip className="w-4 h-4 shrink-0 stroke-[2.5]" />
                            <span className="truncate">{att.originalFilename}</span>
                          </div>
                          <span className="uppercase text-[11px]">Download</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Official Public Responses */}
                <div className="space-y-3 pt-4 border-t-3 border-black">
                  <h3 className="text-xs uppercase font-pixel font-bold text-neo-cyan">
                    Official Responses (Visible to Submitter)
                  </h3>

                  <form onSubmit={handleAddResponse} className="space-y-2 font-mono">
                    <textarea
                      value={newResponse}
                      onChange={(e) => setNewResponse(e.target.value)}
                      placeholder="Write official response message..."
                      rows={3}
                      className="w-full px-4 py-2.5 bg-[#121218] border-2 border-black text-white placeholder-slate-500 text-xs focus:outline-none focus:border-neo-cyan"
                    />
                    <button
                      type="submit"
                      disabled={submittingAction || !newResponse.trim()}
                      className="px-4 py-2 bg-neo-cyan text-black font-pixel font-bold text-xs border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 uppercase"
                    >
                      <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Publish Response</span>
                    </button>
                  </form>

                  <div className="space-y-2 pt-2 font-mono">
                    {detail.responses.map((resp) => (
                      <div key={resp.id} className="p-4 bg-[#121218] border-2 border-black text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-neo-cyan font-pixel font-bold">
                          <span>{resp.admin?.name || 'Admin'}</span>
                          <span>{new Date(resp.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-200">{resp.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Internal Admin Notes */}
                <div className="space-y-3 pt-4 border-t-3 border-black">
                  <h3 className="text-xs uppercase font-pixel font-bold text-neo-purple">
                    Internal Reviewer Notes (Private to Admins)
                  </h3>

                  <form onSubmit={handleAddNote} className="space-y-2 font-mono">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add internal investigation note..."
                      rows={2}
                      className="w-full px-4 py-2.5 bg-[#121218] border-2 border-black text-white placeholder-slate-500 text-xs focus:outline-none focus:border-neo-purple"
                    />
                    <button
                      type="submit"
                      disabled={submittingAction || !newNote.trim()}
                      className="px-4 py-2 bg-neo-purple text-white font-pixel font-bold text-xs border-2 border-black shadow-[2px_2px_0px_0px_#FFE600] uppercase"
                    >
                      Add Internal Note
                    </button>
                  </form>

                  <div className="space-y-2 pt-2 font-mono">
                    {detail.adminNotes.map((n) => (
                      <div key={n.id} className="p-3.5 bg-[#121218] border-2 border-black text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-pixel">
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
          <div className="w-full max-w-md neo-card p-6 border-3 border-black shadow-[8px_8px_0px_0px_#FF2E93] space-y-5 bg-[#161622]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-neo-pink font-pixel font-bold text-sm">
                <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                <span>Restricted Identity Access</span>
              </div>
              <button onClick={() => setShowIdentityModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5 stroke-[3]" />
              </button>
            </div>

            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              Accessing complainant identity requires explicit justification. This request will be permanently logged in the <code className="text-neo-cyan font-pixel font-bold">IdentityAccessLog</code> audit table.
            </p>

            {unlockError && (
              <div className="p-3 bg-neo-pink text-white border-2 border-black text-xs font-mono">
                {unlockError}
              </div>
            )}

            <form onSubmit={handleUnlockIdentity} className="space-y-4 font-mono">
              <div>
                <label className="block text-xs font-pixel font-bold text-white mb-1 uppercase">
                  Mandatory Justification Reason <span className="text-neo-pink">*</span>
                </label>
                <textarea
                  value={identityReason}
                  onChange={(e) => setIdentityReason(e.target.value)}
                  placeholder="State legitimate operational or safety reason..."
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 bg-[#121218] border-2 border-black text-white text-xs focus:outline-none focus:border-neo-pink"
                />
              </div>

              <div className="flex items-center justify-end gap-3 font-pixel">
                <button
                  type="button"
                  onClick={() => setShowIdentityModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 border-2 border-black text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={unlockLoading || !identityReason.trim()}
                  className="px-5 py-2 bg-neo-pink text-white font-bold text-xs border-2 border-black shadow-[2px_2px_0px_0px_#FFE600] uppercase"
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
          <div className="w-full max-w-md neo-card p-6 border-3 border-black shadow-[8px_8px_0px_0px_#00F0FF] space-y-5 bg-[#161622]">
            <div className="flex items-center justify-between">
              <h3 className="font-pixel font-bold text-white text-sm uppercase">Export Grievances (CSV)</h3>
              <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5 stroke-[3]" />
              </button>
            </div>

            <p className="text-xs text-slate-300 font-mono">
              Export all grievances in CSV format for administrative recordkeeping.
            </p>

            <div className="space-y-3 pt-2 font-mono">
              {userRole === 'SUPER_ADMIN' && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportIncludeIdentity}
                    onChange={(e) => setExportIncludeIdentity(e.target.checked)}
                    className="w-4 h-4 border-2 border-black bg-[#121218] accent-neo-pink"
                  />
                  <span className="text-xs text-neo-pink font-bold">Include Complainant Identity Details (SUPER_ADMIN)</span>
                </label>
              )}

              {exportIncludeIdentity && (
                <div>
                  <label className="block text-xs font-pixel font-bold text-white mb-1 uppercase">
                    Justification Reason for Identity Export
                  </label>
                  <input
                    type="text"
                    value={exportReason}
                    onChange={(e) => setExportReason(e.target.value)}
                    placeholder="Reason for exporting identities..."
                    required
                    className="w-full px-4 py-2 bg-[#121218] border-2 border-black text-white text-xs"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-black font-pixel">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 border-2 border-black text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={triggerExport}
                className="px-5 py-2 bg-neo-cyan text-black font-bold text-xs border-2 border-black shadow-[2px_2px_0px_0px_#000] uppercase"
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

