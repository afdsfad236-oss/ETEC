import { GoogleGenAI, Type } from "@google/genai";
import { Question } from '../types.ts';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const questionSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.INTEGER },
        question: { type: Type.STRING, description: "A pergunta desafiadora estilo ETEC." },
        options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Exatamente 4 opções de resposta."
        },
        answer: { type: Type.STRING, description: "A resposta correta, que deve ser uma das opções." },
        subject: { type: Type.STRING, description: "A matéria da questão (ex: Português, Matemática, História, Biologia, Química, Física)." },
        explanation: { 
            type: Type.STRING, 
            description: "Uma explicação muito resumida e direta sobre o porquê da resposta estar correta. Deve ser seguida OBRIGATORIAMENTE por um exemplo prático para ilustrar o conceito." 
        },
        hint: { type: Type.STRING, description: "Uma dica útil, mas não óbvia, que guie o raciocínio sem entregar a resposta."},
        explanationImageUrl: { 
            type: Type.STRING, 
            description: "APENAS para questões de Matemática. Um prompt descritivo para ser usado como 'seed' para uma imagem de placeholder (picsum.photos) que ilustre a resolução da questão. Deve ser uma string curta, em inglês, usando hífens. Ex: 'blackboard-with-geometric-formulas'. Para outras matérias, este campo deve ser nulo."
        }
    },
    required: ["id", "question", "options", "answer", "subject", "explanation", "hint"]
};


export const generateExamQuestions = async (difficulty: string): Promise<Question[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Gere um simulado com nível de dificuldade ${difficulty} para o vestibulinho da ETEC com 50 questões. As questões devem abranger as seguintes matérias: Português, Matemática, História, Geografia, Biologia, Física e Química. Cada questão deve ter 4 opções de múltipla escolha e apenas uma correta. Para cada questão, forneça: 1) uma explicação curta e direta para a resposta correta, seguida OBRIGATORIAMENTE por um exemplo claro que ajude a entender o conceito, e 2) uma dica útil que guie o raciocínio do aluno sem entregar a resposta. APENAS para questões de 'Matemática', forneça também um 'explanationImageUrl', que é um prompt curto, em inglês, com palavras separadas por hífen, para ser usado como 'seed' para uma imagem de placeholder (picsum.photos) para ilustrar a explicação (ex: 'blackboard-with-pythagorean-theorem'). Para as outras matérias, o campo 'explanationImageUrl' deve ser nulo.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: questionSchema
                },
            },
        });

        const jsonStr = response.text.trim();
        const parsedQuestions = JSON.parse(jsonStr);
        
        return parsedQuestions.map((q: any, index: number) => ({
            ...q,
            id: q.id || index + 1,
            options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ["Opção A", "Opção B", "Opção C", "Opção D"]
        }));

    } catch (error) {
        console.error("Error generating exam questions:", error);
        throw new Error("Não foi possível gerar as questões do simulado. Tente novamente.");
    }
};

export const generateSubjectQuiz = async (subject: string): Promise<Question[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Gere um mini-quiz com 3 questões de nível difícil sobre a matéria de ${subject} para o vestibulinho da ETEC. As questões devem ser desafiadoras, mas relevantes para o que é cobrado na prova. Para cada questão, forneça: 1) uma explicação curta e direta para a resposta correta, seguida OBRIGATORIAMENTE por um exemplo claro que ajude a entender o conceito, e 2) uma dica útil que guie o raciocínio do aluno sem entregar a resposta. Se a matéria for 'Matemática', forneça também um 'explanationImageUrl', que é um prompt curto, em inglês, com palavras separadas por hífen, para ser usado como 'seed' para uma imagem de placeholder (picsum.photos) para ilustrar a explicação (ex: 'blackboard-with-pythagorean-theorem'). Para as outras matérias, o campo 'explanationImageUrl' deve ser nulo.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: questionSchema
                },
            },
        });

        const jsonStr = response.text.trim();
        const parsedQuestions = JSON.parse(jsonStr);
        
        return parsedQuestions.map((q: any, index: number) => ({
            ...q,
            id: q.id || index + 1,
            options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ["Opção A", "Opção B", "Opção C", "Opção D"]
        }));

    } catch (error) {
        console.error(`Error generating quiz for ${subject}:`, error);
        throw new Error(`Não foi possível gerar o quiz de ${subject}. Tente novamente.`);
    }
};

export const getChatResponse = async (
  question: Question, 
  userAnswer: string, 
  history: {role: 'user' | 'model', text: string}[]
): Promise<string> => {
    try {
        const historyText = history.map(h => `${h.role === 'user' ? 'Aluno' : 'Assistente'}: ${h.text}`).join('\n');
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Você é um assistente de estudos amigável e encorajador para um aluno que está se preparando para o vestibulinho da ETEC. O aluno respondeu uma questão incorretamente e está pedindo ajuda. Seja paciente e didático.

            **Contexto da Questão:**
            - **Pergunta:** ${question.question}
            - **Resposta Correta:** ${question.answer}
            - **Resposta do Aluno:** ${userAnswer}
            - **Explicação Original:** ${question.explanation}

            **Conversa até agora:**
            ${historyText}

            Com base em todo o contexto e na última pergunta do aluno, forneça uma resposta clara, simples e útil para ajudá-lo a entender o conceito. Mantenha a resposta curta e direta (máximo de 3 frases). Não dê apenas a resposta, explique o raciocínio de forma concisa.`,
        });
        
        return response.text;
    } catch (error) {
        console.error("Error getting chat response:", error);
        return "Desculpe, não consegui processar sua pergunta. Tente novamente.";
    }
};

export const generateWritingPrompt = async (): Promise<{ theme: string; supportTexts: {title: string; content: string}[] }> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Gere um tema de redação dissertativo-argumentativo no estilo do vestibulinho ETEC. O tema deve ser relevante e atual para o público jovem. Forneça um tema principal e 2 textos de apoio curtos (cerca de 3-4 frases cada) para contextualizar o aluno.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        theme: { type: Type.STRING, description: "O tema central da redação. Ex: 'O impacto das redes sociais na saúde mental dos jovens'." },
                        supportTexts: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING, description: "Título do texto de apoio (ex: Texto 1, Fonte, etc.)" },
                                    content: { type: Type.STRING, description: "O conteúdo do texto de apoio." }
                                }
                            }
                        }
                    },
                    required: ["theme", "supportTexts"]
                },
            },
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error generating writing prompt:", error);
        throw new Error("Não foi possível gerar um tema de redação. Tente novamente.");
    }
};

export const getWritingFeedback = async (theme: string, essay: string): Promise<{ score: number; feedback: string; strengths: string; weaknesses: string; }> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Você é um corretor de redações para o vestibulinho da ETEC. Analise a seguinte redação com base no tema proposto. Forneça um feedback construtivo, detalhado e encorajador.

            **Tema:** "${theme}"
            **Redação do Aluno:**
            "${essay}"

            Avalie os seguintes critérios:
            1.  **Estrutura Dissertativo-Argumentativa:** Verifique se há introdução, desenvolvimento e conclusão claros.
            2.  **Adequação ao Tema:** Avalie se o aluno se manteve no tema e usou os textos de apoio (se aplicável).
            3.  **Coesão e Coerência:** Analise o uso de conectivos e a organização das ideias.
            4.  **Argumentação:** Verifique a força e a clareza dos argumentos.
            5.  **Norma Culta:** Aponte desvios gramaticais e de vocabulário.

            Seja específico nos pontos a melhorar, dando exemplos.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.INTEGER, description: "Uma nota de 0 a 10 para a redação." },
                        feedback: { type: Type.STRING, description: "Um parágrafo de feedback geral sobre o texto." },
                        strengths: { type: Type.STRING, description: "Uma lista em bullet points (usando '*') dos pontos fortes da redação." },
                        weaknesses: { type: Type.STRING, description: "Uma lista em bullet points (usando '*') dos pontos que precisam de melhoria, com sugestões claras." }
                    },
                    required: ["score", "feedback", "strengths", "weaknesses"]
                },
            },
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error generating writing feedback:", error);
        throw new Error("Não foi possível gerar o feedback para a redação. Tente novamente.");
    }
};