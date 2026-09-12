'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  ShieldCheck,
  Lock,
  Menu,
  X,
  FileText,
  Search,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const isAdmin = session?.user?.role && ['REVIEWER', 'ADMIN', 'SUPER_ADMIN'].includes(session.user.role);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-cyber-bg/85 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400 group-hover:bg-cyan-500/20 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <ShieldCheck className="w-7 h-7" />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider text-white group-hover:text-cyan-400 transition-colors">
                  ASTRA IETM
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                  PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-tight">
                Cyber Security Department Association
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/')
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Home
            </Link>
            <Link
              href="/submit"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/submit')
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              Submit Grievance
            </Link>
            <Link
              href="/track"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/track')
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-4 h-4 text-cyan-400" />
              Track Grievance
            </Link>

            {session && (
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/dashboard')
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                My Grievances
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/admin')
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'bg-purple-950/40 text-purple-300 border border-purple-900/50 hover:bg-purple-900/40'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                Admin Portal
              </Link>
            )}
          </nav>

          {/* Desktop User Widget */}
          <div className="hidden md:flex items-center gap-3">
            {status === 'loading' ? (
              <div className="w-24 h-9 bg-slate-800/60 rounded-lg animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white leading-tight max-w-[120px] truncate">
                      {session.user.name || session.user.email}
                    </p>
                    <p className="text-[10px] text-cyan-400 font-mono">
                      Verified User
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 border border-transparent transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/20 border border-cyan-400/30 transition-all hover:scale-[1.02]"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-3 rounded-lg text-sm font-medium ${
              isActive('/') ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-300'
            }`}
          >
            Home
          </Link>
          <Link
            href="/submit"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${
              isActive('/submit') ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            Submit Grievance
          </Link>
          <Link
            href="/track"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${
              isActive('/track') ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-300'
            }`}
          >
            <Search className="w-4 h-4 text-cyan-400" />
            Track Grievance
          </Link>

          {session && (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${
                isActive('/dashboard') ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-300'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              My Grievances
            </Link>
          )}

          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-purple-950/50 text-purple-300 border border-purple-800/50"
            >
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              Admin Portal
            </Link>
          )}

          <div className="pt-4 border-t border-slate-800">
            {session ? (
              <div className="space-y-3">
                <div className="px-4 py-2 bg-slate-900 rounded-lg border border-slate-800">
                  <p className="text-xs text-slate-400">Signed in as:</p>
                  <p className="text-sm font-medium text-white truncate">{session.user.name || session.user.email}</p>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 text-sm font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/20 text-sm"
              >
                <LogIn className="w-4 h-4" />
                Sign In with Google
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
