import { AdminDashboard } from "@/components/AdminDashboard";
import { PageHero } from "@/components/PageHero";

export const metadata = {
  title: "Painel P1 Legends | P1 Academy",
};

export default function AdminPage() {
  return (
    <>
      <PageHero
        compact
        title="Operação Legends"
        text="Painel administrativo para inscrições, pilotos, calendário, baterias, resultados e ranking."
        image="/images/competition-corner.png"
      />
      <section className="section tight carbon-section">
        <div className="container">
          <AdminDashboard />
        </div>
      </section>
    </>
  );
}
