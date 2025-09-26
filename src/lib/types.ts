
export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  imageId: string;
}

export interface Lesson {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  content: string;
}

export interface QuizQuestion {
  id: string;
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
  avatarUrl: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  score: number;
}
