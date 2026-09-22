import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats } from '../../services/apiService';
import {
  Server,
  Database,
  Activity,
  FolderGit2,
  BookOpen,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  Cpu,
  HardDrive,
  RefreshCw,
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-slate-400 font-mono text-xs">
        Loading dashboard metrics...
      </div>
    );
  }

  const counts = stats?.counts;

  const statCards = [
    { label: 'Total Records', value: counts?.totalItems || 0, icon: Sparkles },
    { label: 'Hero Section', value: counts?.hero || 0, icon: Sparkles },
    { label: 'Projects', value: counts?.projects || 0, icon: FolderGit2 },
    { label: 'Blog Posts', value: counts?.blog || 0, icon: BookOpen },
    { label: 'Now Focus', value: counts?.now || 0, icon: Clock },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-serif text-xl font-normal text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            PostgreSQL database metrics, server status, and activity feed.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white p-4 rounded border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{card.label}</span>
                <Icon className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="font-serif text-2xl font-normal text-slate-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Server & Database Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Server Status */}
        <div className="bg-white rounded border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2.5">
              <Server className="w-4 h-4 text-slate-700" />
              <div>
                <h3 className="font-serif text-sm font-normal text-slate-900">Express REST API</h3>
                <p className="text-[11px] text-slate-500 font-mono">Node.js Environment</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono border border-slate-300 bg-slate-50 text-slate-800 rounded">
              <CheckCircle2 className="w-3 h-3 text-slate-700" />
              Online
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-mono">
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase">
                <Cpu className="w-3 h-3" />
                <span>Node Version</span>
              </div>
              <p className="text-slate-900 font-medium mt-1">{stats?.serverStatus.nodeVersion}</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded font-mono">
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase">
                <HardDrive className="w-3 h-3" />
                <span>Memory RSS</span>
              </div>
              <p className="text-slate-900 font-medium mt-1">{stats?.serverStatus.memoryUsage.rssMb} MB</p>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-mono">
              <span className="text-slate-500 text-[10px] uppercase">Uptime</span>
              <p className="text-slate-900 font-medium mt-1">{stats?.serverStatus.uptimeSeconds}s</p>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-mono">
              <span className="text-slate-500 text-[10px] uppercase">Platform</span>
              <p className="text-slate-900 font-medium mt-1 truncate">{stats?.serverStatus.platform}</p>
            </div>
          </div>
        </div>

        {/* Database Status */}
        <div className="bg-white rounded border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-slate-700" />
              <div>
                <h3 className="font-serif text-sm font-normal text-slate-900">PostgreSQL Database</h3>
                <p className="text-[11px] text-slate-500 font-mono">Prisma Client ORM</p>
              </div>
            </div>
            {stats?.databaseStatus.connected ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono border border-slate-300 bg-slate-50 text-slate-800 rounded">
                <CheckCircle2 className="w-3 h-3 text-slate-700" />
                Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono border border-slate-300 bg-slate-50 text-slate-500 rounded">
                <XCircle className="w-3 h-3 text-slate-400" />
                Disconnected
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-mono">
              <span className="text-slate-500 text-[10px] uppercase">Provider</span>
              <p className="text-slate-900 font-medium mt-1">{stats?.databaseStatus.provider}</p>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-mono">
              <span className="text-slate-500 text-[10px] uppercase">Database</span>
              <p className="text-slate-900 font-medium mt-1">{stats?.databaseStatus.databaseName}</p>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-mono">
              <span className="text-slate-500 text-[10px] uppercase">Latency</span>
              <p className="text-slate-900 font-medium mt-1">{stats?.databaseStatus.latencyMs} ms</p>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-mono">
              <span className="text-slate-500 text-[10px] uppercase">Schema</span>
              <p className="text-slate-900 font-medium mt-1">public</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white rounded border border-slate-200 p-5 space-y-3">
        <h3 className="font-serif text-sm font-normal text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-slate-600" />
          <span>Recent Activity Log</span>
        </h3>

        {stats?.recentActivities && stats.recentActivities.length > 0 ? (
          <div className="space-y-2">
            {stats.recentActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="px-1.5 py-0.5 font-mono text-[10px] border border-slate-300 bg-white text-slate-800">
                    {act.action}
                  </span>
                  <span className="text-slate-700">{act.details}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono shrink-0">
                  {new Date(act.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-3 text-center font-mono">No activity logged.</p>
        )}
      </div>
    </div>
  );
};
