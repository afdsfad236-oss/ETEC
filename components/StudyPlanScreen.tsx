import React, { useState, useEffect } from 'react';
import { studyPlanData } from '../services/studyPlanData.ts';
import { loadFromStorage, saveToStorage } from '../services/storage.ts';
import StudyCalendar from './StudyCalendar.tsx';

interface StudyPlanScreenProps {
  onGoHome: () => void;
}

const STORAGE_KEY = 'completedStudyDays';

const StudyPlanScreen: React.FC<StudyPlanScreenProps> = ({ onGoHome }) => {
    const [completedDays, setCompletedDays] = useState<number[]>(() => loadFromStorage(STORAGE_KEY, []));

    useEffect(() => {
        saveToStorage(STORAGE_KEY, completedDays);
    }, [completedDays]);

    const handleToggleDay = (dayId: number) => {
        setCompletedDays(prev => 
            prev.includes(dayId) 
                ? prev.filter(id => id !== dayId)
                : [...prev, dayId]
        );
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-4xl">
                <button onClick={onGoHome} className="absolute top-4 left-4 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    &larr; Voltar
                </button>
                <div className="text-center my-8">
                    <h1 className="text-4xl font-extrabold text-white">Plano de Estudos</h1>
                    <p className="text-slate-400 mt-2">Um cronograma de 4 semanas para guiar sua preparação.</p>
                </div>

                <StudyCalendar 
                    plan={studyPlanData} 
                    completedDays={completedDays} 
                    onToggleDay={handleToggleDay} 
                />
            </div>
        </div>
    );
};

export default StudyPlanScreen;
