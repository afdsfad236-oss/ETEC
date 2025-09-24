import { Quiz } from '../types.ts';
import { examData } from './examData.ts';

export const weeklyQuizzesData: Quiz[] = [
  {
    id: 1,
    title: 'Revisão da Semana 1',
    questions: examData.filter(q => ['Português', 'Matemática'].includes(q.subject)).slice(0, 5),
  },
  {
    id: 2,
    title: 'Revisão da Semana 2',
    questions: examData.filter(q => ['Ciências Humanas', 'Ciências da Natureza'].includes(q.subject)).slice(0, 5),
  },
];
