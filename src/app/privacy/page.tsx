import Link from 'next/link';
import { ShieldCheck, Lock, EyeOff, FileText, CheckCircle2, ShieldAlert, KeyRound } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="mx-auto w-16 h-16 bg-neo-yellow text-black border-3 border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h1 className="font-pixel text-3xl sm:text-4xl font-extrabold text-white">Privacy & Security Policy</h1>
        <p className="text-xs text-neo-cyan font-pixel uppercase tracking-wider">
          ASTRA IETM • Cyber Security Department Association • grievance.astraietm.in
        </p>
      </div>

      {/* Main Privacy Notice Card */}
      <div className="neo-card p-8 sm:p-12 border-3 border-black shadow-[8px_8px_0px_0px_#00F0FF] space-y-8 bg-[#161622]">
        
        <div className="p-6 bg-[#121218] border-3 border-black shadow-[4px_4px_0px_0px_#FFE600] flex items-start gap-4">
          <Lock className="w-6 h-6 text-neo-cyan shrink-0 mt-1 stroke-[2.5]" />
          <div className="space-y-2">
            <h2 className="font-pixel text-lg font-bold text-white">Confidentiality Guarantee</h2>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              “Your Google account is used to verify that you are an authorized user and to help prevent fraudulent submissions. Your identity is stored securely but is not displayed to normal grievance reviewers. Identity information may only be accessed by authorized administrators when necessary and such access should be logged.”
            </p>
          </div>
        </div>

        {/* Section 1: Authentication & Verification */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white font-pixel font-bold text-lg">
            <KeyRound className="w-5 h-5 text-neo-yellow stroke-[2.5]" />
            <h2>1. Identity Verification via Google OAuth</h2>
          </div>
          <p className="text-xs text-slate-300 font-mono leading-relaxed">
            To ensure the integrity of the grievance submission process and prevent automated spam or malicious reports, users authenticate using Sign-in with Google. Verification confirms membership within KMCT Institute of Engineering and Technology and the Cyber Security Department Association.
          </p>
        </div>

        {/* Section 2: Identity Isolation Architecture */}
        <div className="space-y-4 pt-4 border-t-3 border-black">
          <div className="flex items-center gap-2 text-white font-pixel font-bold text-lg">
            <EyeOff className="w-5 h-5 text-neo-cyan stroke-[2.5]" />
            <h2>2. Server-Side Identity Isolation & Role Permissions</h2>
          </div>
          <p className="text-xs text-slate-300 font-mono leading-relaxed">
            The platform strictly separates user identity from grievance content at the database and API authorization layers:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 font-mono">
            <div className="p-4 bg-[#121218] border-2 border-black space-y-2">
              <span className="text-xs font-pixel font-bold text-neo-cyan">REVIEWER</span>
              <p className="text-xs text-slate-300">
                Can view grievance details, update review status, add internal notes, and publish official responses. <strong>Identity remains strictly hidden.</strong>
              </p>
            </div>
            <div className="p-4 bg-[#121218] border-2 border-black space-y-2">
              <span className="text-xs font-pixel font-bold text-neo-purple">ADMIN</span>
              <p className="text-xs text-slate-300">
                Manages grievance assignments, review workflows, category configurations, and operational statistics. <strong>Identity remains strictly hidden.</strong>
              </p>
            </div>
            <div className="p-4 bg-[#121218] border-2 border-black space-y-2">
              <span className="text-xs font-pixel font-bold text-neo-pink">SUPER_ADMIN</span>
              <p className="text-xs text-slate-300">
                Full administrative oversight. May access complainant identity only when legitimately required, subject to mandatory justification logging.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Audit Logging */}
        <div className="space-y-4 pt-4 border-t-3 border-black">
          <div className="flex items-center gap-2 text-white font-pixel font-bold text-lg">
            <ShieldAlert className="w-5 h-5 text-neo-pink stroke-[2.5]" />
            <h2>3. Identity Access Audit Logging</h2>
          </div>
          <p className="text-xs text-slate-300 font-mono leading-relaxed">
            Any attempt to view or export a complainant&apos;s identity details generates a permanent record in the <code className="text-neo-yellow font-pixel font-bold">IdentityAccessLog</code> system table, recording the administrator ID, exact timestamp, and mandatory justification reason.
          </p>
        </div>

        {/* Section 4: Security Safeguards */}
        <div className="space-y-4 pt-4 border-t-3 border-black">
          <div className="flex items-center gap-2 text-white font-pixel font-bold text-lg">
            <ShieldCheck className="w-5 h-5 text-neo-green stroke-[2.5]" />
            <h2>4. Technical Security Controls</h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-slate-200">
            <li className="flex items-center gap-2 p-3 bg-[#121218] border-2 border-black">
              <CheckCircle2 className="w-4 h-4 text-neo-green shrink-0 stroke-[2.5]" />
              <span>HTTPS Transport Layer Encryption</span>
            </li>
            <li className="flex items-center gap-2 p-3 bg-[#121218] border-2 border-black">
              <CheckCircle2 className="w-4 h-4 text-neo-green shrink-0 stroke-[2.5]" />
              <span>HttpOnly, SameSite Session Cookies</span>
            </li>
            <li className="flex items-center gap-2 p-3 bg-[#121218] border-2 border-black">
              <CheckCircle2 className="w-4 h-4 text-neo-green shrink-0 stroke-[2.5]" />
              <span>Server-Side Authorization (Anti-IDOR)</span>
            </li>
            <li className="flex items-center gap-2 p-3 bg-[#121218] border-2 border-black">
              <CheckCircle2 className="w-4 h-4 text-neo-green shrink-0 stroke-[2.5]" />
              <span>File Upload Validation & MIME Sanitization</span>
            </li>
            <li className="flex items-center gap-2 p-3 bg-[#121218] border-2 border-black">
              <CheckCircle2 className="w-4 h-4 text-neo-green shrink-0 stroke-[2.5]" />
              <span>SQL Injection Protection (Prisma ORM)</span>
            </li>
            <li className="flex items-center gap-2 p-3 bg-[#121218] border-2 border-black">
              <CheckCircle2 className="w-4 h-4 text-neo-green shrink-0 stroke-[2.5]" />
              <span>Rate Limiting & Brute-Force Defense</span>
            </li>
          </ul>
        </div>

        {/* Back Link */}
        <div className="pt-6 text-center">
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neo-yellow text-black font-pixel text-xs font-bold border-3 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all uppercase"
          >
            <FileText className="w-4 h-4 stroke-[2.5]" />
            <span>Proceed to Grievance Submission</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

