"use client";

import { useState } from "react";

export default function LeadForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setState(res.ok ? "done" : "error");
  }

  if (state === "done") {
    return (
      <p className="lead-ok">
        ✅ C&apos;est noté ! Vous recevrez le guide de conformité et l&apos;accès à
        l&apos;extension.
      </p>
    );
  }

  return (
    <form className="lead-form" onSubmit={submit}>
      <input
        type="email"
        required
        placeholder="votre@email.fr"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn btn-primary" disabled={state === "busy"}>
        {state === "busy" ? "…" : "Être prêt pour 2026"}
      </button>
      {state === "error" && <span className="muted">Email invalide, réessayez.</span>}
    </form>
  );
}
