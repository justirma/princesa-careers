export type ApplicationStatus = 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected';

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  skills: string[];
  experience_summary: string;
  desired_titles: string[];
  location: string;
  remote_only: boolean;
  salary_range_min?: number;
  salary_range_max?: number;
  embedding?: number[];
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  source_id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements?: string;
  apply_url: string;
  source: string;
  job_embedding?: number[];
  scraped_at: string;
  created_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  status: ApplicationStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      user_profile: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>;
      };
      jobs: {
        Row: Job;
        Insert: Omit<Job, 'id' | 'created_at'>;
        Update: Partial<Omit<Job, 'id' | 'created_at'>>;
      };
      applications: {
        Row: Application;
        Insert: Omit<Application, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Application, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
