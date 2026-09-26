import React from 'react';
import { useRouterState, useRouter } from '@tanstack/react-router';
import { ExternalLink, LogOut } from 'lucide-react';
import { clearAuth, getUsername } from '../../utils/auth';
import { toast } from 'sonner';

export const Header: React.FC = () => {
  const routerState = useRouterState();
  const router = useRouter();
  const pathname = routerState.location.pathname;
  const username = getUsername();

  const getPageTitle = (path: string) => {
    if (path === '/') return 'Dashboard Overview';
    if (path.startsWith('/data/home')) return 'Home Section';
    if (path.startsWith('/data/contact')) return 'Contact Links';
    if (path.startsWith('/data/projects')) return 'Projects';
    if (path.startsWith('/data/blog')) return 'Blog Posts';
    if (path.startsWith('/data/now')) return 'Now Section';
    if (path.startsWith('/pdf-merge')) return 'Merge PDF';
    if (path.startsWith('/settings')) return 'Settings';
    if (path.startsWith('/downloader/facebook')) return 'Facebook Video Downloader';
    if (path.startsWith('/downloader/youtube')) return 'YouTube Video Downloader';
    return 'CMS Admin';
  };

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out successfully.');
    router.navigate({ to: '/login' });
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Page Title */}
      <div>
        <h2 className="font-serif text-lg font-normal text-slate-900 tracking-tight">
          {getPageTitle(pathname)}
        </h2>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">

        {/* View Website */}
        <a
          href="https://vigian-ai.my.id"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
        >
          <span>View Site</span>
          <ExternalLink className="w-3 h-3 text-slate-500" />
        </a>

        {/* User + Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-xs font-mono text-slate-700">{username}</span>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
