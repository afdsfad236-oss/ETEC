// FIX: Ensured file extensions are present in import paths.
import { FocusTopic } from '../types.ts';
import { BookOpenIcon, CalculatorIcon, BeakerIcon } from '../components/icons.tsx';

export const focusSubjectsData: FocusTopic[] = [
  {
    subject: 'Português',
    icon: BookOpenIcon,
    topics: [
      'Interpretação de textos (charges, tirinhas, notícias, crônicas)',
      'Figuras de linguagem (metáfora, ironia, hipérbole)',
      'Variação linguística (norma culta e coloquial)',
      'Concordância verbal e nominal',
      'Funções da linguagem (referencial, emotiva, apelativa)',
    ],
  },
  {
    subject: 'Matemática',
    icon: CalculatorIcon,
    topics: [
      'Porcentagem e juros simples',
      'Regra de três simples e composta',
      'Cálculo de áreas (quadrado, retângulo, triângulo, círculo)',
      'Teorema de Pitágoras',
      'Leitura e interpretação de gráficos e tabelas',
      'Equações de 1º e 2º grau',
    ],
  },
  {
    subject: 'Ciências Humanas (História e Geografia)',
    icon: BookOpenIcon,
    topics: [
        'História do Brasil (Era Vargas, Ditadura Militar, Redemocratização)',
        'Geografia do Brasil (Climas, Relevo, Biomas, Urbanização)',
        'Atualidades (Globalização, Meio Ambiente, Fontes de Energia)',
        'História Geral (Guerra Fria, Grandes Navegações)',
    ],
  },
  {
    subject: 'Ciências da Natureza (Biologia, Física, Química)',
    icon: BeakerIcon,
    topics: [
        'Ecologia (cadeias alimentares, ecossistemas, problemas ambientais)',
        'Citologia (célula animal e vegetal)',
        'Leis de Newton e conceitos de cinemática (velocidade, aceleração)',
        'Conceitos básicos de Química (misturas, estados da matéria, reações)',
    ],
  },
];
