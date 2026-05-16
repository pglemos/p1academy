import { sponsors } from "./site";

export const legendsPdf = "/regulamentos/regulamento-legends-kart-series-2026.pdf";

export const legendsCompetition = {
  name: "Legends Kart Series",
  edition: "1ª Edição Oficial",
  season: "2026",
  version: "Regulamento Geral - Versão 3.0",
  versionDate: "16/05/2026",
  status: "Em breve",
  venue: "Kartódromo Internacional de Betim",
  address: "Av. Adutora Várzea das Flores, 477 - Itacolomi, Betim - MG, 32672-586",
  organizer: "André Felisberto",
  whatsapp: "(21) 99596-0077",
  whatsappNumber: "5521995960077",
  kartFleet: "Karts de locação da frota Super Karts, fornecidos pelo kartódromo e definidos por sorteio.",
  format: "Rental kart, categoria única, tomada de tempo",
  ballast: "100 kg",
  heatDuration: "20 minutos",
  superFinalDuration: "10 minutos",
  seats: "22 pilotos por bateria",
  validResults: "10 melhores corridas válidas",
  expectedStages: "40 etapas previstas no 1º semestre de 2026",
};

export const legendsStats = [
  { value: "1ª", label: "edição oficial" },
  { value: "100 KG", label: "lastro-base" },
  { value: "20 MIN", label: "tomada de tempo" },
  { value: "22", label: "vagas previstas" },
  { value: "10", label: "resultados válidos" },
  { value: "BETIM", label: "sede única" },
];

export const legendsSections = [
  { href: "#classificacao", label: "Classificação" },
  { href: "#resultados", label: "Resultados" },
  { href: "#etapas", label: "Etapas" },
  { href: "#regulamento", label: "Regulamento" },
  { href: "#niveis", label: "Níveis" },
  { href: "#conquistas", label: "Conquistas" },
  { href: "#fotos", label: "Fotos" },
  { href: "#patrocinadores", label: "Patrocinadores" },
];

export const legendsSummary = [
  {
    title: "Formato semestral e flexível",
    text: "Campeonato e grupo de treinos com baterias avulsas. O piloto participa das corridas que quiser, conforme disponibilidade de vaga e aceite da organização.",
  },
  {
    title: "Contra o relógio",
    text: "Cada corrida é uma bateria de 20 minutos de tomada de tempo. Vence a bateria o piloto que registrar a melhor volta.",
  },
  {
    title: "Pontuação por diferença",
    text: "O vencedor soma 10,000 pontos. Os demais pontuam conforme a diferença de tempo em relação à melhor volta da bateria.",
  },
  {
    title: "Super Final",
    text: "Na última etapa, os melhores pilotos do dia se classificam para uma bateria extra de 10 minutos com pontuação adicional.",
  },
];

export const legendsStory = [
  "A Legends Kart Series nasce em 2026 como a primeira edição oficial de um campeonato criado para unir competição, treino, evolução técnica e experiência esportiva em um ambiente organizado e competitivo.",
  "O projeto foi pensado para receber pilotos que já participam de campeonatos e também pilotos que querem se manter em atividade, evoluir na pilotagem e disputar baterias avulsas sem obrigação de participar de todas as etapas.",
  "A competição acontece exclusivamente no Kartódromo Internacional de Betim, consolidando uma sede única para padronizar pista, operação, briefing, organização das baterias e acompanhamento dos resultados.",
  "A proposta é simples e forte: cada bateria importa. O piloto entra na pista contra o relógio, busca sua melhor volta e transforma seu desempenho em pontuação para a classificação geral.",
];

export const legendsCurrentEdition = [
  ["Edição atual", legendsCompetition.edition],
  ["Temporada", legendsCompetition.season],
  ["Sede", legendsCompetition.venue],
  ["Organizador geral", legendsCompetition.organizer],
  ["WhatsApp", legendsCompetition.whatsapp],
  ["Formato", legendsCompetition.format],
  ["Lastro-base", legendsCompetition.ballast],
  ["Duração da bateria", legendsCompetition.heatDuration],
  ["Vagas previstas", legendsCompetition.seats],
];

export const legendsLevels = [
  { level: "X", criteria: "3 ou mais vitórias neste semestre." },
  { level: "A1", criteria: "2 ou mais vitórias ao todo." },
  { level: "A2", criteria: "1 vitória e 3 ou mais pódios ao todo." },
  { level: "A3", criteria: "1 vitória e até 2 pódios ao todo." },
  { level: "B1", criteria: "4 ou mais pódios ao todo." },
  { level: "B2", criteria: "2 ou 3 pódios ao todo." },
  { level: "B3", criteria: "1 pódio ao todo." },
  { level: "C1", criteria: "Tempo a menos de 1 segundo do vencedor 3 ou mais vezes." },
  { level: "C2", criteria: "Tempo a menos de 1 segundo do vencedor 1 ou 2 vezes." },
  { level: "C3", criteria: "Ainda não fez tempo a menos de 1 segundo do vencedor." },
  { level: "C4", criteria: "Ainda não fez tempo a menos de 1 segundo do vencedor e está há mais de 2 semestres sem participar." },
];

export const legendsAchievements = [
  { title: "Volta Lendária", text: "Faça uma volta a menos de 1 segundo do melhor tempo da bateria." },
  { title: "Ritmo Forte", text: "Mantenha tempos competitivos em mais de uma bateria consecutiva." },
  { title: "Mestre da Pista Molhada", text: "Conquiste destaque ou pódio em condição de pista molhada." },
  { title: "Caçador de Décimos", text: "Melhore seu próprio tempo em baterias consecutivas." },
  { title: "Primeiro Pódio", text: "Conquiste seu primeiro resultado entre os melhores da bateria." },
  { title: "Piloto da Semana", text: "Tenha o melhor desempenho geral da semana." },
  { title: "Piloto Constante", text: "Some bons resultados sem grandes oscilações de desempenho." },
  { title: "Revelação da Temporada", text: "Destaque para piloto estreante ou em evolução acelerada." },
  { title: "Classificado para a Super Final", text: "Entre entre os melhores pilotos da última etapa e conquiste vaga na bateria extra." },
  { title: "Lenda da Temporada", text: "Finalize entre os melhores da classificação geral." },
];

export const legendsRankingPreview = [
  { position: "01", driver: "Aguardando primeira bateria", level: "A definir", points: "-", valid: "0/10" },
  { position: "02", driver: "Aguardando primeira bateria", level: "A definir", points: "-", valid: "0/10" },
  { position: "03", driver: "Aguardando primeira bateria", level: "A definir", points: "-", valid: "0/10" },
  { position: "04", driver: "Aguardando primeira bateria", level: "A definir", points: "-", valid: "0/10" },
];

export const legendsResultsPreview = [
  { heat: "Bateria 01", date: "Em breve", winner: "A definir", bestLap: "-", points: "10,000" },
  { heat: "Bateria 02", date: "Em breve", winner: "A definir", bestLap: "-", points: "10,000" },
  { heat: "Super Final", date: "Última etapa", winner: "A definir", bestLap: "-", points: "5,000" },
];

export const legendsStageInfo = [
  { label: "Calendário oficial", value: "Será publicado nos canais oficiais antes do início da competição." },
  { label: "Briefing", value: "Obrigatório antes das corridas. Decisões de briefing prevalecem sobre necessidades operacionais." },
  { label: "Pagamento", value: "Cada piloto paga apenas o valor das corridas no dia da etapa, salvo datas especiais." },
  { label: "Termo", value: "Todos os pilotos devem assinar termo de responsabilidade na recepção do kartódromo." },
  { label: "Clima", value: "Etapas previstas sob qualquer condição climática, salvo decisão operacional da organização." },
];

export const legendsPhotoSets = [
  { title: "Etapas", image: "/images/competition-corner.png", text: "Galeria oficial de baterias e melhores momentos da temporada." },
  { title: "Bastidores", image: "/images/academy-coaching.png", text: "Briefings, boxes, preparação, pilotos e organização." },
  { title: "Pódios", image: "/images/wallpaper-kart-dawn.png", text: "Premiações, troféus e confraternização de encerramento." },
];

export const legendsSponsors = sponsors;
