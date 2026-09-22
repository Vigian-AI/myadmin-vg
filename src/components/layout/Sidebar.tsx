import React, { useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Globe,
  FileText,
  FolderGit2,
  BookOpen,
  Clock,
  FileStack,
  Download,
  Share2,
  Video,
  User,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SidebarItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  children?: { title: string; href: string; icon?: React.ElementType }[];
}

export const Sidebar: React.FC = () => {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    websiteData: true,
    downloader: true,
  });

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navItems: SidebarItem[] = [
    {
      title: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      title: 'My Website Data',
      icon: Globe,
      children: [
        { title: 'Hero', href: '/data/hero', icon: Sparkles },
        { title: 'projects', href: '/data/projects', icon: FolderGit2 },
        { title: 'Blog', href: '/data/blog', icon: BookOpen },
        { title: 'now', href: '/data/now', icon: Clock },
      ],
    },
    {
      title: 'Merge PDF',
      href: '/pdf-merge',
      icon: FileStack,
    },
    {
      title: 'Downloader',
      icon: Download,
      children: [
        { title: 'Facebook Video', href: '/downloader/facebook', icon: Share2 },
        { title: 'YouTube Video', href: '/downloader/youtube', icon: Video },
      ],
    },
    {
      title: 'Profile',
      href: '/profile',
      icon: User,
    },
  ];

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0 h-screen sticky top-0 z-30 font-sans select-none">
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-200">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-7 h-7 bg-slate-900 text-white font-serif flex items-center justify-center font-bold text-xs border border-slate-900">
            VG
          </div>
          <div>
            <h1 className="font-serif text-sm font-normal text-slate-900 tracking-tight">MY ADMIN</h1>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">CMS Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isParentActive = item.children?.some((c) => currentPath.startsWith(c.href));
          const isActive = item.href ? currentPath === item.href : isParentActive;

          if (item.children) {
            const key = idx === 1 ? 'websiteData' : 'downloader';
            const isOpen = !!openSubmenus[key];

            return (
              <div key={item.title} className="space-y-0.5">
                <button
                  onClick={() => toggleSubmenu(key)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors ${
                    isParentActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.title}</span>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  )}
                </button>

                {isOpen && (
                  <div className="pl-4 space-y-0.5 border-l border-slate-200 ml-3.5 py-1">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon || FileText;
                      const isChildActive = currentPath === child.href;

                      return (
                        <Link
                          key={child.href}
                          to={child.href}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${
                            isChildActive
                              ? 'bg-slate-900 text-white font-medium'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <ChildIcon className={`w-3.5 h-3.5 ${isChildActive ? 'text-white' : 'text-slate-400'}`} />
                          <span>{child.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.title}
              to={item.href!}
              className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between font-mono">
        <span>PostgreSQL</span>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
      </div>
    </aside>
  );
};
