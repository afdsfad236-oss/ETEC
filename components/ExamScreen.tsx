import React, { useState, useEffect, useMemo } from 'react';
import { Question, Answer, Difficulty, PerformanceRecord } from '../types.ts';
import { generateExamQuestions } from '../services/aiService.ts';
import QuestionCard from './QuestionCard.tsx';
import ProgressBar from './ProgressBar.tsx';
import { XCircleIcon, ExitIcon } from './icons.tsx';

interface ExamScreenProps {
  onFinish: (
    answers: Answer[], 
    questions: Question[], 
    type: PerformanceRecord['type'], 
    metadata: { difficulty: Difficulty }
  ) => void;
  onGoHome: () => void;
  difficulty: Difficulty;
}

const ExamScreen: React.FC<ExamScreenProps> = ({ onFinish, onGoHome, difficulty }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const generatedQuestions = await generateExamQuestions(difficulty);
        setQuestions(generatedQuestions);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [difficulty]);

  const answeredProgress = useMemo(() => {
    if (questions.length === 0) return [];
    const progress = new Array(questions.length).fill(false);
    answers.forEach(a => {
        const questionIndex = questions.findIndex(q => q.id === a.questionId);
        if(questionIndex > -1) {
            progress[questionIndex] = true;
        }
    });
    return progress;
  }, [answers, questions]);
  
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
      onFinish(updatedAnswers, questions, 'Simulado Completo', { difficulty });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <svg className="animate-spin h-12 w-12 text-violet-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h1 className="text-2xl font-bold text-white">Gerando seu simulado {difficulty}...</h1>
        <p className="text-slate-400 mt-2">Isso pode levar alguns instantes. Estamos criando uma prova desafiadora para você!</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <XCircleIcon className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white">Falha ao gerar o simulado</h1>
        <p className="text-slate-400 mt-2 mb-6">{error}</p>
        <button onClick={onGoHome} className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-8 rounded-lg text-lg">
            Voltar para o Início
        </button>
      </div>
    );
  }

  if(questions.length === 0) {
      return (
         <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-2xl font-bold text-white">Nenhuma questão encontrada</h1>
            <p className="text-slate-400 mt-2 mb-6">Não foi possível carregar as questões para o simulado.</p>
            <button onClick={onGoHome} className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-8 rounded-lg text-lg">
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
            <h2 className="text-2xl font-bold text-white mb-4">Sair do Simulado?</h2>
            <p className="text-slate-400 mb-8">Seu progresso atual será perdido. Você tem certeza?</p>
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
        aria-label="Sair do simulado"
      >
          <ExitIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Sair</span>
      </button>
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

export default ExamScreen;