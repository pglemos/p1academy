import {
  Award,
  CalendarDays,
  ClipboardList,
  Flag,
  Gauge,
  Handshake,
  Medal,
  Newspaper,
  ShieldCheck,
  Sparkles,
  Trophy,
  Video,
} from "lucide-react";
export { latestPosts, posts } from "./news";

export const whatsappNumber = "5521995960077";
export const whatsappDisplay = "+55 21 99596-0077";
export const contactName = "André Felisberto";
export const trackAddress = "Avenida Adutora Várzea das Flores, 477 - Itacolomi, Betim - MG, 32672-586";
export const mapUrl = "https://maps.app.goo.gl/vnUKS8m9QsewWCVo6";

export const navItems = [
  { href: "/sobre", label: "Sobre" },
  { href: "/competicoes", label: "Competições" },
  { href: "/regulamentos", label: "Regulamentos" },
  { href: "/patrocinadores", label: "Patrocinadores" },
  { href: "/noticias", label: "Notícias" },
  { href: "/wallpapers", label: "Wallpapers" },
  { href: "/contato", label: "Contato" },
];

export const quickAccess = [
  {
    href: "/ranking",
    title: "Ranking de pilotos",
    text: "Classificação por presença, tomada, melhor volta, consistência e conduta de pista.",
    icon: Trophy,
    label: "Grid competitivo",
    image: "/images/competition-corner.png",
  },
  {
    href: "/calendario-tracados",
    title: "Calendário e traçados",
    text: "Temporada organizada por datas, pistas, sentido, zebras, setores e briefing técnico.",
    icon: CalendarDays,
    label: "Agenda da pista",
    image: "/images/wallpaper-kart-dawn.png",
  },
  {
    href: "/dicas",
    title: "Dicas de pilotagem",
    text: "Conteúdo objetivo para freada, tangência, tomada, ultrapassagem e segurança.",
    icon: ShieldCheck,
    label: "Técnica aplicada",
    image: "/images/academy-coaching.png",
  },
  {
    href: "/videos",
    title: "Vídeos onboard",
    text: "Biblioteca de onboard, voltas lançadas, referências visuais e estudo de traçado.",
    icon: Video,
    label: "Análise visual",
    image: "/images/hero-kart-night.png",
  },
  {
    href: "/recordes",
    title: "Recordes dos traçados",
    text: "Melhores tempos, categorias e evolução por configuração de pista e sentido.",
    icon: Gauge,
    label: "Tempo alvo",
    image: "/images/timing-telemetry.png",
  },
  {
    href: "/aulas",
    title: "P1 Academy",
    text: "Aulas de kart para rookies, intermediários e pilotos que querem ritmo de campeonato.",
    icon: Sparkles,
    label: "Formação de pilotos",
    image: "/images/academy-coaching.png",
  },
];

export const programs = [
  {
    title: "Primeira bateria",
    text: "Entrada segura para sentir o kart, entender bandeiras, posição de pilotagem e sair com técnica real.",
    label: "Rookie briefing",
  },
  {
    title: "Academy performance",
    text: "Treino estruturado para baixar tempo, ganhar leitura de curva e controlar pressão de disputa.",
    label: "Volta lançada",
  },
  {
    title: "Preparação para campeonatos",
    text: "Simulações de largada, classificação, defesa, ataque, estratégia e briefing pré-etapa.",
    label: "Racecraft",
  },
];

export const competitions = [
  {
    title: "Legends Kart Series",
    category: "Categoria única",
    date: "1º semestre de 2026",
    status: "Em breve",
  },
];

export const regulations = [
  "Regulamento Legends Kart Series - Versão 3.0",
];

export const rankings = [
  { name: "Aguardando primeira bateria", points: 0, category: "A definir", best: "-" },
];

export const schedule = [
  { date: "Em breve", track: "Kartódromo Internacional de Betim", event: "Legends Kart Series" },
];

export const tips = [
  {
    icon: Flag,
    title: "Olhe longe",
    text: "Antecipe ponto de freada, ápice e saída antes de chegar na curva.",
  },
  {
    icon: Gauge,
    title: "Freie em linha",
    text: "Reduza o excesso de volante na frenagem para manter estabilidade.",
  },
  {
    icon: Medal,
    title: "Repita a referência",
    text: "Consistência vem de repetir marcações antes de buscar agressividade.",
  },
  {
    icon: Handshake,
    title: "Dispute limpo",
    text: "Deixe espaço, leia o adversário e construa ultrapassagens sustentáveis.",
  },
];

export const recordes = [
  { track: "Legends Kart Series", driver: "Aguardando primeira bateria", time: "-" },
];

export const iconHighlights = [
  { icon: Award, title: "Método", text: "Briefing, pista, análise e evolução registrada." },
  { icon: ClipboardList, title: "Organização", text: "Agenda clara, grupos por nível e comunicação direta." },
  { icon: Newspaper, title: "Conteúdo", text: "Notícias, rankings, fotos, vídeos e materiais para pilotos." },
];
