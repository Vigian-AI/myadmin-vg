import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { downloadYoutubeVideo } from '../../services/apiService';
import { Download, Video, Music, Image as ImageIcon } from 'lucide-react';

const YoutubeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const YoutubeDownloader: React.FC = () => {
  const [url, setUrl] = useState('');

  const mutation = useMutation({
    mutationFn: (videoUrl: string) => downloadYoutubeVideo(videoUrl),
    onSuccess: () => {
      toast.success('YouTube video processed.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to extract YouTube video link.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error('Please enter a valid YouTube URL.');
      return;
    }
    mutation.mutate(url);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="font-serif text-xl font-normal text-slate-900 tracking-tight flex items-center gap-2">
          <YoutubeIcon className="w-5 h-5 text-slate-700" />
          <span>YouTube Video & Audio Downloader</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-sans">
          Enter a YouTube URL to extract MP4 Video or MP3 Audio download links.
        </p>
      </div>

      <div className="bg-white rounded border border-slate-200 p-5">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-xs font-mono text-slate-600 uppercase tracking-wider">
            YouTube Video URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              required
              className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-slate-900 text-slate-900 font-sans"
            />
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded disabled:opacity-40 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{mutation.isPending ? 'Processing...' : 'Fetch Media'}</span>
            </button>
          </div>
        </form>
      </div>

      {mutation.data && (
        <div className="bg-white rounded border border-slate-200 p-5 space-y-4">
          <h3 className="font-serif text-sm font-normal text-slate-900 border-b border-slate-200 pb-2">
            Extracted YouTube Media
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
                  YouTube Media
                </span>
                <h4 className="font-serif text-sm font-normal text-slate-900 mt-1">{mutation.data.title}</h4>
              </div>

              <div className="pt-1 flex flex-wrap gap-2">
                <a
                  href={mutation.data.downloadVideo}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded transition-colors"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Download Video (MP4)</span>
                </a>
                <a
                  href={mutation.data.downloadAudio}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-medium rounded transition-colors"
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Download Audio (MP3)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
