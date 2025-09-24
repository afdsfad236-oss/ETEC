import React, { useState, useEffect } from 'react';
import { Question, Answer, PerformanceRecord } from '../types.ts';
import { generateSubjectQuiz } from '../services/aiService.ts';
import QuizScreen from './QuizScreen.tsx';
import { XCircleIcon } from './icons.tsx';

interface FocusQuizScreenProps {
  subject: string;
  onGoHome: () => void;
  onFinish: (
    answers: Answer[], 
    questions: Question[], 
    type: PerformanceRecord['type'], 
    metadata: { title: string, subject: string }
  ) => void;
}

const FocusQuizScreen: React.FC<FocusQuizScreenProps> = ({ subject, onGoHome, onFinish }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const generatedQuestions = await generateSubjectQuiz(subject);
        setQuestions(generatedQuestions);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [subject]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <svg className="animate-spin h-12 w-12 text-violet-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h1 className="text-2xl font-bold text-white">Gerando seu quiz de {subject}...</h1>
        <p className="text-slate-400 mt-2">Aguarde um instante.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <XCircleIcon className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white">Falha ao gerar o quiz</h1>
        <p className="text-slate-400 mt-2 mb-6">{error}</p>
        <button onClick={onGoHome} className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-8 rounded-lg text-lg">
            Voltar para o Início
        </button>
      </div>
    );
  }

  return (
    <QuizScreen
      questions={questions}
      onGoHome={onGoHome}
      onFinish={onFinish}
      quizType="Estudo Rápido"
      title={`Estudo Rápido: ${subject}`}
      description={`Teste seus conhecimentos em ${subject} com 3 questões.`}
      subject={subject}
    />
  );
};

export default FocusQuizScreen;