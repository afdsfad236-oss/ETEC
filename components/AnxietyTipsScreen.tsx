import React from 'react';

interface AnxietyTipsScreenProps {
  onGoHome: () => void;
}

const anxietyTips = [
  {
    title: 'Na Semana da Prova',
    content: 'Não tente aprender conteúdo novo. Foque em revisões leves. Organize todo o material que precisa levar (documento, caneta, lanche). Durma bem, especialmente na noite anterior.'
  },
  {
    title: 'No Dia da Prova',
    content: 'Tome um bom café da manhã. Saia de casa com antecedência para evitar estresse com o trânsito. Evite conversar sobre a matéria com outros candidatos na porta do local de prova.'
  },
  {
    title: 'Durante a Prova',
    content: 'Se sentir a ansiedade aumentar, pare por um minuto. Feche os olhos, respire fundo 3 vezes, lentamente. Beba um pouco de água. Alongue o pescoço e os braços. Lembre-se que é só uma prova e você se preparou para ela.'
  },
  {
    title: 'Pensamento Positivo',
    content: 'Confie na sua preparação. O nervosismo é normal, mas não deixe ele te dominar. Lembre-se que você é capaz. Cada questão é uma nova oportunidade.'
  }
];

const AnxietyTipsScreen: React.FC<AnxietyTipsScreenProps> = ({ onGoHome }) => {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl">
        <button onClick={onGoHome} className="absolute top-4 left-4 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          &larr; Voltar
        </button>
        <div className="text-center my-8">
          <h1 className="text-4xl font-extrabold text-white">Controle de Ansiedade</h1>
          <p className="text-slate-400 mt-2">Mantenha a calma para fazer seu melhor na prova.</p>
        </div>

        <div className="space-y-6">
          {anxietyTips.map((tip, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
              <h2 className="text-2xl font-bold text-cyan-400 mb-2">{tip.title}</h2>
              <p className="text-slate-300 leading-relaxed">{tip.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnxietyTipsScreen;
