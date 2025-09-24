import React, { useMemo } from 'react';
import { examData } from '../services/examData.ts';
import { shuffleArray } from '../utils.ts';
import QuizScreen from './QuizScreen.tsx';
import { Answer, Question, PerformanceRecord } from '../types.ts';


interface DailyQuizScreenProps {
  onGoHome: () => void;
  onFinish: (
    answers: Answer[], 
    questions: Question[], 
    type: PerformanceRecord['type'], 
    metadata: { title: string }
  ) => void;
}

const DailyQuizScreen: React.FC<DailyQuizScreenProps> = ({ onGoHome, onFinish }) => {
  const dailyQuestions = useMemo(() => {
    const shuffled = shuffleArray(examData);
    // A "daily" quiz with 3 questions
    return shuffled.slice(0, 3);
  }, []);

  return (
    <QuizScreen
      questions={dailyQuestions}
      onGoHome={onGoHome}
      onFinish={onFinish}
      quizType="Quiz Diário"
      title="Quiz Diário"
      description="Teste seus conhecimentos com 3 questões rápidas."
    />
  );
};

export default DailyQuizScreen;