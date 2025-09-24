import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen.tsx';
import HomeScreen from './components/HomeScreen.tsx';
import ExamScreen from './components/ExamScreen.tsx';
import ResultsScreen from './components/ResultsScreen.tsx';
import StudyPlanScreen from './components/StudyPlanScreen.tsx';
import FocusSubjectsScreen from './components/FocusSubjectsScreen.tsx';
import TipsScreen from './components/TipsScreen.tsx';
import AnxietyTipsScreen from './components/AnxietyTipsScreen.tsx';
import DailyQuizScreen from './components/DailyQuizScreen.tsx';
import FocusQuizScreen from './components/FocusQuizScreen.tsx';
import DifficultySelectionScreen from './components/DifficultySelectionScreen.tsx';
import WritingLabScreen from './components/WritingLabScreen.tsx';
import PerformanceHistoryScreen from './components/PerformanceHistoryScreen.tsx';
import QuizReviewScreen from './components/QuizReviewScreen.tsx';
import { Answer, Question, Screen, Difficulty, PerformanceRecord } from './types.ts';
import { loadFromStorage, saveToStorage } from './services/storage.ts';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [reviewData, setReviewData] = useState<{ answers: Answer[]; questions: Question[]; title: string } | null>(null);
  const [focusQuizSubject, setFocusQuizSubject] = useState<string | null>(null);
  const [examDifficulty, setExamDifficulty] = useState<Difficulty>('Médio');
  const [performanceHistory, setPerformanceHistory] = useState<PerformanceRecord[]>([]);

  useEffect(() => {
    const loadedHistory = loadFromStorage<PerformanceRecord[]>('performanceHistory', []);
    setPerformanceHistory(loadedHistory);
  }, []);

  const handleFinishSession = (
    answers: Answer[], 
    questions: Question[], 
    type: PerformanceRecord['type'], 
    metadata: { title?: string; subject?: string; difficulty?: Difficulty }
  ) => {
      const score = answers.filter(a => a.isCorrect).length;
      const newRecord: PerformanceRecord = {
          id: new Date().toISOString(),
          date: new Date().toISOString(),
          type,
          score,
          total: questions.length,
          answers,
          questions,
          ...metadata,
      };
      
      const updatedHistory = [newRecord, ...performanceHistory];
      setPerformanceHistory(updatedHistory);
      saveToStorage('performanceHistory', updatedHistory);

      if (type === 'Simulado Completo') {
          setReviewData({ answers, questions, title: 'Resultado do Simulado' });
          setScreen('results');
      } else {
          setReviewData({ answers, questions, title: metadata.title || 'Resultado do Quiz' });
          setScreen('quizReview');
      }
  };

  const handleGoHome = () => {
    setScreen('home');
    setReviewData(null);
    setFocusQuizSubject(null);
  };
  
  const handleStartExam = (difficulty: Difficulty) => {
    setExamDifficulty(difficulty);
    setScreen('exam');
  };

  const handleStartFocusQuiz = (subject: string) => {
    setFocusQuizSubject(subject);
    setScreen('focusQuiz');
  };
  
  const renderScreen = () => {
    switch (screen) {
      case 'welcome':
        return <WelcomeScreen onStart={() => setScreen('home')} />;
      case 'home':
        return <HomeScreen setScreen={setScreen} performanceHistory={performanceHistory} />;
      case 'difficultySelection':
        return <DifficultySelectionScreen onSelectDifficulty={handleStartExam} onGoHome={handleGoHome} />;
      case 'exam':
        return <ExamScreen onFinish={handleFinishSession} onGoHome={handleGoHome} difficulty={examDifficulty} />;
      case 'results':
        return <ResultsScreen answers={reviewData?.answers || []} questions={reviewData?.questions || []} onGoHome={handleGoHome} />;
      case 'quizReview':
         return <QuizReviewScreen answers={reviewData?.answers || []} questions={reviewData?.questions || []} onGoHome={handleGoHome} title={reviewData?.title || 'Revisão do Quiz'} />;
      case 'studyPlan':
        return <StudyPlanScreen onGoHome={handleGoHome} />;
      case 'focusSubjects':
        return <FocusSubjectsScreen onGoHome={handleGoHome} onStartFocusQuiz={handleStartFocusQuiz} />;
      case 'tips':
        return <TipsScreen onGoHome={handleGoHome} />;
      case 'anxiety':
        return <AnxietyTipsScreen onGoHome={handleGoHome} />;
      case 'dailyQuiz':
        return <DailyQuizScreen onGoHome={handleGoHome} onFinish={handleFinishSession} />;
      case 'focusQuiz':
        return <FocusQuizScreen subject={focusQuizSubject!} onGoHome={handleGoHome} onFinish={handleFinishSession} />;
      case 'writingLab':
        return <WritingLabScreen onGoHome={handleGoHome} />;
      case 'performanceHistory':
        return <PerformanceHistoryScreen performanceHistory={performanceHistory} onGoHome={handleGoHome} />;
      default:
        return <WelcomeScreen onStart={() => setScreen('home')} />;
    }
  };

  return (
    <main>
      {renderScreen()}
    </main>
  );
};

export default App;