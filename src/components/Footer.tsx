import Link from 'next/link';
import { ShieldCheck, Lock, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t-4 border-black bg-[#121218] text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Organization */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neo-yellow border-3 border-black shadow-[3px_3px_0px_0px_#000]">
                <ShieldCheck className="w-6 h-6 text-black stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-pixel text-lg font-bold text-white tracking-wide">ASTRA IETM</h3>
                <p className="text-xs text-neo-cyan font-pixel uppercase">Cyber Security Department Association</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 font-mono leading-relaxed max-w-md">
              KMCT Institute of Engineering and Technology. Confidential Grievance Submission Portal for students, faculty, and department members. Designed for secure, trustworthy reporting.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#161622] border-2 border-black shadow-[2px_2px_0px_0px_#000] text-[11px] text-neo-yellow font-pixel">
              <Lock className="w-3.5 h-3.5 text-neo-cyan" />
              <span>[!] Identity verified via Google & confidential from reviewers</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-pixel text-xs font-bold uppercase tracking-wider text-neo-yellow">Quick Portal Links</h4>
            <ul className="space-y-2 font-mono text-xs">
              <li>
                <Link href="/" className="hover:text-neo-cyan transition-colors">➔ Home</Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-neo-cyan transition-colors">➔ Submit Grievance</Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-neo-cyan transition-colors">➔ Track Status</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-neo-cyan transition-colors">➔ Privacy Notice & Security</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Official Domains */}
          <div className="space-y-3">
            <h4 className="font-pixel text-xs font-bold uppercase tracking-wider text-neo-pink">Official Web Resources</h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <a
                  href="https://astraietm.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-neo-yellow transition-colors"
                >
                  <span>Main Website (astraietm.in)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://grievance.astraietm.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-neo-cyan font-bold hover:text-neo-yellow transition-colors font-mono"
                >
                  <span>grievance.astraietm.in</span>
                  <ExternalLink className="w-3 h-3 text-neo-cyan" />
                </a>
              </li>
              <li className="pt-2 text-slate-400 text-[11px]">
                KMCT Institute of Engineering and Technology, Kozhikode, Kerala.
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4 font-mono">
          <p>© {new Date().getFullYear()} ASTRA IETM • Cyber Security Association.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/privacy" className="hover:text-neo-yellow">Privacy Notice</Link>
            <span>•</span>
            <span className="text-neo-cyan font-pixel">grievance.astraietm.in</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

