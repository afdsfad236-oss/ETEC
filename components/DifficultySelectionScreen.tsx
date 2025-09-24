import React from 'react';
import { Difficulty } from '../types.ts';

interface DifficultySelectionScreenProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onGoHome: () => void;
}

const difficulties: { level: Difficulty; description: string; color: string }[] = [
  { level: 'Fácil', description: 'Questões mais diretas para construir sua base.', color: 'text-green-400 border-green-500/50 hover:bg-green-500/10' },
  { level: 'Médio', description: 'Um desafio equilibrado, similar ao nível real do vestibulinho.', color: 'text-yellow-400 border-yellow-500/50 hover:bg-yellow-500/10' },
  { level: 'Difícil', description: 'Questões complexas para testar seu domínio e preparo.', color: 'text-red-400 border-red-500/50 hover:bg-red-500/10' },
];

const DifficultySelectionScreen: React.FC<DifficultySelectionScreenProps> = ({ onSelectDifficulty, onGoHome }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <button onClick={onGoHome} className="absolute top-4 left-4 bg-slate-800/50 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors z-10">
        &larr; Voltar
      </button>
      <div className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Escolha a Dificuldade</h1>
        <p className="text-lg text-slate-400 mb-12">Como você quer ser desafiado hoje?</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {difficulties.map(({ level, description, color }) => (
            <button
              key={level}
              onClick={() => onSelectDifficulty(level)}
              className={`bg-slate-900/50 backdrop-blur-sm p-8 rounded-xl border-2 border-slate-700 text-left hover:border-current transition-all transform hover:-translate-y-2 ${color}`}
            >
              <h2 className="text-3xl font-bold mb-3">{level}</h2>
              <p className="text-slate-300 text-base">{description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DifficultySelectionScreen;