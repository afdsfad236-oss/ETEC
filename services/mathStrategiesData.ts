export interface MathStrategy {
  title: string;
  description: string;
  exampleImageUrl: string;
}

export const mathStrategiesData: MathStrategy[] = [
  {
    title: 'Teorema de Pitágoras',
    description: 'Técnica: 1) Ache o ângulo de 90°. O lado oposto é a hipotenusa (c). 2) Os outros dois são os catetos (a, b).\nMontagem da conta: a² + b² = c²',
    exampleImageUrl: 'https://picsum.photos/seed/pythagoras_example/800/600',
  },
  {
    title: 'Regra de Três Simples',
    description: 'Técnica: 1) Organize os dados em colunas (ex: Pessoas e Comida). 2) Alinhe os valores que se correspondem.\nMontagem da conta: Multiplique em "X".',
    exampleImageUrl: 'https://picsum.photos/seed/rule_of_three_example/800/600',
  },
  {
    title: 'Cálculo de Porcentagem',
    description: 'Técnica: A palavra "DE" vira multiplicação. "20% DE 80" é 0.20 * 80.\nMontagem da conta (desconto): Valor - (Porcentagem * Valor).',
    exampleImageUrl: 'https://picsum.photos/seed/percentage_example/800/600',
  },
  {
    title: 'Área do Círculo',
    description: 'Técnica: 1) Ache o raio (r). Se o problema der o diâmetro, divida por 2. 2) Use o valor de π que a ETEC mandar (ex: 3 ou 3,14).\nMontagem da conta: Área = π * r²',
    exampleImageUrl: 'https://picsum.photos/seed/circle_area_example/800/600',
  },
];
