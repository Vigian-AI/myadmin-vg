import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchResourceList, createResourceItem, updateResourceItem, deleteResourceItem } from '../../services/apiService';
import { DataTable, type Column } from '../ui/DataTable';
import { Modal } from '../ui/Modal';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { ImageUploader } from '../ui/ImageUploader';

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'image';
  required?: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
}

interface GenericCrudPageProps<T> {
  title: string;
  description?: string;
  resourceKey: string;
  columns: Column<T>[];
  fields: FieldConfig[];
}

export function GenericCrudPage<T extends { id: string; status?: any }>({
  title,
  description,
  resourceKey,
  columns,
  fields,
}: GenericCrudPageProps<T>) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [deletingItem, setDeletingItem] = useState<T | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: [resourceKey, page, search],
    queryFn: () => fetchResourceList<T>(resourceKey, page, 10, search),
  });

  const createMutation = useMutation({
    mutationFn: (payload: FormData | Record<string, any>) => createResourceItem<T>(resourceKey, payload),
    onSuccess: () => {
      toast.success(`${title} record created.`);
      queryClient.invalidateQueries({ queryKey: [resourceKey] });
      closeModal();
    },
    onError: (err: any) => {
      const data = err.response?.data;
      if (data && data.data && Array.isArray(data.data)) {
        const details = data.data.map((d: any) => d.message).join(', ');
        toast.error(`${data.message}: ${details}`);
      } else {
        toast.error(err.response?.data?.message || 'Failed to create record.');
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData | Record<string, any> }) =>
      updateResourceItem<T>(resourceKey, id, payload),
    onSuccess: () => {
      toast.success(`${title} record updated.`);
      queryClient.invalidateQueries({ queryKey: [resourceKey] });
      closeModal();
    },
    onError: (err: any) => {
      const data = err.response?.data;
      if (data && data.data && Array.isArray(data.data)) {
        const details = data.data.map((d: any) => d.message).join(', ');
        toast.error(`${data.message}: ${details}`);
      } else {
        toast.error(err.response?.data?.message || 'Failed to update record.');
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteResourceItem<T>(resourceKey, id),
    onSuccess: () => {
      toast.success(`${title} record deleted.`);
      queryClient.invalidateQueries({ queryKey: [resourceKey] });
      setDeletingItem(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete record.');
    },
  });

  const openCreateModal = () => {
    setEditingItem(null);
    const initial: Record<string, any> = { status: 'published' };
    fields.forEach((f) => {
      if (f.type !== 'image') initial[f.name] = '';
    });
    setFormData(initial);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: T) => {
    setEditingItem(item);
    const initial: Record<string, any> = { ...item };
    setFormData(initial);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
    setSelectedFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hasImageField = fields.some((f) => f.type === 'image');

    if (hasImageField && selectedFile) {
      const fd = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== undefined && formData[key] !== null) {
          fd.append(key, formData[key]);
        }
      });
      fd.append('image', selectedFile);

      if (editingItem) {
        updateMutation.mutate({ id: editingItem.id, payload: fd });
      } else {
        createMutation.mutate(fd);
      }
    } else {
      if (editingItem) {
        updateMutation.mutate({ id: editingItem.id, payload: formData });
      } else {
        createMutation.mutate(formData);
      }
    }
  };

  return (
    <div>
      <DataTable
        title={title}
        description={description}
        data={data?.data || []}
        columns={columns}
        totalItems={data?.pagination?.total || 0}
        currentPage={page}
        totalPages={data?.pagination?.totalPages || 1}
        onPageChange={setPage}
        searchTerm={search}
        onSearchChange={setSearch}
        onAdd={openCreateModal}
        onEdit={openEditModal}
        onDelete={(item) => setDeletingItem(item)}
        isLoading={isLoading}
        onPreviewImage={(url) => setPreviewImageUrl(url)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={`${editingItem ? 'Edit' : 'Add'} ${title}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => {
            if (field.type === 'image') {
              return (
                <ImageUploader
                  key={field.name}
                  label={field.label}
                  initialImage={editingItem ? (editingItem as any)[field.name] : null}
                  onFileSelect={(file) => setSelectedFile(file)}
                />
              );
            }

            if (field.type === 'textarea') {
              return (
                <div key={field.name} className="space-y-1">
                  <label className="block text-xs font-mono text-slate-600 uppercase tracking-wider">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    rows={4}
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-slate-900 text-slate-900 font-sans"
                  />
                </div>
              );
            }

            if (field.type === 'select') {
              return (
                <div key={field.name} className="space-y-1">
                  <label className="block text-xs font-mono text-slate-600 uppercase tracking-wider">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    required={field.required}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-slate-900 text-slate-900 font-sans"
                  >
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            return (
              <div key={field.name} className="space-y-1">
                <label className="block text-xs font-mono text-slate-600 uppercase tracking-wider">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-slate-900 text-slate-900 font-sans"
                />
              </div>
            );
          })}

          <div className="space-y-1">
            <label className="block text-xs font-mono text-slate-600 uppercase tracking-wider">
              Status
            </label>
            <select
              value={formData.status || 'published'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-slate-900 text-slate-900 font-sans"
            >
              <option value="published">published</option>
              <option value="draft">draft</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={closeModal}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 border border-slate-900 rounded hover:bg-slate-800 disabled:opacity-40"
            >
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={() => deletingItem && deleteMutation.mutate(deletingItem.id)}
        isLoading={deleteMutation.isPending}
      />

      <Modal
        isOpen={!!previewImageUrl}
        onClose={() => setPreviewImageUrl(null)}
        title="Image Preview"
      >
        <div className="flex justify-center p-4 bg-slate-900 rounded">
          <img
            src={previewImageUrl || ''}
            alt="Full Preview"
            className="max-h-[60vh] object-contain rounded border border-slate-700"
          />
        </div>
      </Modal>
    </div>
  );
}
