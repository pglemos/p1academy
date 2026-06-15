import { AdminLoginForm } from "@/components/AdminLoginForm";
import { PageHero } from "@/components/PageHero";

export const metadata = {
  title: "Admin P1 Academy",
};

export default function AdminLoginPage() {
  return (
    <>
      <PageHero
        compact
        title="Admin P1"
        text="Acesso operacional para inscrições, pilotos, etapas e resultados da Legends Kart Series."
        image="/images/timing-telemetry.png"
      />
      <section className="section tight">
        <div className="container admin-login-shell">
          <AdminLoginForm />
        </div>
      </section>
    </>
  );
}
