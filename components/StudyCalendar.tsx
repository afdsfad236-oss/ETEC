import React from 'react';
// FIX: Ensured file extension is present in import path.
import { StudyDay } from '../types.ts';

interface StudyCalendarProps {
  plan: StudyDay[];
  completedDays: number[];
  onToggleDay: (dayId: number) => void;
}

const StudyCalendar: React.FC<StudyCalendarProps> = ({ plan, completedDays, onToggleDay }) => {
  const weeks = Array.from({ length: 4 }, (_, i) => i + 1);

  return (
    <div className="space-y-8">
      {weeks.map(weekNum => (
        <div key={weekNum} className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Semana {weekNum}</h2>
          <div className="space-y-4">
            {plan.filter(day => day.week === weekNum).map(day => {
              const isCompleted = completedDays.includes(day.id);
              return (
                <div key={day.id} className={`p-4 rounded-lg border ${day.isRestDay ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-700 border-slate-600'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`font-bold text-lg ${day.isRestDay ? 'text-green-400' : 'text-white'}`}>
                        Dia {day.day}: {day.subject} - <span className="font-normal text-slate-300">{day.topic}</span>
                      </h3>
                      <p className="text-slate-400 mt-1">{day.content}</p>
                    </div>
                    {!day.isRestDay && (
                      <button onClick={() => onToggleDay(day.id)} className="ml-4 flex-shrink-0">
                        <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-colors ${isCompleted ? 'bg-green-500 border-green-400' : 'bg-slate-800 border-slate-500'}`}>
                          {isCompleted && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudyCalendar;
