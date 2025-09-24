import React from 'react';
import { weeklyQuizzesData } from '../services/weeklyQuizzesData.ts';
import QuizScreen from './QuizScreen.tsx';

interface WeeklyQuizScreenProps {
  onGoHome: () => void;
}

const WeeklyQuizScreen: React.FC<WeeklyQuizScreenProps> = ({ onGoHome }) => {
    const firstQuiz = weeklyQuizzesData[0];
    return (
        <QuizScreen
            questions={firstQuiz?.questions || []}
            onGoHome={onGoHome}
            title={firstQuiz?.title || "Quiz Semanal"}
            description="Teste seus conhecimentos da semana."
        />
    );
};

export default WeeklyQuizScreen;
