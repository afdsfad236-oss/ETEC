import React, { useMemo } from 'react';
import { PerformanceRecord } from '../types.ts';
import { ArrowTrendingUpIcon, ChartBarIcon } from './icons.tsx';

interface PerformanceHistoryScreenProps {
  performanceHistory: PerformanceRecord[];
  onGoHome: () => void;
}

const PerformanceHistoryScreen: React.FC<PerformanceHistoryScreenProps> = ({ performanceHistory, onGoHome }) => {
    
    const subjectStats = useMemo(() => {
        const stats: { [subject: string]: { correct: number; total: number } } = {};

        performanceHistory.forEach(record => {
            record.questions.forEach((question, index) => {
                const subject = question.subject;
                if (!stats[subject]) {
                    stats[subject] = { correct: 0, total: 0 };
                }
                stats[subject].total++;
                if (record.answers[index]?.isCorrect) {
                    stats[subject].correct++;
                }
            });
        });

        return Object.entries(stats).map(([subject, data]) => ({
            subject,
            percentage: data.total > 0 ? (data.correct / data.total) * 100 : 0,
        })).sort((a, b) => b.percentage - a.percentage);

    }, [performanceHistory]);

    const overallAverage = useMemo(() => {
        if (performanceHistory.length === 0) return 0;
        const totalCorrect = performanceHistory.reduce((acc, record) => acc + record.score, 0);
        const totalQuestions = performanceHistory.reduce((acc, record) => acc + record.total, 0);
        return totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
    }, [performanceHistory]);
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-5xl">
        <button onClick={onGoHome} className="absolute top-4 left-4 bg-slate-800/50 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors z-10">
          &larr; Voltar
        </button>
        <div className="text-center my-8">
          <h1 className="text-4xl font-extrabold text-white">Histórico de Desempenho</h1>
          <p className="text-slate-400 mt-2">Analise sua evolução e identifique seus pontos fortes e fracos.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
                <div className="flex items-center text-lg font-bold text-white mb-4">
                    <ArrowTrendingUpIcon className="h-6 w-6 mr-3 text-green-400" />
                    Desempenho Geral
                </div>
                <p className="text-slate-300">Sua média de acertos em todas as atividades é:</p>
                <p className="text-5xl font-bold gradient-text mt-2">{overallAverage.toFixed(1)}%</p>
            </div>
             <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
                <div className="flex items-center text-lg font-bold text-white mb-4">
                    <ChartBarIcon className="h-6 w-6 mr-3 text-cyan-400" />
                    Desempenho por Matéria
                </div>
                <div className="space-y-2">
                    {subjectStats.map(({ subject, percentage }) => (
                        <div key={subject}>
                            <div className="flex justify-between text-sm font-medium text-slate-300 mb-1">
                                <span>{subject}</span>
                                <span>{percentage.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2.5">
                                <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                            </div>
                        </div>
                    ))}
                    {subjectStats.length === 0 && <p className="text-slate-500 text-center py-4">Complete um simulado ou quiz para ver suas estatísticas.</p>}
                </div>
            </div>
        </div>

        <div>
            <h2 className="text-2xl font-bold text-white mb-4">Atividades Recentes</h2>
            <div className="space-y-4">
                {performanceHistory.map(record => (
                     <div key={record.id} className="bg-slate-900/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                        <div>
                            <p className="font-bold text-white">{record.type} {record.subject ? `- ${record.subject}` : ''} {record.difficulty ? `(${record.difficulty})` : ''}</p>
                            <p className="text-sm text-slate-400">{formatDate(record.date)}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg text-cyan-400">{record.score}/{record.total}</p>
                            <p className="text-sm text-slate-400">{((record.score / record.total) * 100).toFixed(0)}% de acerto</p>
                        </div>
                     </div>
                ))}
                {performanceHistory.length === 0 && <p className="text-slate-500 text-center py-8">Nenhuma atividade registrada ainda.</p>}
            </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceHistoryScreen;
