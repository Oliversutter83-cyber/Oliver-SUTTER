"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { LigneDevis } from "@/lib/types";

interface DevisGenere {
  titre: string;
  client: { nom: string; telephone: string | null; adresse: string | null };
  lignes: LigneDevis[];
  tauxTVA: number;
  notes: string | null;
}

const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

export default function NouveauDevis() {
  const router = useRouter();
  const [transcript, setTranscript] = useState("");
  const [recording, setRecording] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<DevisGenere | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setMicSupported(Boolean(SR));
  }, []);

  function toggleMic() {
    if (recording) {
      recognitionRef.current?.stop();
      setRecording(false);
      return;
    }
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "fr-FR";
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (event: any) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript((prev) => (prev ? prev + " " : "") + text.trim());
    };
    rec.onend = () => setRecording(false);
    rec.onerror = () => setRecording(false);
    recognitionRef.current = rec;
    rec.start();
    setRecording(true);
  }

  async function generer() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur de génération.");
      setDraft(data as DevisGenere);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de génération.");
    } finally {
      setLoading(false);
    }
  }

  async function enregistrer() {
    if (!draft) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, transcript }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur d'enregistrement.");
      router.push(`/devis/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur d'enregistrement.");
      setSaving(false);
    }
  }

  const totalHT = draft
    ? draft.lignes.reduce((s, l) => s + l.quantite * l.prixUnitaireHT, 0)
    : 0;

  return (
    <>
      <h1>Nouveau devis</h1>

      {!draft && (
        <div className="card">
          {micSupported && (
            <button
              type="button"
              className={`btn btn-primary btn-mic ${recording ? "recording" : ""}`}
              onClick={toggleMic}
            >
              {recording ? "⏹️ Arrêter la dictée" : "🎙️ Dicter mon chantier"}
            </button>
          )}
          <p className="muted" style={{ marginTop: "0.75rem" }}>
            Décrivez le chantier comme vous le raconteriez : client, travaux, matériel,
            temps estimé, prix si vous les connaissez.
          </p>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Ex : Remplacement d'un chauffe-eau 200 litres chez Madame Martin, 12 rue des Lilas. Accès difficile au sous-sol, comptez 3 heures de main d'œuvre plus la fourniture du ballon."
          />
          <div className="actions">
            <button
              className="btn btn-primary"
              onClick={generer}
              disabled={loading || !transcript.trim()}
            >
              {loading ? "Génération en cours…" : "✨ Générer le devis"}
            </button>
          </div>
        </div>
      )}

      {error && <div className="error">{error}</div>}

      {draft && (
        <div className="card">
          <h2 style={{ marginTop: 0 }}>{draft.titre}</h2>
          <p className="muted">
            {draft.client.nom}
            {draft.client.adresse ? ` · ${draft.client.adresse}` : ""}
            {draft.client.telephone ? ` · ${draft.client.telephone}` : ""}
          </p>
          <table>
            <thead>
              <tr>
                <th>Désignation</th>
                <th className="num">Qté</th>
                <th className="num">PU HT</th>
                <th className="num">Total HT</th>
              </tr>
            </thead>
            <tbody>
              {draft.lignes.map((l, i) => (
                <tr key={i}>
                  <td>{l.designation}</td>
                  <td className="num">
                    {l.quantite} {l.unite}
                  </td>
                  <td className="num">{euro.format(l.prixUnitaireHT)}</td>
                  <td className="num">{euro.format(l.quantite * l.prixUnitaireHT)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="totals">
            <div>Total HT : {euro.format(totalHT)}</div>
            <div className="muted">TVA {draft.tauxTVA} %</div>
            <div className="ttc">
              Total TTC : {euro.format(totalHT * (1 + draft.tauxTVA / 100))}
            </div>
          </div>
          {draft.notes && <p className="muted">{draft.notes}</p>}
          <div className="actions">
            <button className="btn btn-primary" onClick={enregistrer} disabled={saving}>
              {saving ? "Enregistrement…" : "💾 Enregistrer le devis"}
            </button>
            <button className="btn" onClick={() => setDraft(null)} disabled={saving}>
              ← Modifier la dictée
            </button>
          </div>
        </div>
      )}
    </>
  );
}
