import React, { useState } from 'react';
import { focusSubjectsData } from '../services/focusSubjectsData.ts';
import { mathStrategiesData, MathStrategy } from '../services/mathStrategiesData.ts';
import { SparklesIcon, BrainIcon, XMarkIcon } from './icons.tsx';

interface FocusSubjectsScreenProps {
  onGoHome: () => void;
  onStartFocusQuiz: (subject: string) => void;
}

const FocusSubjectsScreen: React.FC<FocusSubjectsScreenProps> = ({ onGoHome, onStartFocusQuiz }) => {
  const [selectedStrategy, setSelectedStrategy] = useState<MathStrategy | null>(null);

  return (
    <>
      <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-5xl">
          <button onClick={onGoHome} className="absolute top-4 left-4 bg-slate-800/50 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors z-10">
            &larr; Voltar
          </button>
          <div className="text-center my-8">
            <h1 className="text-4xl font-extrabold text-white">Matérias para Focar</h1>
            <p className="text-slate-400 mt-2">Estes são os tópicos com maior incidência no vestibulinho.</p>
          </div>

          <div className="mb-12">
            <div className="flex items-center mb-4">
                <BrainIcon className="h-8 w-8 text-violet-400 mr-3" />
                <h2 className="text-3xl font-bold text-white">Estratégias de Matemática</h2>
            </div>
            <p className="text-slate-400 mb-4 -mt-2">Clique em um card para ver um exemplo prático de como montar a conta.</p>
            <div className="flex overflow-x-auto space-x-6 pb-4 custom-scrollbar">
              {mathStrategiesData.map((strategy, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedStrategy(strategy)}
                  className="flex-shrink-0 w-72 h-40 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer hover:border-cyan-400 flex flex-col"
                >
                  <h3 className="text-lg font-bold text-cyan-400">{strategy.title}</h3>
                  <p className="text-slate-300 text-sm mt-2 whitespace-pre-line flex-grow">{strategy.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {focusSubjectsData.map(subject => (
              <div key={subject.subject} className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                  <div className="flex items-center mb-4 sm:mb-0">
                    <subject.icon className="h-8 w-8 text-cyan-400 mr-4 flex-shrink-0" />
                    <h2 className="text-2xl font-bold text-white">{subject.subject}</h2>
                  </div>
                  <button 
                    onClick={() => onStartFocusQuiz(subject.subject)}
                    className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-500 transition-colors"
                  >
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    Estudo Rápido
                  </button>
                </div>
                <ul className="list-disc list-inside space-y-2 text-slate-300">
                  {subject.topics.map(topic => <li key={topic}>{topic}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {selectedStrategy && (
        <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedStrategy(null)}
        >
          <div 
            className="bg-slate-900 rounded-2xl p-6 max-w-3xl w-full text-center border border-slate-700 shadow-2xl animate-slide-up relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedStrategy(null)}
              className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white transition-colors"
              aria-label="Fechar exemplo"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>
            <h2 className="text-3xl font-bold text-white mb-4">{selectedStrategy.title}</h2>
            <p className="text-slate-400 mb-6">Veja um exemplo de como aplicar esta técnica:</p>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-700">
                <img 
                    src={selectedStrategy.exampleImageUrl} 
                    alt={`Exemplo prático de ${selectedStrategy.title}`} 
                    className="w-full h-auto object-contain rounded-md" 
                />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FocusSubjectsScreen;