import React, { useState } from 'react';
import { generateWritingPrompt, getWritingFeedback } from '../services/aiService.ts';
import { XCircleIcon, SparklesIcon, BookOpenIcon, PaperAirplaneIcon, CheckCircleIcon } from './icons.tsx';

interface WritingLabScreenProps {
  onGoHome: () => void;
}

type WritingPrompt = { theme: string; supportTexts: { title: string; content: string }[] };
type WritingFeedback = { score: number; feedback: string; strengths: string; weaknesses:string; };

const WritingLabScreen: React.FC<WritingLabScreenProps> = ({ onGoHome }) => {
  const [prompt, setPrompt] = useState<WritingPrompt | null>(null);
  const [essay, setEssay] = useState('');
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [isLoading, setIsLoading] = useState<'prompt' | 'feedback' | false>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePrompt = async () => {
    setIsLoading('prompt');
    setError(null);
    setFeedback(null);
    setEssay('');
    try {
      const newPrompt = await generateWritingPrompt();
      setPrompt(newPrompt);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ocorreu um erro.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetFeedback = async () => {
    if (!prompt || essay.trim().length < 50) {
        setError("Por favor, escreva pelo menos 50 caracteres antes de pedir o feedback.");
        return;
    }
    setIsLoading('feedback');
    setError(null);
    try {
      const newFeedback = await getWritingFeedback(prompt.theme, essay);
      setFeedback(newFeedback);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ocorreu um erro.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderFeedbackList = (text: string) => {
    return (
        <ul className="space-y-2">
            {text.split('*').filter(item => item.trim()).map((item, index) => (
                <li key={index} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 mr-2 mt-1 flex-shrink-0 text-green-400" />
                    <span>{item.trim()}</span>
                </li>
            ))}
        </ul>
    );
  };
   const renderWeaknessList = (text: string) => {
    return (
        <ul className="space-y-2">
            {text.split('*').filter(item => item.trim()).map((item, index) => (
                <li key={index} className="flex items-start">
                    <XCircleIcon className="h-5 w-5 mr-2 mt-1 flex-shrink-0 text-yellow-400" />
                    <span>{item.trim()}</span>
                </li>
            ))}
        </ul>
    );
  };


  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl">
        <button onClick={onGoHome} className="absolute top-4 left-4 bg-slate-800/50 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors z-10">
          &larr; Voltar
        </button>
        <div className="text-center my-8">
          <h1 className="text-4xl font-extrabold text-white">Laboratório de Redação</h1>
          <p className="text-slate-400 mt-2">Gere temas, pratique sua escrita e receba feedback da IA.</p>
        </div>

        {error && (
            <div className="bg-red-500/10 text-red-400 border border-red-500/30 p-4 rounded-lg mb-6 flex items-center">
                <XCircleIcon className="h-6 w-6 mr-3"/>
                <p>{error}</p>
            </div>
        )}

        {!prompt && !isLoading && (
            <div className="text-center mt-16">
                 <BookOpenIcon className="h-24 w-24 mx-auto text-slate-600"/>
                 <h2 className="text-2xl font-bold text-white mt-4">Pronto para começar?</h2>
                 <p className="text-slate-400 mb-8">Clique no botão abaixo para gerar seu primeiro tema de redação.</p>
                 <button onClick={handleGeneratePrompt} className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-8 rounded-lg text-lg inline-flex items-center">
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    Gerar Tema
                 </button>
            </div>
        )}

        {isLoading === 'prompt' && (
            <div className="text-center mt-16">
                <svg className="animate-spin h-12 w-12 text-violet-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h2 className="text-2xl font-bold text-white mt-4">Criando um tema...</h2>
                <p className="text-slate-400">Aguarde, estamos preparando um desafio para você.</p>
            </div>
        )}
        
        {prompt && (
            <div className="space-y-8 animate-fade-in">
                {/* Prompt Section */}
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                    <h2 className="text-2xl font-bold text-cyan-400 mb-4">Tema: {prompt.theme}</h2>
                    <div className="space-y-4">
                        {prompt.supportTexts.map((text, index) => (
                            <div key={index} className="p-4 bg-slate-900/50 border border-slate-600 rounded-lg">
                                <h3 className="font-semibold text-slate-300">{text.title}</h3>
                                <p className="text-slate-400 italic">"{text.content}"</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Essay Input Section */}
                {!feedback && (
                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                        <h2 className="text-2xl font-bold text-white mb-4">Sua Redação</h2>
                        <textarea 
                            value={essay}
                            onChange={(e) => setEssay(e.target.value)}
                            placeholder="Comece a escrever seu texto dissertativo-argumentativo aqui..."
                            className="w-full h-80 bg-slate-900/70 border border-slate-600 rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
                            disabled={isLoading === 'feedback'}
                        />
                        <div className="flex justify-between items-center mt-4">
                            <p className="text-sm text-slate-400">{essay.length} caracteres</p>
                            <button onClick={handleGetFeedback} disabled={isLoading === 'feedback' || essay.trim().length < 50} className="bg-violet-600 text-white font-bold py-3 px-8 rounded-lg text-lg inline-flex items-center disabled:bg-slate-500 disabled:cursor-not-allowed hover:bg-violet-500 transition-colors">
                               {isLoading === 'feedback' ? <span className="animate-pulse">Analisando...</span> : <><PaperAirplaneIcon className="h-5 w-5 mr-2"/>Receber Feedback</>}
                            </button>
                        </div>
                    </div>
                )}


                {/* Feedback Section */}
                {feedback && (
                    <div className="animate-slide-up space-y-6">
                        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                            <h2 className="text-3xl font-bold text-white mb-4 text-center">Análise da IA</h2>
                             <div className="text-center mb-8">
                                <p className="text-xl text-slate-300">Sua nota:</p>
                                <p className={`text-7xl font-bold my-1 ${feedback.score >= 7 ? 'text-green-400' : feedback.score >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>{feedback.score}<span className="text-4xl text-slate-400">/10</span></p>
                            </div>

                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 mb-6">
                                <p className="text-slate-300">{feedback.feedback}</p>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/30">
                                    <h3 className="text-xl font-bold text-green-400 mb-3">Pontos Fortes</h3>
                                    <div className="text-green-300">{renderFeedbackList(feedback.strengths)}</div>
                                </div>
                                <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
                                    <h3 className="text-xl font-bold text-yellow-400 mb-3">Pontos a Melhorar</h3>
                                    <div className="text-yellow-300">{renderWeaknessList(feedback.weaknesses)}</div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <button onClick={handleGeneratePrompt} className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-8 rounded-lg text-lg inline-flex items-center">
                                <SparklesIcon className="h-5 w-5 mr-2" />
                                Gerar Novo Tema
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default WritingLabScreen;