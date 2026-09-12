import Link from 'next/link';
import { ShieldCheck, Lock, EyeOff, FileText, CheckCircle2, ShieldAlert, KeyRound } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Privacy & Security Policy</h1>
        <p className="text-sm text-slate-400 font-mono">
          ASTRA IETM • Cyber Security Department Association • grievance.astraietm.in
        </p>
      </div>

      {/* Main Privacy Notice Card */}
      <div className="glass-card p-8 sm:p-12 rounded-3xl border border-cyan-500/30 space-y-8 shadow-2xl">
        
        <div className="p-6 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex items-start gap-4">
          <Lock className="w-6 h-6 text-cyan-400 shrink-0 mt-1" />
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Confidentiality Guarantee</h3>
            <p className="text-sm text-cyan-200/90 leading-relaxed">
              “Your Google account is used to verify that you are an authorized user and to help prevent fraudulent submissions. Your identity is stored securely but is not displayed to normal grievance reviewers. Identity information may only be accessed by authorized administrators when necessary and such access should be logged.”
            </p>
          </div>
        </div>

        {/* Section 1: Authentication & Verification */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <KeyRound className="w-5 h-5 text-cyan-400" />
            <h2>1. Identity Verification via Google OAuth</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            To ensure the integrity of the grievance submission process and prevent automated spam or malicious reports, users authenticate using Sign-in with Google. Verification confirms membership within KMCT Institute of Engineering and Technology and the Cyber Security Department Association.
          </p>
        </div>

        {/* Section 2: Identity Isolation Architecture */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <EyeOff className="w-5 h-5 text-cyan-400" />
            <h2>2. Server-Side Identity Isolation & Role Permissions</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            The platform strictly separates user identity from grievance content at the database and API authorization layers:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-blue-400">REVIEWER</span>
              <p className="text-xs text-slate-300">
                Can view grievance details, update review status, add internal notes, and publish official responses. <strong>Identity remains strictly hidden.</strong>
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-purple-400">ADMIN</span>
              <p className="text-xs text-slate-300">
                Manages grievance assignments, review workflows, category configurations, and operational statistics. <strong>Identity remains strictly hidden.</strong>
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-rose-400">SUPER_ADMIN</span>
              <p className="text-xs text-slate-300">
                Full administrative oversight. May access complainant identity only when legitimately required, subject to mandatory justification logging.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Audit Logging */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <h2>3. Identity Access Audit Logging</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Any attempt to view or export a complainant&apos;s identity details generates a permanent record in the <code className="text-cyan-400 font-mono">IdentityAccessLog</code> system table, recording the administrator ID, exact timestamp, and mandatory justification reason.
          </p>
        </div>

        {/* Section 4: Security Safeguards */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h2>4. Technical Security Controls</h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
            <li className="flex items-center gap-2 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>HTTPS Transport Layer Encryption</span>
            </li>
            <li className="flex items-center gap-2 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>HttpOnly, SameSite Session Cookies</span>
            </li>
            <li className="flex items-center gap-2 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Server-Side Authorization (Anti-IDOR)</span>
            </li>
            <li className="flex items-center gap-2 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>File Upload Validation & MIME Sanitization</span>
            </li>
            <li className="flex items-center gap-2 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>SQL Injection Protection (Prisma ORM)</span>
            </li>
            <li className="flex items-center gap-2 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Rate Limiting & Brute-Force Defense</span>
            </li>
          </ul>
        </div>

        {/* Back Link */}
        <div className="pt-6 text-center">
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-sm font-semibold transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Proceed to Grievance Submission</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
