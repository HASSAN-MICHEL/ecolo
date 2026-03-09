import axios from "axios";

const BASE_URL = "https://api.orange.com";

export async function orangePayment(amount, phone) {

const token = await axios.post(
`${BASE_URL}/oauth/v3/token`,
"grant_type=client_credentials",
{
headers: {
Authorization: `Basic ${process.env.ORANGE_TOKEN}`,
"Content-Type": "application/x-www-form-urlencoded"
}
}
);

const accessToken = token.data.access_token;

const payment = await axios.post(
`${BASE_URL}/orange-money-webpay/dev/v1/webpayment`,
{
merchant_key: process.env.ORANGE_MERCHANT_KEY,
currency: "XAF",
order_id: Date.now(),
amount: amount,
return_url: "https://ecocollect.com/success",
cancel_url: "https://ecocollect.com/cancel",
notif_url: "https://ecocollect.com/api/paiements/webhook/orange"
},
{
headers: {
Authorization: `Bearer ${accessToken}`
}
}
);

return payment.data;
}