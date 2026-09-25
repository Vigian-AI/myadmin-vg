import { useState } from 'react';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { KeyRound, Save, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '../../api/client';
import { getUsername, setAuth } from '../../utils/auth';

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  const router = useRouter();
  const [username, setUsername] = useState(getUsername() || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const response = await apiClient.put<{
        success: boolean;
        message: string;
        data: { token: string; username: string };
      }>('/auth/credentials', { username, currentPassword, newPassword });
      setAuth(response.data.data.token, response.data.data.username);
      setCurrentPassword('');
      setNewPassword('');
      toast.success(response.data.message);
      router.invalidate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Could not update credentials.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="max-w-xl space-y-6">
      <div>
        <p className="text-xs font-mono uppercase tracking-wider text-slate-500">Account</p>
        <h1 className="mt-1 font-serif text-2xl text-slate-900">Settings</h1>
        <p className="mt-2 text-sm text-slate-500">Update the credentials used to access this admin panel.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 border border-slate-200 rounded p-6">
        <label className="block space-y-2">
          <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-600">
            <UserRound className="h-3.5 w-3.5" /> Username
          </span>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            minLength={3}
            required
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900"
          />
        </label>
        <label className="block space-y-2">
          <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-600">
            <KeyRound className="h-3.5 w-3.5" /> Current password
          </span>
          <input
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            autoComplete="current-password"
            required
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-600">New password</span>
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            minLength={8}
            autoComplete="new-password"
            required
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900"
          />
          <span className="block text-xs text-slate-500">At least 8 characters.</span>
        </label>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded bg-slate-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" />
          {isSaving ? 'Saving...' : 'Save credentials'}
        </button>
      </form>
    </section>
  );
}
