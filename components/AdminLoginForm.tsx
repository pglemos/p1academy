"use client";

import { FormEvent, useState } from "react";
import { LogIn } from "lucide-react";
import { getBrowserSupabaseClient } from "@/lib/p1BrowserSupabase";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = getBrowserSupabaseClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("E-mail ou senha invalidos.");
        return;
      }

      window.location.assign("/admin");
    } catch {
      setError("Supabase Auth nao esta configurado no navegador.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="admin-login-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>E-mail</span>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
      </label>
      <label className="field">
        <span>Senha</span>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
      </label>
      {error ? <p className="error">{error}</p> : null}
      <button className="btn primary" type="submit" disabled={loading}>
        <LogIn size={18} /> {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
