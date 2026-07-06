// Session client : cookie httpOnly portant le jeton du client.
// Connexion par lien magique (email) — zéro mot de passe à gérer ni à fuir.
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "./config";
import { getCustomerByToken, type Customer } from "./store";

export async function currentCustomer(): Promise<Customer | undefined> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  return token ? getCustomerByToken(token) : undefined;
}
