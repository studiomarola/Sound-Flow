export interface Song {
  id: number;
  title: string;
  genre: string;
  status: SongStatus;
  release_date: string;
  artists: string;
  cover_url: string;
  audio_url: string;
  lyrics: string;
  spotify_link: string;
  youtube_link: string;
  apple_link: string;
  created_at: string;
}

export type SongStatus = 
  | 'Draft' 
  | 'Production' 
  | 'Mixing' 
  | 'Mastering' 
  | 'Distribution' 
  | 'Released' 
  | 'Promotion';

export interface Task {
  id: number;
  song_id: number;
  title: string;
  deadline: string;
  assignee: string;
  status: 'pending' | 'completed';
}

export interface MarketingAction {
  id: number;
  song_id: number;
  title: string;
  status: 'pending' | 'completed';
  type: 'pre' | 'post';
}
