import React from 'react';
import { tips } from '../services/tipsData.ts';

interface TipsScreenProps {
  onGoHome: () => void;
}

const TipsScreen: React.FC<TipsScreenProps> = ({ onGoHome }) => {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl">
        <button onClick={onGoHome} className="absolute top-4 left-4 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          &larr; Voltar
        </button>
        <div className="text-center my-8">
          <h1 className="text-4xl font-extrabold text-white">Estratégias de Prova</h1>
          <p className="text-slate-400 mt-2">Técnicas para estudar melhor e otimizar seu desempenho no dia do vestibulinho.</p>
        </div>

        <div className="space-y-8">
          {tips.map((tip, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
              <img src={tip.imageUrl} alt={`Ilustração para ${tip.title}`} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-cyan-400 mb-2">{tip.title}</h2>
                <p className="text-slate-300 leading-relaxed">{tip.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TipsScreen;