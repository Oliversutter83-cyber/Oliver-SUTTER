import { listInvoices } from "@/lib/store";
import { invoiceTotalTTC } from "@/lib/types";
import SimulateOrder from "./SimulateOrder";

export const dynamic = "force-dynamic";

const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

export default function Dashboard() {
  const invoices = listInvoices();
  const totalTTC = invoices.reduce((s, i) => s + invoiceTotalTTC(i.lines), 0);

  return (
    <>
      <h1>Tableau de bord de conformité</h1>

      <div className="stats">
        <div className="stat">
          <div className="value">{invoices.length}</div>
          <div className="label">Factures Factur-X générées</div>
        </div>
        <div className="stat">
          <div className="value">{euro.format(totalTTC)}</div>
          <div className="label">Volume facturé TTC</div>
        </div>
        <div className="stat">
          <div className="value">100 %</div>
          <div className="label">Commandes conformes EN 16931</div>
        </div>
      </div>

      <SimulateOrder />

      {invoices.length === 0 ? (
        <div className="empty">
          <p>Aucune facture pour l&apos;instant.</p>
          <p className="muted">
            Connectez le plugin WooCommerce (voir <code>wp-plugin/</code>) ou simulez une
            commande ci-dessus.
          </p>
        </div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Facture</th>
                <th>Client</th>
                <th className="hide-mobile">Commande</th>
                <th className="num">TTC</th>
                <th>Fichiers</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((i) => (
                <tr key={i.id}>
                  <td>
                    <strong>{i.numero}</strong>
                    <div className="muted">{new Date(i.issuedAt).toLocaleDateString("fr-FR")}</div>
                  </td>
                  <td>{i.buyer.name}</td>
                  <td className="hide-mobile">{i.orderRef}</td>
                  <td className="num">{euro.format(invoiceTotalTTC(i.lines))}</td>
                  <td className="links">
                    <a href={`/api/invoices/${i.id}/pdf`} target="_blank">
                      PDF
                    </a>
                    <a href={`/api/invoices/${i.id}/xml`} target="_blank">
                      XML
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
