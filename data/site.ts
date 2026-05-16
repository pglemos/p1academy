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
    title: "P1 Sprint Series",
    category: "Iniciante e intermediário",
    date: "Sábados alternados",
    status: "Pré-inscrição",
  },
  {
    title: "P1 Pro Heat",
    category: "Graduados",
    date: "Noites de quinta",
    status: "Lista aberta",
  },
  {
    title: "P1 Endurance Lab",
    category: "Equipes",
    date: "Eventos especiais",
    status: "Captação",
  },
  {
    title: "P1 Academy Cup",
    category: "Alunos",
    date: "Mensal",
    status: "Agenda ativa",
  },
];

export const regulations = [
  "Regulamento P1 Sprint Series",
  "Folha de regras P1 Academy Cup",
  "Regulamento P1 Pro Heat",
  "Código de conduta e segurança",
  "Manual de briefing, bandeiras e boxes",
  "Termo de participação",
];

export const sponsors = [
  "Apex Timing",
  "Carbon Track Garage",
  "Grid Wear Racing",
  "Pitlane Studio",
  "Telemetry Co.",
  "Podium Fuel",
];

export const posts = [
  {
    slug: "como-entrar-no-kart-amador",
    title: "Como entrar no kart amador com segurança e ritmo",
    date: "15/05/2026",
    category: "Academy",
    excerpt:
      "O primeiro passo não é acelerar mais cedo. É entender pista, postura, freada, bandeiras e convivência de grid.",
  },
  {
    slug: "preparacao-para-primeiro-campeonato",
    title: "Preparação para o primeiro campeonato P1",
    date: "08/05/2026",
    category: "Competições",
    excerpt:
      "Um guia direto para chegar na etapa sabendo tomada, largada, bandeiras, boxes e disputa limpa.",
  },
  {
    slug: "traçado-e-consistencia",
    title: "Traçado e consistência antes da volta perfeita",
    date: "30/04/2026",
    category: "Técnica",
    excerpt:
      "A volta rápida nasce de repetição, referência visual e controle emocional em cada setor.",
  },
  {
    slug: "bateria-corporativa-premium",
    title: "Bateria corporativa com experiência premium",
    date: "22/04/2026",
    category: "Eventos",
    excerpt:
      "Formato para grupos, empresas e convidados com briefing, ranking, premiação e registro visual.",
  },
];

export const rankings = [
  { name: "Rafael Lima", points: 184, category: "Pro", best: "47.812" },
  { name: "Marina Costa", points: 171, category: "Pro", best: "48.006" },
  { name: "Caio Torres", points: 158, category: "Academy", best: "49.221" },
  { name: "Bianca Alves", points: 146, category: "Academy", best: "49.408" },
  { name: "Theo Martins", points: 132, category: "Rookie", best: "50.114" },
];

export const schedule = [
  { date: "24/05", track: "Betim T7 anti-horário", event: "Academy Performance" },
  { date: "07/06", track: "RBC T1 horário", event: "P1 Sprint Series" },
  { date: "21/06", track: "Betim T9 normal", event: "P1 Academy Cup" },
  { date: "05/07", track: "RBC T4 anti-horário", event: "Pro Heat" },
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
  { track: "Betim T7 anti-horário", driver: "Marina Costa", time: "47.812" },
  { track: "RBC T1 horário", driver: "Rafael Lima", time: "48.004" },
  { track: "Betim T9 normal", driver: "Caio Torres", time: "49.117" },
  { track: "RBC T4 anti-horário", driver: "Bianca Alves", time: "48.771" },
];

export const iconHighlights = [
  { icon: Award, title: "Método", text: "Briefing, pista, análise e evolução registrada." },
  { icon: ClipboardList, title: "Organização", text: "Agenda clara, grupos por nível e comunicação direta." },
  { icon: Newspaper, title: "Conteúdo", text: "Notícias, rankings, fotos, vídeos e materiais para pilotos." },
];
