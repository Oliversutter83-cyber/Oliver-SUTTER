"use client";

import { useState } from "react";

export default function LeadForm({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      setState(res.ok ? "ok" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "ok") {
    return (
      <p className="lead-ok" role="status">
        C'est noté — vous recevrez le guide et l'accès prioritaire au lancement.
      </p>
    );
  }

  return (
    <form className="lead-form" onSubmit={submit}>
      <label htmlFor={`lead-${source}`} className="sr-only" style={{ position: "absolute", left: "-9999px" }}>
        Votre adresse email professionnelle
      </label>
      <input
        id={`lead-${source}`}
        type="email"
        placeholder="votre@email.fr"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <button type="submit" className="btn btn-primary" disabled={state === "loading"}>
        {state === "loading" ? "Envoi…" : "Recevoir le guide gratuit"}
      </button>
      {state === "error" && (
        <p className="scan-error" role="alert">
          Email invalide ou erreur d'envoi — réessayez.
        </p>
      )}
    </form>
  );
}
