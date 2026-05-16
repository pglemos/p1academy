export type TrackLayout = {
  id: string;
  number: string;
  title: string;
  variant: "Normal" | "Invertido" | "Invertido com chicane";
  distance: number;
  image: string;
};

export const trackLayouts: TrackLayout[] = [
  { id: "tracado-01-normal", number: "01", title: "Traçado 1 normal", variant: "Normal", distance: 1110, image: "/images/tracados/tracado-01-normal.jpg" },
  { id: "tracado-01-invertido", number: "01", title: "Traçado 1 invertido", variant: "Invertido", distance: 1110, image: "/images/tracados/tracado-01-invertido.jpg" },
  { id: "tracado-01-invertido-chicane", number: "01", title: "Traçado 1 invertido com chicane", variant: "Invertido com chicane", distance: 1117, image: "/images/tracados/tracado-01-invertido-chicane.jpg" },
  { id: "tracado-02-normal", number: "02", title: "Traçado 2 normal", variant: "Normal", distance: 871, image: "/images/tracados/tracado-02-normal.jpg" },
  { id: "tracado-02-invertido", number: "02", title: "Traçado 2 invertido", variant: "Invertido", distance: 871, image: "/images/tracados/tracado-02-invertido.jpg" },
  { id: "tracado-02-invertido-chicane", number: "02", title: "Traçado 2 invertido com chicane", variant: "Invertido com chicane", distance: 878, image: "/images/tracados/tracado-02-invertido-chicane.jpg" },
  { id: "tracado-03-normal", number: "03", title: "Traçado 3 normal", variant: "Normal", distance: 497, image: "/images/tracados/tracado-03-normal.jpg" },
  { id: "tracado-03-invertido", number: "03", title: "Traçado 3 invertido", variant: "Invertido", distance: 497, image: "/images/tracados/tracado-03-invertido.jpg" },
  { id: "tracado-03-invertido-chicane", number: "03", title: "Traçado 3 invertido com chicane", variant: "Invertido com chicane", distance: 504, image: "/images/tracados/tracado-03-invertido-chicane.jpg" },
  { id: "tracado-04-normal", number: "04", title: "Traçado 4 normal", variant: "Normal", distance: 553, image: "/images/tracados/tracado-04-normal.jpg" },
  { id: "tracado-04-invertido", number: "04", title: "Traçado 4 invertido", variant: "Invertido", distance: 553, image: "/images/tracados/tracado-04-invertido.jpg" },
  { id: "tracado-04-invertido-chicane", number: "04", title: "Traçado 4 invertido com chicane", variant: "Invertido com chicane", distance: 560, image: "/images/tracados/tracado-04-invertido-chicane.jpg" },
  { id: "tracado-05-normal", number: "05", title: "Traçado 5 normal", variant: "Normal", distance: 832, image: "/images/tracados/tracado-05-normal.jpg" },
  { id: "tracado-05-invertido", number: "05", title: "Traçado 5 invertido", variant: "Invertido", distance: 832, image: "/images/tracados/tracado-05-invertido.jpg" },
  { id: "tracado-05-invertido-chicane", number: "05", title: "Traçado 5 invertido com chicane", variant: "Invertido com chicane", distance: 839, image: "/images/tracados/tracado-05-invertido-chicane.jpg" },
  { id: "tracado-06-normal", number: "06", title: "Traçado 6 normal", variant: "Normal", distance: 737, image: "/images/tracados/tracado-06-normal.jpg" },
  { id: "tracado-06-invertido", number: "06", title: "Traçado 6 invertido", variant: "Invertido", distance: 737, image: "/images/tracados/tracado-06-invertido.jpg" },
  { id: "tracado-06-invertido-chicane", number: "06", title: "Traçado 6 invertido com chicane", variant: "Invertido com chicane", distance: 744, image: "/images/tracados/tracado-06-invertido-chicane.jpg" },
  { id: "tracado-09-normal", number: "09", title: "Traçado 9 normal", variant: "Normal", distance: 793, image: "/images/tracados/tracado-09-normal.jpg" },
  { id: "tracado-09-invertido", number: "09", title: "Traçado 9 invertido", variant: "Invertido", distance: 793, image: "/images/tracados/tracado-09-invertido.jpg" },
  { id: "tracado-09-invertido-chicane", number: "09", title: "Traçado 9 invertido com chicane", variant: "Invertido com chicane", distance: 800, image: "/images/tracados/tracado-09-invertido-chicane.jpg" },
  { id: "tracado-10-normal", number: "10", title: "Traçado 10 normal", variant: "Normal", distance: 593, image: "/images/tracados/tracado-10-normal.jpg" },
  { id: "tracado-10-invertido", number: "10", title: "Traçado 10 invertido", variant: "Invertido", distance: 593, image: "/images/tracados/tracado-10-invertido.jpg" },
  { id: "tracado-10-invertido-chicane", number: "10", title: "Traçado 10 invertido com chicane", variant: "Invertido com chicane", distance: 600, image: "/images/tracados/tracado-10-invertido-chicane.jpg" },
  { id: "tracado-11-normal", number: "11", title: "Traçado 11 normal", variant: "Normal", distance: 954, image: "/images/tracados/tracado-11-normal.jpg" },
  { id: "tracado-11-invertido", number: "11", title: "Traçado 11 invertido", variant: "Invertido", distance: 954, image: "/images/tracados/tracado-11-invertido.jpg" },
  { id: "tracado-11-invertido-chicane", number: "11", title: "Traçado 11 invertido com chicane", variant: "Invertido com chicane", distance: 961, image: "/images/tracados/tracado-11-invertido-chicane.jpg" },
  { id: "tracado-12-normal", number: "12", title: "Traçado 12 normal", variant: "Normal", distance: 715, image: "/images/tracados/tracado-12-normal.jpg" },
  { id: "tracado-12-invertido", number: "12", title: "Traçado 12 invertido", variant: "Invertido", distance: 715, image: "/images/tracados/tracado-12-invertido.jpg" },
  { id: "tracado-12-invertido-chicane", number: "12", title: "Traçado 12 invertido com chicane", variant: "Invertido com chicane", distance: 722, image: "/images/tracados/tracado-12-invertido-chicane.jpg" },
];

export const trackLayoutStats = [
  { value: `${trackLayouts.length}`, label: "mapas publicados" },
  { value: `${new Set(trackLayouts.map((layout) => layout.number)).size}`, label: "bases de pista" },
  { value: `${Math.max(...trackLayouts.map((layout) => layout.distance)).toLocaleString("pt-BR")} m`, label: "maior volta" },
  { value: `${Math.min(...trackLayouts.map((layout) => layout.distance)).toLocaleString("pt-BR")} m`, label: "menor volta" },
];

export const trackGuide = [
  {
    title: "Sentido normal",
    text: "Configuração usada no sentido principal do mapa, com referência de seta no próprio desenho oficial.",
  },
  {
    title: "Sentido invertido",
    text: "Mesma base de pista no sentido oposto, mudando pontos de freada, zebras de ataque e velocidade de saída.",
  },
  {
    title: "Chicane",
    text: "Variação com trecho técnico extra para reduzir velocidade e exigir mais precisão na tomada de curva.",
  },
  {
    title: "Distância",
    text: "Cada card mostra a metragem indicada no mapa para comparar ritmo, duração de volta e preparação de briefing.",
  },
];
