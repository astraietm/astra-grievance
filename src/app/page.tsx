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
  Layers,
  Award,
  ChevronRight,
} from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Sign in securely',
    description: 'Authenticate using your Google account to verify authorized department membership.',
    icon: KeyRound,
  },
  {
    step: '02',
    title: 'Submit your grievance',
    description: 'Describe your concern, select priority, and optionally attach supporting files.',
    icon: FileText,
  },
  {
    step: '03',
    title: 'Track your grievance',
    description: 'Use your unique grievance ID (e.g. GRV-2026-0001) to monitor review progress.',
    icon: Search,
  },
];

const categories = [
  { name: 'Academic', desc: 'Curriculum, classes & course scheduling', tag: 'Academic' },
  { name: 'Faculty / Teaching', desc: 'Evaluation, teaching & interactions', tag: 'Teaching' },
  { name: 'Examination', desc: 'Exams, hall tickets & re-evaluation', tag: 'Exams' },
  { name: 'Infrastructure', desc: 'Classrooms, Wi-Fi & library amenities', tag: 'Campus' },
  { name: 'Laboratory', desc: 'Lab equipment, software & safety', tag: 'Labs' },
  { name: 'Hostel', desc: 'Accommodation, food & hostel rules', tag: 'Hostel' },
  { name: 'Transportation', desc: 'College buses & transit safety', tag: 'Transit' },
  { name: 'Harassment / Misconduct', desc: 'Ragging, bullying & conduct issues', tag: 'Protection' },
  { name: 'Discrimination', desc: 'Bias or unfair treatment concerns', tag: 'Equity' },
  { name: 'Cybersecurity / Digital Safety', desc: 'Privacy, unauthorized access & digital safety', tag: 'Cyber' },
  { name: 'Department Activities', desc: 'ASTRA association workshops & events', tag: 'Events' },
  { name: 'Administrative', desc: 'Fee payments, certificates & requests', tag: 'Admin' },
];

export default function LandingPage() {
  return (
    <div className="space-y-24 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Glow backdrop effects */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative text-center space-y-8 max-w-4xl mx-auto">
          
          {/* Header Badges */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wide shadow-lg shadow-cyan-950/50 animate-cyber-pulse">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>ASTRA IETM • Cyber Security Department Association</span>
          </div>

          {/* Hero Titles */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
              CONFIDENTIAL <br />
              <span className="text-cyan-gradient">GRIEVANCE PORTAL</span>
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-slate-300 tracking-wide font-mono">
              “Speak up. Be heard. Stay protected.”
            </p>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A secure platform for students and department members of KMCT Institute of Engineering and Technology to report concerns, issues, and grievances confidentially.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-cyan-500/25 border border-cyan-400/40 transition-all hover:scale-[1.03]"
            >
              <FileText className="w-5 h-5" />
              <span>Submit a Grievance</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <Link
              href="/track"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl glass-card hover:bg-slate-800/80 text-slate-200 hover:text-white font-semibold text-base border border-slate-700 transition-all hover:border-cyan-500/40"
            >
              <Search className="w-5 h-5 text-cyan-400" />
              <span>Track Grievance</span>
            </Link>
          </div>

          {/* Privacy Message Banner */}
          <div className="pt-6 max-w-xl mx-auto">
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/50 backdrop-blur-md text-left flex items-start gap-3.5 shadow-md">
              <Lock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-xs text-cyan-200/90 leading-relaxed font-sans">
                <strong className="text-white font-semibold">Privacy Protection:</strong> Your identity is verified securely through Google. Your identity is not displayed to grievance reviewers.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-bold">Workflow</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">How It Works</h3>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Three simple steps to submit and monitor your grievances with full confidentiality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative glass-card glass-card-hover p-8 rounded-2xl border border-slate-800 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-extrabold font-mono text-cyan-500/40">
                      {item.step}
                    </span>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-cyan-400">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-white">{item.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center text-xs font-mono text-cyan-400 gap-1">
                  <span>Step {item.step} Process</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* GRIEVANCE CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-bold">Categories</span>
              <h3 className="text-3xl font-extrabold text-white mt-1">Grievance Classifications</h3>
              <p className="text-sm text-slate-400 mt-2">
                We handle concerns across all academic, departmental, and personal protection domains.
              </p>
            </div>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-sm font-semibold transition-all self-start md:self-auto"
            >
              <span>Submit Under Category</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-base">{cat.name}</h4>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {cat.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{cat.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECURITY & TRUST HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Confidentiality Assurance */}
          <div className="glass-card p-8 rounded-2xl border border-cyan-500/20 space-y-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 w-fit">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Identity Protection Model</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Google authentication is utilized exclusively to prevent spam and verify active department membership. Normal reviewers (`REVIEWER` & `ADMIN` roles) only see grievance content, category, and timestamps—your name and email remain hidden.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Identity hidden from department reviewers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Mandatory justification & audit logging for admin identity access</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Tracking & ID Generation */}
          <div className="glass-card p-8 rounded-2xl border border-slate-800 space-y-4">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 w-fit">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Unique Grievance ID Tracking</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Upon submission, a unique reference ID (such as <code className="text-cyan-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded">GRV-2026-0001</code>) is automatically generated. Use this ID anytime to check status, review official responses, or submit updates.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Transparent status progression (Under Review → Resolved)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Server-side IDOR authorization safeguards</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950/80 border border-cyan-500/30 p-10 sm:p-16 text-center space-y-6 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-40" />
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Have a concern or suggestion?
          </h2>
          <p className="text-base text-slate-300 max-w-xl mx-auto">
            Your voice helps maintain standard academic integrity, safety, and operational excellence across the Cyber Security Department.
          </p>

          <div className="pt-2">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-base shadow-xl shadow-cyan-500/30 border border-cyan-400/50 transition-all hover:scale-105"
            >
              <FileText className="w-5 h-5" />
              <span>Submit Grievance Now</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
