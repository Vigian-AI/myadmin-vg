import React from 'react';
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { getImageUrl } from '../../api/client';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  title: string;
  description?: string;
  data: T[];
  columns: Column<T>[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchTerm: string;
  onSearchChange: (search: string) => void;
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  isLoading?: boolean;
  onPreviewImage?: (url: string) => void;
}

export function DataTable<T extends { id: string; status?: any; createdAt?: any; updatedAt?: any }>({
  title,
  description,
  data,
  columns,
  totalItems,
  currentPage,
  totalPages,
  onPageChange,
  searchTerm,
  onSearchChange,
  onAdd,
  onEdit,
  onDelete,
  isLoading = false,
  onPreviewImage,
}: DataTableProps<T>) {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-serif text-xl font-normal text-slate-900 tracking-tight">{title}</h1>
          {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Record</span>
        </button>
      </div>

      {/* Table Container Card */}
      <div className="bg-white border border-slate-200 rounded overflow-hidden">
        {/* Filter / Search Bar */}
        <div className="p-3 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search records..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-slate-800 text-slate-900 placeholder-slate-400 font-sans"
            />
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Count: <span className="font-semibold text-slate-900">{totalItems}</span>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-4 w-10">#</th>
                {columns.map((col, idx) => (
                  <th key={idx} className="py-2.5 px-4">
                    {col.header}
                  </th>
                ))}
                {data.some((d) => 'status' in d) && <th className="py-2.5 px-4">Status</th>}
                <th className="py-2.5 px-4">Created At</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + 4} className="py-8 text-center text-slate-500">
                    Loading records...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 4} className="py-8 text-center text-slate-500">
                    No records found.
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => {
                  const imageSrc = (item as any).image || (item as any).coverImage || (item as any).avatar;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-slate-400 font-mono">
                        {(currentPage - 1) * 10 + idx + 1}
                      </td>
                      {columns.map((col, cIdx) => (
                        <td key={cIdx} className="py-3 px-4">
                          {col.cell
                            ? col.cell(item)
                            : col.accessorKey
                            ? String(item[col.accessorKey] ?? '-')
                            : '-'}
                        </td>
                      ))}
                      {'status' in item && (
                        <td className="py-3 px-4">
                          <StatusBadge status={item.status} />
                        </td>
                      )}
                      <td className="py-3 px-4 text-slate-500 font-mono">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {imageSrc && onPreviewImage && (
                            <button
                              onClick={() => onPreviewImage(getImageUrl(imageSrc))}
                              className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                              title="Preview Image"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => onEdit(item)}
                            className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(item)}
                            className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600 font-mono">
          <span>
            Page {currentPage} of {totalPages || 1}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isLoading}
              className="p-1 border border-slate-300 rounded hover:bg-white disabled:opacity-30"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isLoading}
              className="p-1 border border-slate-300 rounded hover:bg-white disabled:opacity-30"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
