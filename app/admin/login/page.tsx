import { AdminLoginForm } from "@/components/AdminLoginForm";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "Admin P1 Academy",
};

export default function AdminLoginPage() {
  return (
    <section className="admin-login-screen">
      <div className="admin-login-brand">
        <Logo />
        <span>ADMIN</span>
      </div>
      <div className="admin-login-stage">
        <div>
          <span className="admin-eyebrow">P1 Academy Legends Kart Series</span>
          <h1>Race Control</h1>
          <p>Acesso operacional para inscrições, pilotos, etapas, baterias e ranking oficial.</p>
        </div>
        <div className="admin-login-shell">
          <strong>Entrar no admin</strong>
          <AdminLoginForm />
        </div>
      </div>
    </section>
  );
}
