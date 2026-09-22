export type StatusType = 'published' | 'draft';

export interface BaseEntity {
  id: string;
  status: StatusType;
  createdAt: string;
  updatedAt: string;
}

export interface HeroEntity extends BaseEntity {
  title: string;
  subtitle?: string | null;
  description?: string | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  image?: string | null;
}

export interface ProjectEntity extends BaseEntity {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string;
  github: string;
  image: string;
}

export interface BlogPostEntity extends BaseEntity {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
}

export interface NowEntity extends BaseEntity {
  title: string;
  date: string;
  content: string;
}

export interface AdminProfileEntity {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLogItem {
  id: string;
  action: string;
  details: string;
  createdAt: string;
}

export interface DashboardStatsData {
  counts: {
    totalItems: number;
    hero: number;
    projects: number;
    blog: number;
    now: number;
  };
  serverStatus: {
    status: string;
    uptimeSeconds: number;
    nodeVersion: string;
    platform: string;
    memoryUsage: {
      rssMb: number;
      heapUsedMb: number;
      heapTotalMb: number;
    };
  };
  databaseStatus: {
    provider: string;
    databaseName: string;
    connected: boolean;
    latencyMs: number;
  };
  recentActivities: ActivityLogItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
