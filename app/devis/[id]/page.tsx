import { notFound } from "next/navigation";
import { getDevis } from "@/lib/store";
import { totalHT, totalTTC } from "@/lib/types";
import DevisActions from "./DevisActions";

export const dynamic = "force-dynamic";

const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

export default async function DevisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const devis = getDevis(id);
  if (!devis) notFound();

  return (
    <>
      <div className="card">
        <div className="card-row">
          <h1 style={{ margin: 0 }}>{devis.titre}</h1>
        </div>
        <p className="muted">
          Devis {devis.numero} · {new Date(devis.createdAt).toLocaleDateString("fr-FR")}
        </p>
        <p>
          <strong>{devis.client.nom}</strong>
          {devis.client.adresse && (
            <>
              <br />
              {devis.client.adresse}
            </>
          )}
          {devis.client.telephone && (
            <>
              <br />
              {devis.client.telephone}
            </>
          )}
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
            {devis.lignes.map((l, i) => (
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
          <div>Total HT : {euro.format(totalHT(devis))}</div>
          <div className="muted">TVA {devis.tauxTVA} %</div>
          <div className="ttc">Total TTC : {euro.format(totalTTC(devis))}</div>
        </div>

        {devis.notes && <p className="muted">{devis.notes}</p>}
      </div>

      <DevisActions id={devis.id} status={devis.status} />
    </>
  );
}
