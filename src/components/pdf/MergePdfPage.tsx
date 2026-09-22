import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { mergePdfFiles } from '../../services/apiService';
import { FileText, ArrowUp, ArrowDown, Trash2, Upload, Download } from 'lucide-react';

interface PdfFileItem {
  id: string;
  file: File;
}

export const MergePdfPage: React.FC = () => {
  const [files, setFiles] = useState<PdfFileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const mergeMutation = useMutation({
    mutationFn: async (items: PdfFileItem[]) => {
      const formData = new FormData();
      items.forEach((item) => formData.append('files', item.file));
      return await mergePdfFiles(formData);
    },
    onSuccess: (blob) => {
      toast.success('PDFs merged successfully.');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `merged_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to merge PDF files.');
    },
  });

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const newItems: PdfFileItem[] = Array.from(selectedFiles)
      .filter((f) => f.type === 'application/pdf' || f.name.endsWith('.pdf'))
      .map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
      }));

    if (newItems.length === 0) {
      toast.error('Please select valid PDF files.');
      return;
    }

    setFiles((prev) => [...prev, ...newItems]);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...files];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setFiles(updated);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    const updated = [...files];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setFiles(updated);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="font-serif text-xl font-normal text-slate-900 tracking-tight">Merge PDF Documents</h1>
        <p className="text-xs text-slate-500 mt-1 font-sans">
          Upload and combine multiple PDF files into a single merged document.
        </p>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileSelect(e.dataTransfer.files);
        }}
        className={`border border-dashed rounded p-8 text-center transition-all ${
          isDragging
            ? 'border-slate-800 bg-slate-100'
            : 'border-slate-300 bg-slate-50 hover:border-slate-400'
        }`}
      >
        <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
        <h3 className="text-xs font-semibold text-slate-800 font-mono">Drag and drop PDF files</h3>
        <p className="text-[11px] text-slate-500 mt-1">or click to select files from disk</p>
        <label className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded cursor-pointer hover:bg-slate-800 transition-colors">
          <Upload className="w-3.5 h-3.5" />
          <span>Browse PDF Files</span>
          <input
            type="file"
            multiple
            accept="application/pdf"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </label>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-white rounded border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-mono text-slate-700">
              Selected Files ({files.length})
            </span>
            <button
              onClick={() => setFiles([])}
              className="text-xs text-slate-500 hover:text-slate-900 font-mono"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-1.5">
            {files.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-4 h-4 text-slate-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 truncate">{item.file.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {(item.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1 rounded text-slate-500 hover:text-slate-900 disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === files.length - 1}
                    className="p-1 rounded text-slate-500 hover:text-slate-900 disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeFile(item.id)}
                    className="p-1 rounded text-slate-400 hover:text-slate-900"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              onClick={() => mergeMutation.mutate(files)}
              disabled={files.length < 2 || mergeMutation.isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded disabled:opacity-40 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{mergeMutation.isPending ? 'Merging...' : 'Merge and Download'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
