
export type TimerMode = 'work' | 'shortBreak' | 'longBreak';
export type SubscriptionTier = 'free' | 'premium';
export type AppTheme = 'classic' | 'dark' | 'nature' | 'sunset' | 'minimal';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  subtasks: string[];
  isBreakingDown?: boolean;
}

export interface Settings {
  workTime: number;
  shortBreak: number;
  longBreak: number;
  isADHDMode: boolean;
  theme: AppTheme;
}

export interface SoundEffect {
  id: string;
  name: string;
  emoji: string;
  url: string;
  isPremium: boolean;
}
