import { PageShell } from "../components/layout/PageShell.jsx";

export function LoginPage() {
  return (
    <PageShell eyebrow="Login" title="Accesso utenti predisposto per Supabase.">
      <section className="platform-placeholder-card">
        <p>
          Qui andra il flusso Supabase Auth. Le variabili ambiente sono gia previste in
          `.env.example`, ma il provider non e collegato in questa fase.
        </p>
        <button type="button" disabled>Sign in with Supabase</button>
      </section>
    </PageShell>
  );
}
