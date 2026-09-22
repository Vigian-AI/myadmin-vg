import React, { useState } from 'react';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { apiClient } from '../api/client';
import { setAuth, isAuthenticated } from '../utils/auth';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated()) {
      throw { redirect: { to: '/' } };
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiClient.post<{
        success: boolean;
        data: { token: string; username: string };
        message: string;
      }>('/auth/login', { username, password });

      if (res.data.success) {
        setAuth(res.data.data.token, res.data.data.username);
        toast.success('Login successful. Welcome back.');
        router.navigate({ to: '/' });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid username or password.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Brand Header */}
      <div className="mb-10 text-center">
        <h1 className="font-serif text-2xl font-normal text-slate-900 tracking-tight">MY ADMIN</h1>
        <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mt-1">
          Website CMS Panel
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm">
        <div className="bg-white border border-slate-200 rounded p-6 shadow-sm">
          <div className="mb-5 border-b border-slate-200 pb-4">
            <h2 className="font-serif text-base font-normal text-slate-900">Sign in to continue</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-1">
              <label className="block text-xs font-mono text-slate-600 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  id="login-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  disabled={isLoading}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-slate-900 text-slate-900 font-sans placeholder-slate-400 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-xs font-mono text-slate-600 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="w-full pl-9 pr-9 py-2 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-slate-900 text-slate-900 font-sans placeholder-slate-400 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-xs text-slate-700 bg-slate-100 border border-slate-300 rounded px-3 py-2 font-sans">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded disabled:opacity-40 transition-colors mt-1 cursor-pointer"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-slate-400 font-mono mt-4">
          MY ADMIN — Personal CMS v1.0
        </p>
      </div>
    </div>
  );
}
