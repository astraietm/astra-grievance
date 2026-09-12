'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Lock, AlertCircle, Key } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/submit';
  const errorParam = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(errorParam ? 'Unable to sign you in. Please try again.' : '');

  const handleDevLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (res?.error) {
        setErrorMsg('Invalid credentials. Please check your email and password.');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setErrorMsg('Unable to sign you in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (accEmail: string) => {
    setEmail(accEmail);
    setPassword('AstraSecure2026!');
  };

  return (
    <div className="w-full max-w-md space-y-8 neo-card p-8 border-3 border-black shadow-[8px_8px_0px_0px_#00F0FF] relative bg-[#161622]">
      
      {/* Header Icon */}
      <div className="text-center space-y-3">
        <div className="mx-auto w-14 h-14 bg-neo-cyan border-3 border-black shadow-[3px_3px_0px_0px_#FFE600] flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-black stroke-[2.5]" />
        </div>
        <h1 className="font-pixel text-2xl font-bold text-white">Authentication Portal</h1>
        <p className="text-xs text-neo-yellow font-mono uppercase font-bold">
          ASTRA IETM • Cyber Security Department
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 bg-neo-pink text-white border-2 border-black shadow-[3px_3px_0px_0px_#000] text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 stroke-[2.5]" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Google OAuth Button */}
      <div className="space-y-4">
        <button
          onClick={() => signIn('google', { callbackUrl })}
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white text-black font-pixel font-bold text-xs border-3 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign in with Google Account</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-black" />
        </div>
        <span className="relative px-3 bg-[#161622] text-[11px] font-pixel uppercase tracking-wider text-neo-cyan border border-black">
          Or Development Credentials
        </span>
      </div>

      {/* Local Dev / Credentials Form */}
      <form onSubmit={handleDevLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-mono font-bold text-slate-200 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. admin@astraietm.in"
            required
            className="w-full px-4 py-2.5 bg-[#121218] border-2 border-black text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-neo-cyan focus:shadow-[3px_3px_0px_0px_#00F0FF]"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-slate-200 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-2.5 bg-[#121218] border-2 border-black text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-neo-cyan focus:shadow-[3px_3px_0px_0px_#00F0FF]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-neo-yellow text-black border-3 border-black font-pixel font-bold text-xs shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-3 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Key className="w-4 h-4 text-black stroke-[2.5]" />
              <span>Sign In with Password</span>
            </>
          )}
        </button>
      </form>

      {/* Development Pre-filled Quick Fill Buttons */}
      <div className="pt-2 space-y-2">
        <p className="text-[11px] text-slate-400 font-pixel uppercase text-center">Quick Test Accounts:</p>
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-pixel font-bold">
          <button
            onClick={() => handleQuickFill('admin@astraietm.in')}
            className="px-2.5 py-1 bg-neo-purple text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            Super Admin
          </button>
          <button
            onClick={() => handleQuickFill('reviewer@astraietm.in')}
            className="px-2.5 py-1 bg-neo-cyan text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            Reviewer
          </button>
          <button
            onClick={() => handleQuickFill('student@astraietm.in')}
            className="px-2.5 py-1 bg-neo-green text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            Student User
          </button>
        </div>
      </div>

      {/* Privacy Note Footer */}
      <div className="pt-4 border-t-2 border-black flex items-start gap-2.5 text-xs text-slate-300 font-mono">
        <Lock className="w-4 h-4 text-neo-cyan shrink-0 mt-0.5 stroke-[2.5]" />
        <p className="text-[11px] leading-relaxed">
          Your identity is securely verified through Google but remains confidential from grievance reviewers.
        </p>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="w-8 h-8 border-4 border-neo-cyan border-t-transparent animate-spin" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

