import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { downloadFacebookVideo } from '../../services/apiService';
import { Download, Video, Image as ImageIcon } from 'lucide-react';

const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const FacebookDownloader: React.FC = () => {
  const [url, setUrl] = useState('');

  const mutation = useMutation({
    mutationFn: (videoUrl: string) => downloadFacebookVideo(videoUrl),
    onSuccess: () => {
      toast.success('Facebook video processed.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to extract Facebook video link.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error('Please enter a valid Facebook URL.');
      return;
    }
    mutation.mutate(url);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="font-serif text-xl font-normal text-slate-900 tracking-tight flex items-center gap-2">
          <FacebookIcon className="w-5 h-5 text-slate-700" />
          <span>Facebook Video Downloader</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-sans">
          Enter a public Facebook video URL to extract HD and SD download links.
        </p>
      </div>

      <div className="bg-white rounded border border-slate-200 p-5">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-xs font-mono text-slate-600 uppercase tracking-wider">
            Facebook Video URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.facebook.com/watch/?v=123456789"
              required
              className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-slate-900 text-slate-900 font-sans"
            />
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded disabled:opacity-40 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{mutation.isPending ? 'Processing...' : 'Process'}</span>
            </button>
          </div>
        </form>
      </div>

      {mutation.data && (
        <div className="bg-white rounded border border-slate-200 p-5 space-y-4">
          <h3 className="font-serif text-sm font-normal text-slate-900 border-b border-slate-200 pb-2">
            Extracted Video Information
          </h3>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-full sm:w-56 h-36 bg-slate-100 rounded border border-slate-200 overflow-hidden shrink-0">
              {mutation.data.thumbnail ? (
                <img
                  src={mutation.data.thumbnail}
                  alt={mutation.data.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <span className="text-[15px] font-mono text-slate-500 uppercase border border-slate-200 px-1.5 py-0.5 bg-slate-50">
                  Facebook Video
                </span>
                <h4 className="font-serif text-sm font-normal text-slate-900 mt-1">{mutation.data.title}</h4>
              </div>

              <div className="pt-1 flex flex-wrap gap-2">
                <a
                  href={mutation.data.downloadHd}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded transition-colors"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Download HD</span>
                </a>
                <a
                  href={mutation.data.downloadSd}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-medium rounded transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SD</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
