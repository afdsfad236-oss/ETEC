import React from 'react';

export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  subject: string;
  explanation?: string;
  hint?: string;
  explanationImageUrl?: string;
}

export interface Answer {
  questionId: number;
  selectedOption: string;
  isCorrect: boolean;
}

export interface FocusTopic {
  subject:string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  topics: string[];
}

export interface StudyDay {
  id: number;
  week: number;
  day: number;
  subject: string;
  topic: string;
  content: string;
  isRestDay: boolean;
}

export interface Quiz {
    id: number;
    title: string;
    questions: Question[];
}

export type Difficulty = 'Fácil' | 'Médio' | 'Difícil';

export interface PerformanceRecord {
  id: string;
  type: 'Simulado Completo' | 'Quiz Diário' | 'Estudo Rápido';
  date: string;
  score: number;
  total: number;
  subject?: string;
  difficulty?: Difficulty;
  answers: Answer[];
  questions: Question[];
}

export type Screen = 
  | 'welcome' 
  | 'home' 
  | 'exam' 
  | 'results' 
  | 'dailyQuiz' 
  | 'studyPlan' 
  | 'focusSubjects' 
  | 'tips' 
  | 'anxiety'
  | 'focusQuiz'
  | 'difficultySelection'
  | 'writingLab'
  | 'performanceHistory'
  | 'quizReview';