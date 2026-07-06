"use client";

import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "sent">("idle");
  const [demoUrl, setDemoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur — réessayez.");
        setState("idle");
        return;
      }
      setDemoUrl(data.demoUrl ?? null);
      setState("sent");
    } catch {
      setError("Erreur — réessayez.");
      setState("idle");
    }
  }

  if (state === "sent") {
    return (
      <div aria-live="polite">
        <p className="lead-ok" style={{ color: "var(--accent)" }}>
          Si un compte existe pour cet email, un lien de connexion vient d'être envoyé. Pensez à
          vérifier vos indésirables.
        </p>
        {demoUrl && (
          <p>
            <em>Mode démonstration (email non configuré) :</em>{" "}
            <a href={demoUrl} className="btn btn-primary btn-sm">
              Ouvrir mon tableau de bord
            </a>
          </p>
        )}
      </div>
    );
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>
        Email de votre compte
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="votre@email.fr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      {error && (
        <p className="scan-error" role="alert">
          {error}
        </p>
      )}
      <div>
        <button type="submit" className="btn btn-primary" disabled={state === "loading"}>
          {state === "loading" ? "Envoi…" : "Recevoir mon lien de connexion"}
        </button>
      </div>
    </form>
  );
}
