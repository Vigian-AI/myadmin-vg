import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchProfile, updateProfile } from '../../services/apiService';
import { ImageUploader } from '../ui/ImageUploader';
import { User, Mail, FileText, Save } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: fetchProfile,
  });

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: (formData: FormData) => updateProfile(formData),
    onSuccess: () => {
      toast.success('Profile updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['adminProfile'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('bio', bio);
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }
    mutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-slate-400 font-mono text-xs">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="font-serif text-xl font-normal text-slate-900 tracking-tight">Admin Profile</h1>
        <p className="text-xs text-slate-500 mt-1 font-sans">
          Manage administrator name, email, avatar, and bio details.
        </p>
      </div>

      <div className="bg-white rounded border border-slate-200 p-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <ImageUploader
            label="Profile Avatar"
            initialImage={profile?.avatar}
            onFileSelect={(file) => setAvatarFile(file)}
          />

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="block text-xs font-mono text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-slate-900 text-slate-900 font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-slate-900 text-slate-900 font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Bio / Headline</span>
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-slate-900 text-slate-900 font-sans"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded disabled:opacity-40 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{mutation.isPending ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
