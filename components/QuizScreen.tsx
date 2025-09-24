import React, { useState, useMemo } from 'react';
import { Question, Answer, PerformanceRecord } from '../types.ts';
import QuestionCard from './QuestionCard.tsx';
import ProgressBar from './ProgressBar.tsx';
import { ExitIcon } from './icons.tsx';

interface QuizScreenProps {
  questions: Question[];
  onGoHome: () => void;
  onFinish: (
    answers: Answer[], 
    questions: Question[], 
    type: PerformanceRecord['type'], 
    metadata: { title: string, subject?: string }
  ) => void;
  title: string;
  description: string;
  quizType: PerformanceRecord['type'];
  subject?: string;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onGoHome, onFinish, title, description, quizType, subject }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const answeredProgress = useMemo(() => {
    const progress = new Array(questions.length).fill(false);
    answers.forEach((_a, index) => progress[index] = true);
    return progress;
  }, [answers, questions.length]);
  
  const handleAnswer = (option: string) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.answer;
    
    const newAnswer = {
        questionId: currentQuestion.id,
        selectedOption,
        isCorrect
    };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setSelectedOption(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onFinish(updatedAnswers, questions, quizType, { title, subject });
    }
  };

  if (!questions || questions.length === 0) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold text-white mb-4">{title}</h1>
            <p className="text-slate-400 mb-8">Nenhuma questão disponível no momento.</p>
            <button onClick={onGoHome} className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-2 px-4 rounded-lg">
                Voltar para o Início
            </button>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        {showExitConfirm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 rounded-xl p-8 max-w-sm w-full text-center border border-slate-700 shadow-2xl animate-slide-up">
            <h2 className="text-2xl font-bold text-white mb-4">Sair do Quiz?</h2>
            <p className="text-slate-400 mb-8">Seu progresso será perdido. Você tem certeza?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-8 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={onGoHome}
                className="px-8 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors"
              >
                Sim, Sair
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowExitConfirm(true)}
        className="absolute top-4 right-4 z-20 flex items-center gap-2 text-slate-400 hover:text-white transition-colors py-2 px-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/70 border border-slate-700"
        aria-label="Sair do quiz"
      >
          <ExitIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Sair</span>
      </button>

      <div className="text-center mb-8 max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="text-slate-400 mt-1">{description}</p>
      </div>
      <ProgressBar current={currentQuestionIndex} total={questions.length} answered={answeredProgress} />
      <QuestionCard
        question={questions[currentQuestionIndex]}
        onAnswer={handleAnswer}
        selectedOption={selectedOption}
        questionIndex={currentQuestionIndex}
      />
      <button
        onClick={handleNext}
        disabled={selectedOption === null}
        className="mt-8 bg-violet-600 text-white font-bold py-3 px-12 rounded-lg text-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-violet-500"
      >
        {currentQuestionIndex < questions.length - 1 ? 'Próxima' : 'Finalizar'}
      </button>
    </div>
  );
};

export default QuizScreen;