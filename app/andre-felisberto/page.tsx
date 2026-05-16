import type { Metadata } from "next";
import { AndreFelisbertoShowcase } from "@/components/AndreFelisbertoShowcase";

export const metadata: Metadata = {
  title: "André Felisberto | P1 Academy",
  description:
    "Biografia, trajetória, campeonatos, conquistas e experiências públicas do piloto de kart rental André Felisberto.",
};

export default function AndreFelisbertoPage() {
  return <AndreFelisbertoShowcase />;
}
