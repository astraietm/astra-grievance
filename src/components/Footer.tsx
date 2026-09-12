import Link from 'next/link';
import { ShieldCheck, Lock, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Organization */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white tracking-wide">ASTRA IETM</h3>
                <p className="text-xs text-cyan-400 font-mono">Cyber Security Department Association</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              KMCT Institute of Engineering and Technology. Confidential Grievance Submission Portal for students, faculty, and department members. Designed for secure, trustworthy reporting.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-300">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Identity verified via Google & confidential from reviewers</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Quick Portal Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-cyan-400 transition-colors">Submit Grievance</Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-cyan-400 transition-colors">Track Grievance Status</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Notice & Security</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Official Domains */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Official Web Resources</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://astraietm.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
                >
                  <span>Main Website (astraietm.in)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://grievance.astraietm.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
                >
                  <span>grievance.astraietm.in</span>
                  <ExternalLink className="w-3 h-3 text-cyan-500" />
                </a>
              </li>
              <li className="pt-2 text-slate-500 text-[11px]">
                KMCT Institute of Engineering and Technology, Kozhikode, Kerala.
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ASTRA IETM - Cyber Security Department Association. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/privacy" className="hover:text-slate-300">Privacy Notice</Link>
            <span>•</span>
            <span className="text-slate-400 font-mono">grievance.astraietm.in</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
