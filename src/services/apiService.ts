import { apiClient } from '../api/client';
import type { ApiResponse, DashboardStatsData, AdminProfileEntity } from '../types';

export async function fetchResourceList<T>(
  resource: string,
  page = 1,
  limit = 10,
  search = '',
  status = ''
): Promise<ApiResponse<T[]>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) params.append('search', search);
  if (status) params.append('status', status);

  const res = await apiClient.get<ApiResponse<T[]>>(`/${resource}?${params.toString()}`);
  return res.data;
}

export async function fetchResourceItem<T>(resource: string, id: string): Promise<ApiResponse<T>> {
  const res = await apiClient.get<ApiResponse<T>>(`/${resource}/${id}`);
  return res.data;
}

export async function createResourceItem<T>(resource: string, data: FormData | Record<string, unknown>): Promise<ApiResponse<T>> {
  const isFormData = data instanceof FormData;
  const res = await apiClient.post<ApiResponse<T>>(`/${resource}`, data, {
    headers: {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    },
  });
  return res.data;
}

export async function updateResourceItem<T>(resource: string, id: string, data: FormData | Record<string, unknown>): Promise<ApiResponse<T>> {
  const isFormData = data instanceof FormData;
  const res = await apiClient.put<ApiResponse<T>>(`/${resource}/${id}`, data, {
    headers: {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    },
  });
  return res.data;
}

export async function deleteResourceItem<T>(resource: string, id: string): Promise<ApiResponse<T>> {
  const res = await apiClient.delete<ApiResponse<T>>(`/${resource}/${id}`);
  return res.data;
}

export async function fetchDashboardStats(): Promise<DashboardStatsData> {
  const res = await apiClient.get<ApiResponse<DashboardStatsData>>('/dashboard/stats');
  return res.data.data;
}

export async function fetchProfile(): Promise<AdminProfileEntity> {
  const res = await apiClient.get<ApiResponse<AdminProfileEntity>>('/profile');
  return res.data.data;
}

export async function updateProfile(data: FormData): Promise<AdminProfileEntity> {
  const res = await apiClient.put<ApiResponse<AdminProfileEntity>>('/profile', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
}

export async function mergePdfFiles(formData: FormData): Promise<Blob> {
  const res = await apiClient.post('/pdf/merge', formData, {
    responseType: 'blob',
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function downloadFacebookVideo(url: string) {
  const res = await apiClient.post<ApiResponse<{ title: string; thumbnail: string; downloadHd: string; downloadSd: string }>>(
    '/downloader/facebook',
    { url }
  );
  return res.data.data;
}

export async function downloadYoutubeVideo(url: string) {
  const res = await apiClient.post<ApiResponse<{ title: string; thumbnail: string; downloadVideo: string; downloadAudio: string }>>(
    '/downloader/youtube',
    { url }
  );
  return res.data.data;
}
