import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  FileText,
  Search,
  CheckCircle2,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Sign in securely',
    description: 'Authenticate using your Google account to verify authorized department membership.',
    icon: KeyRound,
    color: 'bg-neo-cyan text-black',
  },
  {
    step: '02',
    title: 'Submit your grievance',
    description: 'Describe your concern, select priority, and optionally attach supporting files.',
    icon: FileText,
    color: 'bg-neo-yellow text-black',
  },
  {
    step: '03',
    title: 'Track your grievance',
    description: 'Use your unique grievance ID (e.g. GRV-2026-0001) to monitor review progress.',
    icon: Search,
    color: 'bg-neo-pink text-white',
  },
];

const categories = [
  { name: 'Academic', desc: 'Curriculum, classes & course scheduling', tag: 'Academic' },
  { name: 'Faculty / Teaching', desc: 'Evaluation, teaching & interactions', tag: 'Teaching' },
  { name: 'Harassment / Misconduct', desc: 'Ragging, bullying & conduct issues', tag: 'Protection' },
  { name: 'Student Association', desc: 'Association elections, concerns & activities', tag: 'Association' },
];


export default function LandingPage() {
  return (
    <div className="space-y-24 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative text-center space-y-8 max-w-4xl mx-auto">
          
          {/* Header Badges */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-neo-yellow text-black font-pixel text-xs font-bold border-3 border-black shadow-[4px_4px_0px_0px_#000] animate-cyber-pulse">
            <ShieldCheck className="w-4 h-4 text-black stroke-[3]" />
            <span>[★ ASTRA IETM • CYBER SECURITY ASSOCIATION ★]</span>
          </div>

          {/* Hero Titles */}
          <div className="space-y-4">
            <h1 className="font-pixel text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
              CONFIDENTIAL <br />
              <span className="text-neo-cyan text-shadow-[4px_4px_0_#000]">GRIEVANCE PORTAL</span>
            </h1>
            <p className="text-lg sm:text-xl font-bold text-neo-yellow tracking-widest uppercase font-mono">
              “Speak up. Be heard. Stay protected.”
            </p>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-mono">
            A secure platform for students and department members of KMCT Institute of Emerging Technology and Management to report concerns, issues, and grievances confidentially.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-neo-cyan text-black font-pixel text-sm font-bold border-3 border-black shadow-[5px_5px_0px_0px_#FFE600] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
            >
              <FileText className="w-5 h-5 stroke-[2.5]" />
              <span>Submit a Grievance</span>
              <ArrowRight className="w-4 h-4 ml-1 stroke-[3]" />
            </Link>
            <Link
              href="/track"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-neo-card text-white hover:bg-neo-cardHover font-pixel text-sm font-bold border-3 border-black shadow-[5px_5px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
            >
              <Search className="w-5 h-5 text-neo-cyan stroke-[2.5]" />
              <span>Track Grievance</span>
            </Link>
          </div>

          {/* Retro Arcade Stats Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 max-w-3xl mx-auto">
            <div className="p-4 bg-[#161622] border-3 border-black shadow-[4px_4px_0px_0px_#00F0FF] text-center">
              <p className="font-pixel text-2xl font-bold text-neo-cyan">100%</p>
              <p className="font-mono text-xs text-slate-300">Identity Shielded</p>
            </div>
            <div className="p-4 bg-[#161622] border-3 border-black shadow-[4px_4px_0px_0px_#FFE600] text-center">
              <p className="font-pixel text-2xl font-bold text-neo-yellow">24 / 7</p>
              <p className="font-mono text-xs text-slate-300">Live Status Tracker</p>
            </div>
            <div className="p-4 bg-[#161622] border-3 border-black shadow-[4px_4px_0px_0px_#FF2E93] text-center">
              <p className="font-pixel text-2xl font-bold text-neo-pink">Google</p>
              <p className="font-mono text-xs text-slate-300">OAuth Verified</p>
            </div>
          </div>

          {/* Privacy Message Banner */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="p-4 bg-[#161622] border-3 border-black shadow-[4px_4px_0px_0px_#000] text-left flex items-start gap-3.5">
              <Lock className="w-5 h-5 text-neo-cyan shrink-0 mt-0.5 stroke-[2.5]" />
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                <strong className="text-neo-yellow font-bold uppercase font-pixel">[Privacy Protection]:</strong> Your identity is verified securely through Google. Your identity is not displayed to grievance reviewers.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <span className="px-3 py-1 bg-neo-pink text-white font-pixel text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_#000]">
            WORKFLOW
          </span>
          <h2 className="font-pixel text-3xl sm:text-4xl font-extrabold text-white">How It Works</h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto font-mono">
            Three simple steps to submit and monitor your grievances with full confidentiality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative neo-card neo-card-hover p-8 border-3 border-black flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-pixel text-3xl font-extrabold text-slate-600">
                      #{item.step}
                    </span>
                    <div className={`p-3 border-2 border-black shadow-[2px_2px_0px_0px_#000] ${item.color}`}>
                      <Icon className="w-6 h-6 stroke-[2.5]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-pixel text-lg font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-300 font-mono leading-relaxed">{item.description}</p>
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t-2 border-black flex items-center justify-between text-xs font-pixel text-neo-cyan">
                  <span>Step {item.step} Process</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* GRIEVANCE CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="neo-card p-8 sm:p-12 border-3 border-black space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-3 border-black">
            <div>
              <span className="px-3 py-1 bg-neo-cyan text-black font-pixel text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                CATEGORIES
              </span>
              <h2 className="font-pixel text-3xl font-extrabold text-white mt-3">Grievance Classifications</h2>
              <p className="text-sm text-slate-300 font-mono mt-2">
                We handle concerns across all academic, departmental, and personal protection domains.
              </p>
            </div>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-neo-yellow text-black border-2 border-black font-pixel text-xs font-bold shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all self-start md:self-auto"
            >
              <span>Submit Under Category</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="p-5 bg-[#121218] border-2 border-black hover:border-neo-cyan shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#00F0FF] transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-pixel font-bold text-white text-sm">{cat.name}</h3>
                  <span className="text-[10px] uppercase font-pixel font-bold px-2 py-0.5 bg-neo-pink text-white border border-black">
                    {cat.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono">{cat.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECURITY & TRUST HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Confidentiality Assurance */}
          <div className="neo-card p-8 border-3 border-black shadow-[6px_6px_0px_0px_#00F0FF] space-y-4">
            <div className="p-3 bg-neo-cyan text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] w-fit">
              <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="font-pixel text-xl font-bold text-white">Identity Protection Model</h3>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              Google authentication is utilized exclusively to prevent spam and verify active department membership. Normal reviewers (`REVIEWER` & `ADMIN` roles) only see grievance content, category, and timestamps—your name and email remain hidden.
            </p>
            <ul className="space-y-2 pt-2 text-xs font-mono text-slate-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neo-green shrink-0 stroke-[2.5]" />
                <span>Identity hidden from department reviewers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neo-green shrink-0 stroke-[2.5]" />
                <span>Mandatory justification & audit logging for admin identity access</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Tracking & ID Generation */}
          <div className="neo-card p-8 border-3 border-black shadow-[6px_6px_0px_0px_#FFE600] space-y-4">
            <div className="p-3 bg-neo-yellow text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] w-fit">
              <Sparkles className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="font-pixel text-xl font-bold text-white">Unique Grievance ID Tracking</h3>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              Upon submission, a unique reference ID (such as <code className="text-black font-pixel bg-neo-yellow px-1.5 py-0.5 border border-black">GRV-2026-0001</code>) is automatically generated. Use this ID anytime to check status, review official responses, or submit updates.
            </p>
            <ul className="space-y-2 pt-2 text-xs font-mono text-slate-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neo-cyan shrink-0 stroke-[2.5]" />
                <span>Transparent status progression (Under Review → Resolved)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neo-cyan shrink-0 stroke-[2.5]" />
                <span>Server-side IDOR authorization safeguards</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative neo-card p-10 sm:p-16 border-3 border-black shadow-[8px_8px_0px_0px_#FF2E93] text-center space-y-6 bg-gradient-to-r from-[#161622] via-[#1A1A2A] to-[#161622]">
          
          <h2 className="font-pixel text-3xl sm:text-4xl font-extrabold text-white">
            Have a concern or suggestion?
          </h2>
          <p className="text-sm font-mono text-slate-300 max-w-xl mx-auto">
            Your voice helps maintain standard academic integrity, safety, and operational excellence across the Cyber Security Department.
          </p>

          <div className="pt-2">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-8 py-4 bg-neo-yellow text-black font-pixel text-sm font-bold border-3 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              <FileText className="w-5 h-5 stroke-[2.5]" />
              <span>Submit Grievance Now</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

