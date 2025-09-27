
export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType; 
  imageId: string;
  iconName?: string;
}

export interface Lesson {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  content: string;
}

export interface QuizQuestion {
  id:string;
  question: string;
  options: string[];
  correctAnswer: string;
  hint?: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  questions: QuizQuestion[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatarUrl: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  badgeIds: string[];
  completedLessons: string[];
  completedTournaments?: string[];
}

export interface Badge {
  id: string;
  name: string;
  icon: React.ElementType | string;
  color: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  xp: number;
}
