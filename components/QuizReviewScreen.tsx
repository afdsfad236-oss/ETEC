import React from 'react';
import { Answer, Question } from '../types.ts';
import { CheckCircleIcon, XCircleIcon } from './icons.tsx';

interface QuizReviewScreenProps {
  answers: Answer[];
  questions: Question[];
  onGoHome: () => void;
  title: string;
}

const QuizReviewScreen: React.FC<QuizReviewScreenProps> = ({ answers, questions, onGoHome, title }) => {
  const score = answers.filter(a => a.isCorrect).length;
  const total = questions.length;
  const percentage = total > 0 ? (score / total) * 100 : 0;
  
  const getQuestionById = (id: number) => questions.find(q => q.id === id);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8 animate-fade-in">
      <div className="w-full max-w-4xl">
        <div className="text-center my-8">
          <h1 className="text-4xl font-extrabold text-white">{title}</h1>
          <p className="text-slate-400 mt-2">Veja seu desempenho.</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 text-center mb-8">
          <p className="text-xl text-slate-300">Você acertou</p>
          <p className="text-6xl font-bold my-2 text-cyan-400">{score} de {total} questões</p>
          <p className="text-2xl font-semibold text-white">{percentage.toFixed(1)}% de acerto</p>
        </div>

        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">Revisão das respostas:</h2>
            {answers.map(answer => {
                const question = getQuestionById(answer.questionId);
                if (!question) return null;

                return (
                    <div key={question.id} className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <p className="font-semibold text-white">{question.question}</p>
                        <div className={`mt-2 flex items-start p-3 rounded ${answer.isCorrect ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            {answer.isCorrect ? <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-1" /> : <XCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-1" />}
                            <span>Sua resposta: {answer.selectedOption}</span>
                        </div>
                        {!answer.isCorrect && (
                            <div className="mt-2 flex items-start p-3 rounded bg-cyan-500/10 text-cyan-400">
                                <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-1" />
                                <span>Resposta correta: {question.answer}</span>
                            </div>
                        )}
                        {question.explanation && 
                            <div className="mt-3 pt-3 border-t border-slate-700">
                                <p className="font-semibold text-amber-400 mb-1">Explicação:</p>
                                <p className="text-sm text-slate-300 whitespace-pre-wrap">{question.explanation}</p>
                            </div>
                        }
                    </div>
                );
            })}
        </div>

        <div className="text-center mt-8">
            <button onClick={onGoHome} className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-8 rounded-lg text-lg">
                Voltar para o Início
            </button>
        </div>
      </div>
    </div>
  );
};

export default QuizReviewScreen;