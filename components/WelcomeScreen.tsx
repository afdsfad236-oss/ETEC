import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center animate-fade-in">
       <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] [mask-image:linear-gradient(to_bottom,transparent,white)]"></div>
      <h1 className="text-6xl md:text-8xl font-black gradient-text uppercase tracking-tighter animate-slide-up" style={{ animationDelay: '0.2s' }}>
        PreparaETEC
      </h1>
      <p className="text-xl md:text-2xl text-slate-300 mt-4 mb-12 max-w-2xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
        Sua jornada para a aprovação começa aqui.
      </p>
      <button 
        onClick={onStart} 
        className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 px-10 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg shadow-violet-500/20 animate-slide-up"
        style={{ animationDelay: '0.6s' }}
      >
        Começar a Estudar
      </button>
       <p className="text-sm text-slate-500 mt-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>Criado por Kauê 9ºc</p>
    </div>
  );
};

export default WelcomeScreen;