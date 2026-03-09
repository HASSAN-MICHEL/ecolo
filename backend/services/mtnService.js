import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const BASE_URL = "https://sandbox.momodeveloper.mtn.com";

const SUBSCRIPTION_KEY = process.env.MTN_SUBSCRIPTION_KEY;
const API_USER = process.env.MTN_API_USER;
const API_KEY = process.env.MTN_API_KEY;

export async function requestToPay(amount, phone) {

const referenceId = uuidv4();

const tokenResponse = await axios.post(
`${BASE_URL}/collection/token/`,
{},
{
headers: {
"Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
"Authorization": `Basic ${Buffer.from(`${API_USER}:${API_KEY}`).toString("base64")}`
}
}
);

const token = tokenResponse.data.access_token;

await axios.post(
`${BASE_URL}/collection/v1_0/requesttopay`,
{
amount: amount,
currency: "XAF",
externalId: referenceId,
payer: {
partyIdType: "MSISDN",
partyId: phone
},
payerMessage: "Abonnement ECOCOLLECT",
payeeNote: "Paiement abonnement premium"
},
{
headers: {
Authorization: `Bearer ${token}`,
"X-Reference-Id": referenceId,
"X-Target-Environment": "sandbox",
"Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
"Content-Type": "application/json"
}
}
);

return referenceId;
}