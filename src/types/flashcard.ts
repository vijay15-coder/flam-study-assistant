
export interface FlashcardItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  tags?: string[];
  explanation?: string;
}

export interface QuizOption {
  id: string;
  label: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  subtitle?: string;
  options: QuizOption[];
  correctOptionId: string;
  userSelectedOptionId?: string;
  aiAnalysis?: string;
  points?: number;
  reviewedAnswer?: string;
  isCorrect?: boolean;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  icon?: string;
  code?: string;
  cards: FlashcardItem[];
  quizzes?: QuizQuestion[];
  bookmarked?: boolean;
  cardsDue?: number;
  progress?: number;
}

export interface FlashcardResponseData {
  cards: Array<{
    question: string;
    answer: string;
  }>;
}

export type CardStudyStatus = 'unanswered' | 'known' | 'wrong';

export interface CardStateRecord {
  [cardId: string]: CardStudyStatus;
}

export interface ValidationSuccess {
  isValid: true;
  cards: FlashcardItem[];
  error: null;
}

export interface ValidationFailure {
  isValid: false;
  cards: null;
  error: string;
}

export type ValidationResult = ValidationSuccess | ValidationFailure;

export type ActiveStudyMode = 'overview' | 'smart_study' | 'practice' | 'quiz' | 'interview' | 'exam';
