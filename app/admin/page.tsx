import { AdminDashboard } from "@/components/AdminDashboard";

export const metadata = {
  title: "Painel P1 Legends | P1 Academy",
};

export default function AdminPage() {
  return (
    <section className="admin-race-section">
      <AdminDashboard />
    </section>
  );
}
