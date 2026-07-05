import Link from "next/link";
import { listDevis } from "@/lib/store";
import { STATUS_LABELS, totalTTC } from "@/lib/types";

export const dynamic = "force-dynamic";

const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

export default function Home() {
  const devis = listDevis();

  return (
    <>
      <h1>Mes devis</h1>
      {devis.length === 0 ? (
        <div className="empty">
          <p>Aucun devis pour l&apos;instant.</p>
          <p>
            <Link href="/devis/nouveau" className="btn btn-primary">
              🎙️ Dicter mon premier devis
            </Link>
          </p>
        </div>
      ) : (
        devis.map((d) => (
          <Link key={d.id} href={`/devis/${d.id}`} className="card">
            <div className="card-row">
              <strong>{d.titre}</strong>
              <span className={`badge badge-${d.status}`}>{STATUS_LABELS[d.status]}</span>
            </div>
            <div className="card-row">
              <span className="muted">
                {d.numero} · {d.client.nom} ·{" "}
                {new Date(d.createdAt).toLocaleDateString("fr-FR")}
              </span>
              <strong>{euro.format(totalTTC(d))} TTC</strong>
            </div>
          </Link>
        ))
      )}
    </>
  );
}
