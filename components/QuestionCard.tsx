import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types.ts';
import { getChatResponse } from '../services/aiService.ts';
import { tips } from '../services/tipsData.ts';
import { LightBulbIcon, SparklesIcon, CheckCircleIcon, XCircleIcon, PhotoIcon, ChatBubbleLeftRightIcon, PaperAirplaneIcon, AcademicCapIcon } from './icons.tsx';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  selectedOption: string | null;
  questionIndex: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, selectedOption, questionIndex }) => {
  const [showHint, setShowHint] = useState(false);
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const isAnswered = selectedOption !== null;
  const isCorrect = isAnswered && selectedOption === question.answer;

  const currentTip = tips[questionIndex % tips.length];

  useEffect(() => {
    setShowHint(false);
    setImageStatus('loading');
    setChatHistory([]);
    setChatInput('');
    setIsChatLoading(false);
  }, [question]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const newUserMessage = { role: 'user' as const, text: chatInput };
    const updatedHistory = [...chatHistory, newUserMessage];
    setChatHistory(updatedHistory);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await getChatResponse(question, selectedOption!, updatedHistory);
      setChatHistory(prev => [...prev, { role: 'model' as const, text: response }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'model' as const, text: "Ocorreu um erro. Tente perguntar novamente." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const getOptionClass = (option: string) => {
    if (isAnswered) {
      if (option === question.answer) return 'bg-green-500/20 border-green-500 text-white font-semibold cursor-default';
      if (selectedOption === option) return 'bg-red-500/20 border-red-500 text-white font-semibold cursor-default';
      return 'bg-slate-800 border-slate-700 text-slate-400 opacity-60 cursor-default';
    }
    if (selectedOption === option) return 'bg-violet-500 border-violet-400 text-white font-semibold';
    return 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300';
  };

  return (
    <>
    <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 w-full max-w-4xl">
      
      {!isAnswered && currentTip && (
        <div className="mb-6 p-4 bg-violet-900/30 rounded-lg border border-violet-700 animate-fade-in">
          <p className="flex items-center text-lg font-semibold text-violet-300 mb-2">
            <AcademicCapIcon className="h-6 w-6 mr-3 flex-shrink-0" />
            Estratégia de Prova
          </p>
          <p className="text-violet-200"><span className="font-bold">{currentTip.title}:</span> {currentTip.content}</p>
        </div>
      )}

      <div className="mb-6 aspect-video w-full overflow-hidden rounded-lg bg-slate-800">
        {imageStatus === 'loading' && <div className="w-full h-full bg-slate-800 animate-pulse"></div>}
        {imageStatus === 'error' && (
            <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center text-slate-500">
                <PhotoIcon className="h-16 w-16" />
                <p className="mt-2 text-sm">Não foi possível carregar a imagem</p>
            </div>
        )}
        <img key={question.id} src={`https://picsum.photos/seed/${question.id}/800/450`} alt={`Imagem ilustrativa para a questão sobre ${question.subject}`} className={`w-full h-full object-cover transition-opacity duration-300 ${imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setImageStatus('loaded')} onError={() => setImageStatus('error')} style={{ display: imageStatus === 'loading' || imageStatus === 'error' ? 'none' : 'block' }} />
      </div>
      <p className="text-sm font-semibold text-cyan-400 mb-2">{question.subject}</p>
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6">{question.question}</h2>
      <div className="space-y-4">
        {question.options.map(option => (
          <button key={option} onClick={() => onAnswer(option)} disabled={isAnswered} className={`w-full text-left p-4 rounded-lg border-2 transition-colors duration-200 flex justify-between items-center ${getOptionClass(option)}`}>
            <span>{option}</span>
            {isAnswered && option === question.answer && <CheckCircleIcon className="h-6 w-6 text-green-400 flex-shrink-0" />}
            {isAnswered && selectedOption === option && option !== question.answer && <XCircleIcon className="h-6 w-6 text-red-400 flex-shrink-0" />}
          </button>
        ))}
      </div>

      <div className="mt-6 border-t border-slate-700 pt-4 min-h-[80px]">
        {!isAnswered && (
          <div className="flex justify-end gap-4">
            {question.hint && !showHint && (
              <button 
                onClick={() => setShowHint(true)} 
                className="flex items-center justify-center px-4 py-2 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/20 transition-colors"
              >
                <LightBulbIcon className="h-5 w-5 mr-2" />
                Ver Dica
              </button>
            )}
          </div>
        )}
        
        {showHint && !isAnswered && question.hint && (
          <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 mt-4 animate-fade-in">
            <p className="flex items-center text-lg font-semibold text-cyan-400 mb-2">
              <SparklesIcon className="h-5 w-5 mr-2" />
              Dica da IA
            </p>
            <p className="text-slate-300">{question.hint}</p>
          </div>
        )}

        {isAnswered && question.explanation && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold text-amber-400 mb-2">Explicação:</h3>
              {question.subject === 'Matemática' && question.explanationImageUrl && (
                  <div className="mb-4 mt-4 aspect-video w-full overflow-hidden rounded-lg bg-slate-700">
                      <img 
                          src={`https://picsum.photos/seed/${encodeURIComponent(question.explanationImageUrl)}/800/450`} 
                          alt={`Ilustração do conceito matemático da questão`}
                          className="w-full h-full object-cover"
                      />
                  </div>
              )}
              <p className="text-slate-300 whitespace-pre-wrap">{question.explanation}</p>
            </div>
        )}

        {isAnswered && !isCorrect && (
          <div className="mt-6 pt-6 border-t border-slate-700 animate-slide-up">
            <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center"><ChatBubbleLeftRightIcon className="h-6 w-6 mr-3" />Ainda com dúvidas?</h3>
            <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700">
              <div ref={chatContainerRef} className="h-48 overflow-y-auto space-y-4 pr-2">
                <div className="flex justify-start">
                  <div className="bg-slate-700 text-white p-3 rounded-lg max-w-xs">Olá! Vi que você errou esta questão. Como posso te ajudar a entender melhor o assunto?</div>
                </div>
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`${msg.role === 'user' ? 'bg-violet-600' : 'bg-slate-700'} text-white p-3 rounded-lg max-w-xs whitespace-pre-wrap`}>{msg.text}</div>
                  </div>
                ))}
                {isChatLoading && <div className="flex justify-start"><div className="bg-slate-700 text-white p-3 rounded-lg"><span className="animate-pulse">Digitando...</span></div></div>}
              </div>
              <form onSubmit={handleSendChatMessage} className="mt-4 flex gap-2">
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Pergunte ao assistente..." className="flex-grow bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
                <button type="submit" disabled={isChatLoading || !chatInput.trim()} className="bg-violet-600 text-white p-3 rounded-lg disabled:bg-slate-500 disabled:cursor-not-allowed hover:bg-violet-500 transition-colors"><PaperAirplaneIcon className="h-5 w-5" /></button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default QuestionCard;