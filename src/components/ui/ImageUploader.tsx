import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { getImageUrl } from '../../api/client';

interface ImageUploaderProps {
  initialImage?: string | null;
  onFileSelect: (file: File | null) => void;
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  initialImage,
  onFileSelect,
  label = 'Upload Image',
}) => {
  const [preview, setPreview] = useState<string | null>(
    initialImage ? getImageUrl(initialImage) : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onFileSelect(file);
    }
  };

  const handleClear = () => {
    setPreview(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-mono text-slate-600 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative w-20 h-20 rounded border border-slate-200 bg-slate-50 shrink-0 overflow-hidden">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-1 right-1 bg-slate-900 text-white p-0.5 rounded-xs opacity-90 hover:opacity-100"
              title="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 rounded border border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-slate-600 transition-colors shrink-0"
          >
            <ImageIcon className="w-5 h-5 mb-1 text-slate-400" />
            <span className="text-[14px] font-mono uppercase">Select</span>
          </div>
        )}

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
          >
            <Upload className="w-3 h-3 text-slate-500" />
            {preview ? 'Change Image' : 'Choose File'}
          </button>
          <p className="mt-1 text-[17px] text-slate-400 font-sans">JPG, PNG, WEBP up to 20MB</p>
        </div>
      </div>
    </div>
  );
};
