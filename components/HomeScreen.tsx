import React, { useMemo } from 'react';
import { Screen, PerformanceRecord } from '../types.ts';
import { PencilSquareIcon, ChartBarIcon, BookOpenIcon, CalculatorIcon, SparklesIcon, BrainIcon } from './icons.tsx';

interface HomeScreenProps {
    setScreen: (screen: Screen) => void;
    performanceHistory: PerformanceRecord[];
}

const HomeScreen: React.FC<HomeScreenProps> = ({ setScreen, performanceHistory }) => {
    const overallStats = useMemo(() => {
        if (performanceHistory.length === 0) {
            return { totalQuestions: 0, totalCorrect: 0, average: 0 };
        }
        const totalCorrect = performanceHistory.reduce((acc, record) => acc + record.score, 0);
        const totalQuestions = performanceHistory.reduce((acc, record) => acc + record.total, 0);
        const average = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
        return { totalQuestions, totalCorrect, average };
    }, [performanceHistory]);

    const menuItems = [
        { screen: 'difficultySelection', title: 'Simulado Completo', description: 'Faça uma prova completa.', icon: BookOpenIcon },
        { screen: 'writingLab', title: 'Laboratório de Redação', description: 'Pratique e receba feedback.', icon: PencilSquareIcon },
        { screen: 'dailyQuiz', title: 'Quiz Diário', description: 'Um teste rápido para o dia.', icon: SparklesIcon },
        { screen: 'focusSubjects', title: 'Matérias para Focar', description: 'Revise os tópicos importantes.', icon: CalculatorIcon },
        { screen: 'performanceHistory', title: 'Histórico de Desempenho', description: 'Acompanhe sua evolução.', icon: ChartBarIcon },
        { screen: 'studyPlan', title: 'Plano de Estudos', description: 'Siga um cronograma guiado.', icon: BrainIcon },
        { screen: 'tips', title: 'Estratégias de Prova', description: 'Dicas para o dia do exame.', icon: BookOpenIcon },
        { screen: 'anxiety', title: 'Controle de Ansiedade', description: 'Técnicas para manter a calma.', icon: BrainIcon },
    ];

    return (
        <div className="min-h-screen flex flex-col p-4 sm:p-6 md:p-8 animate-fade-in">
            <div className="w-full max-w-6xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-white">Seu Painel</h1>
                    <p className="text-xl text-slate-400 mt-2">Olá! Pronto para a sua próxima sessão de estudos?</p>
                </header>

                <div className="mb-12 bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-violet-500/30">
                    <h2 className="text-xl font-bold text-white mb-3">Resumo de Desempenho</h2>
                    <div className="flex items-center justify-between">
                         <div>
                            <p className="text-slate-300">Média geral de acertos</p>
                            <p className="text-4xl font-bold gradient-text">{overallStats.average.toFixed(1)}%</p>
                         </div>
                         <div className="text-right">
                            <p className="text-slate-300">Questões respondidas</p>
                            <p className="text-2xl font-bold text-white">{overallStats.totalQuestions}</p>
                         </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {menuItems.map(item => (
                        <button
                            key={item.screen}
                            onClick={() => setScreen(item.screen as Screen)}
                            className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 text-left hover:bg-slate-800/70 hover:border-cyan-400 transition-all transform hover:-translate-y-1 group"
                        >
                            <item.icon className="h-8 w-8 mb-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                            <h2 className="text-xl font-bold text-white">{item.title}</h2>
                            <p className="text-slate-400 mt-1">{item.description}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;