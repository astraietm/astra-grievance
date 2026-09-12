'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  ShieldCheck,
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
    <header className="sticky top-0 z-50 bg-[#121218] border-b-4 border-black shadow-[0_4px_0_0_#000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-neo-cyan border-3 border-black shadow-[3px_3px_0px_0px_#FFE600] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all">
              <ShieldCheck className="w-7 h-7 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-xl font-bold tracking-wider text-neo-cyan group-hover:text-neo-yellow transition-colors">
                  ASTRA IETM
                </span>
                <span className="font-pixel text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-neo-yellow text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                  PORTAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight">
                Cyber Security Department Association
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 bg-[#1A1A26] p-1.5 border-3 border-black shadow-[3px_3px_0px_0px_#000]">
            <Link
              href="/"
              className={`px-3.5 py-1.5 font-pixel text-xs font-bold transition-all border-2 border-black ${
                isActive('/')
                  ? 'bg-neo-yellow text-black shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-[#121218] text-slate-300 hover:text-white hover:bg-neo-cardHover'
              }`}
            >
              Home
            </Link>
            <Link
              href="/submit"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 font-pixel text-xs font-bold transition-all border-2 border-black ${
                isActive('/submit')
                  ? 'bg-neo-cyan text-black shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-[#121218] text-slate-300 hover:text-white hover:bg-neo-cardHover'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Submit Grievance
            </Link>
            <Link
              href="/track"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 font-pixel text-xs font-bold transition-all border-2 border-black ${
                isActive('/track')
                  ? 'bg-neo-pink text-white shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-[#121218] text-slate-300 hover:text-white hover:bg-neo-cardHover'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Track Grievance
            </Link>

            {session && (
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 font-pixel text-xs font-bold transition-all border-2 border-black ${
                  isActive('/dashboard')
                    ? 'bg-neo-green text-black shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-[#121218] text-slate-300 hover:text-white hover:bg-neo-cardHover'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                My Grievances
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 font-pixel text-xs font-bold transition-all border-2 border-black ${
                  isActive('/admin')
                    ? 'bg-neo-purple text-white shadow-[2px_2px_0px_0px_#FFE600]'
                    : 'bg-neo-purple/80 text-white hover:bg-neo-purple'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-neo-yellow" />
                Admin Portal
              </Link>
            )}
          </nav>

          {/* Desktop User Widget */}
          <div className="hidden md:flex items-center gap-3">
            {status === 'loading' ? (
              <div className="w-24 h-9 bg-slate-800 border-2 border-black animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1A26] border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                  <UserCheck className="w-4 h-4 text-neo-green shrink-0" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-white leading-tight max-w-[120px] truncate">
                      {session.user.name || session.user.email}
                    </p>
                    <p className="text-[9px] text-neo-cyan font-pixel uppercase tracking-wider">
                      Verified User
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 bg-neo-pink text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 font-pixel text-xs font-bold bg-neo-cyan text-black border-3 border-black shadow-[4px_4px_0px_0px_#FFE600] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-neo-yellow text-black border-3 border-black shadow-[3px_3px_0px_0px_#000]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 stroke-[3]" /> : <Menu className="w-6 h-6 stroke-[3]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b-4 border-black bg-[#161622] px-4 pt-3 pb-6 space-y-2 border-t-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-3 font-pixel text-xs font-bold border-2 border-black ${
              isActive('/') ? 'bg-neo-yellow text-black shadow-[2px_2px_0px_0px_#000]' : 'text-slate-200 bg-[#121218]'
            }`}
          >
            Home
          </Link>
          <Link
            href="/submit"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2 px-4 py-3 font-pixel text-xs font-bold border-2 border-black ${
              isActive('/submit') ? 'bg-neo-cyan text-black shadow-[2px_2px_0px_0px_#000]' : 'text-slate-200 bg-[#121218]'
            }`}
          >
            <FileText className="w-4 h-4 text-black" />
            Submit Grievance
          </Link>
          <Link
            href="/track"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2 px-4 py-3 font-pixel text-xs font-bold border-2 border-black ${
              isActive('/track') ? 'bg-neo-pink text-white shadow-[2px_2px_0px_0px_#000]' : 'text-slate-200 bg-[#121218]'
            }`}
          >
            <Search className="w-4 h-4 text-white" />
            Track Grievance
          </Link>

          {session && (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 font-pixel text-xs font-bold border-2 border-black ${
                isActive('/dashboard') ? 'bg-neo-green text-black shadow-[2px_2px_0px_0px_#000]' : 'text-slate-200 bg-[#121218]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-black" />
              My Grievances
            </Link>
          )}

          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 font-pixel text-xs font-bold bg-neo-purple text-white border-2 border-black shadow-[2px_2px_0px_0px_#FFE600]"
            >
              <ShieldAlert className="w-4 h-4 text-neo-yellow" />
              Admin Portal
            </Link>
          )}

          <div className="pt-4 border-t-2 border-black">
            {session ? (
              <div className="space-y-3">
                <div className="px-4 py-2 bg-[#121218] border-2 border-black">
                  <p className="text-xs text-slate-400 font-mono">Signed in as:</p>
                  <p className="text-sm font-bold text-white truncate">{session.user.name || session.user.email}</p>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-neo-pink text-white border-2 border-black font-pixel text-xs font-bold shadow-[3px_3px_0px_0px_#000]"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-neo-cyan text-black border-3 border-black font-pixel text-xs font-bold shadow-[4px_4px_0px_0px_#FFE600]"
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

