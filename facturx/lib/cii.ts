// Génération du XML Factur-X (syntaxe UN/CEFACT CII, profil BASIC,
// conforme à la structure EN 16931). C'est le cœur de la valeur du produit.
//
// ⚠️ MVP : la structure suit le profil BASIC de Factur-X 1.0 ; avant mise en
// production, valider la sortie contre le schéma XSD officiel et les règles
// Schematron publiées par le FNFE-MPE.
import { SELLER } from "./config";
import {
  Invoice,
  invoiceTotalHT,
  invoiceTotalTTC,
  invoiceTotalTVA,
  lineTotalHT,
  vatBreakdown,
} from "./types";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function amt(n: number): string {
  return n.toFixed(2);
}

function dateCII(iso: string): string {
  return iso.slice(0, 10).replace(/-/g, ""); // format 102 : AAAAMMJJ
}

export function buildFacturXXml(invoice: Invoice): string {
  const lines = invoice.lines
    .map(
      (l, i) => `
    <ram:IncludedSupplyChainTradeLineItem>
      <ram:AssociatedDocumentLineDocument>
        <ram:LineID>${i + 1}</ram:LineID>
      </ram:AssociatedDocumentLineDocument>
      <ram:SpecifiedTradeProduct>
        <ram:Name>${esc(l.name)}</ram:Name>
      </ram:SpecifiedTradeProduct>
      <ram:SpecifiedLineTradeAgreement>
        <ram:NetPriceProductTradePrice>
          <ram:ChargeAmount>${amt(l.unitPriceHT)}</ram:ChargeAmount>
        </ram:NetPriceProductTradePrice>
      </ram:SpecifiedLineTradeAgreement>
      <ram:SpecifiedLineTradeDelivery>
        <ram:BilledQuantity unitCode="C62">${l.quantity}</ram:BilledQuantity>
      </ram:SpecifiedLineTradeDelivery>
      <ram:SpecifiedLineTradeSettlement>
        <ram:ApplicableTradeTax>
          <ram:TypeCode>VAT</ram:TypeCode>
          <ram:CategoryCode>S</ram:CategoryCode>
          <ram:RateApplicablePercent>${amt(l.vatRate)}</ram:RateApplicablePercent>
        </ram:ApplicableTradeTax>
        <ram:SpecifiedTradeSettlementLineMonetarySummation>
          <ram:LineTotalAmount>${amt(lineTotalHT(l))}</ram:LineTotalAmount>
        </ram:SpecifiedTradeSettlementLineMonetarySummation>
      </ram:SpecifiedLineTradeSettlement>
    </ram:IncludedSupplyChainTradeLineItem>`
    )
    .join("");

  const taxes = vatBreakdown(invoice.lines)
    .map(
      (b) => `
      <ram:ApplicableTradeTax>
        <ram:CalculatedAmount>${amt(b.vat)}</ram:CalculatedAmount>
        <ram:TypeCode>VAT</ram:TypeCode>
        <ram:BasisAmount>${amt(b.baseHT)}</ram:BasisAmount>
        <ram:CategoryCode>S</ram:CategoryCode>
        <ram:RateApplicablePercent>${amt(b.rate)}</ram:RateApplicablePercent>
      </ram:ApplicableTradeTax>`
    )
    .join("");

  const totalHT = invoiceTotalHT(invoice.lines);
  const totalTVA = invoiceTotalTVA(invoice.lines);
  const totalTTC = invoiceTotalTTC(invoice.lines);

  return `<?xml version="1.0" encoding="UTF-8"?>
<rsm:CrossIndustryInvoice
  xmlns:rsm="urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100"
  xmlns:ram="urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100"
  xmlns:udt="urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100">
  <rsm:ExchangedDocumentContext>
    <ram:GuidelineSpecifiedDocumentContextParameter>
      <ram:ID>urn:cen.eu:en16931:2017#compliant#urn:factur-x.eu:1p0:basic</ram:ID>
    </ram:GuidelineSpecifiedDocumentContextParameter>
  </rsm:ExchangedDocumentContext>
  <rsm:ExchangedDocument>
    <ram:ID>${esc(invoice.numero)}</ram:ID>
    <ram:TypeCode>380</ram:TypeCode>
    <ram:IssueDateTime>
      <udt:DateTimeString format="102">${dateCII(invoice.issuedAt)}</udt:DateTimeString>
    </ram:IssueDateTime>
  </rsm:ExchangedDocument>
  <rsm:SupplyChainTradeTransaction>${lines}
    <ram:ApplicableHeaderTradeAgreement>
      <ram:BuyerReference>${esc(invoice.orderRef)}</ram:BuyerReference>
      <ram:SellerTradeParty>
        <ram:Name>${esc(SELLER.name)}</ram:Name>
        <ram:SpecifiedLegalOrganization>
          <ram:ID schemeID="0002">${esc(SELLER.siren)}</ram:ID>
        </ram:SpecifiedLegalOrganization>
        <ram:PostalTradeAddress>
          <ram:LineOne>${esc(SELLER.address)}</ram:LineOne>
          <ram:CountryID>FR</ram:CountryID>
        </ram:PostalTradeAddress>
        <ram:SpecifiedTaxRegistration>
          <ram:ID schemeID="VA">${esc(SELLER.vatNumber)}</ram:ID>
        </ram:SpecifiedTaxRegistration>
      </ram:SellerTradeParty>
      <ram:BuyerTradeParty>
        <ram:Name>${esc(invoice.buyer.name)}</ram:Name>${
          invoice.buyer.siren
            ? `
        <ram:SpecifiedLegalOrganization>
          <ram:ID schemeID="0002">${esc(invoice.buyer.siren)}</ram:ID>
        </ram:SpecifiedLegalOrganization>`
            : ""
        }${
          invoice.buyer.address
            ? `
        <ram:PostalTradeAddress>
          <ram:LineOne>${esc(invoice.buyer.address)}</ram:LineOne>
          <ram:CountryID>FR</ram:CountryID>
        </ram:PostalTradeAddress>`
            : ""
        }${
          invoice.buyer.vatNumber
            ? `
        <ram:SpecifiedTaxRegistration>
          <ram:ID schemeID="VA">${esc(invoice.buyer.vatNumber)}</ram:ID>
        </ram:SpecifiedTaxRegistration>`
            : ""
        }
      </ram:BuyerTradeParty>
    </ram:ApplicableHeaderTradeAgreement>
    <ram:ApplicableHeaderTradeDelivery/>
    <ram:ApplicableHeaderTradeSettlement>
      <ram:InvoiceCurrencyCode>EUR</ram:InvoiceCurrencyCode>${taxes}
      <ram:SpecifiedTradeSettlementHeaderMonetarySummation>
        <ram:LineTotalAmount>${amt(totalHT)}</ram:LineTotalAmount>
        <ram:TaxBasisTotalAmount>${amt(totalHT)}</ram:TaxBasisTotalAmount>
        <ram:TaxTotalAmount currencyID="EUR">${amt(totalTVA)}</ram:TaxTotalAmount>
        <ram:GrandTotalAmount>${amt(totalTTC)}</ram:GrandTotalAmount>
        <ram:DuePayableAmount>${amt(totalTTC)}</ram:DuePayableAmount>
      </ram:SpecifiedTradeSettlementHeaderMonetarySummation>
    </ram:ApplicableHeaderTradeSettlement>
  </rsm:SupplyChainTradeTransaction>
</rsm:CrossIndustryInvoice>
`;
}
