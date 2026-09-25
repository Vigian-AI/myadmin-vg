import React from 'react';
import type { StatusType } from '../../types';

interface StatusBadgeProps {
  status: StatusType | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isPublished = status === 'published';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[17px] font-mono border rounded-xs ${
        isPublished
          ? 'bg-slate-100 text-slate-800 border-slate-300'
          : 'bg-slate-50 text-slate-500 border-slate-200'
      }`}
    >
      {isPublished ? 'published' : 'draft'}
    </span>
  );
};
