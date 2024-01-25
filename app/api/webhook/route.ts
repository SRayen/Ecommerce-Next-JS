import OrderModel from "@/lib/models/OrderModel";
const stripe = require("stripe")(process.env.STRIPE_SK);

export async function POST(req: any) {
  const sig = req.headers.get("stripe-signature");
  console.log("sig ===>", sig);
  let event;
  try {
    const reqBuffer = await req.text();
    const signSecret = process.env.STRIPE_SIGN_SECRET;
    event = stripe.webhooks.constructEvent(reqBuffer, sig, signSecret);
    console.log("event ===>", event);
  } catch (error) {
    return Response.json({ message: "Stripe error" }, { status: 400 });
  }
  if (event.type === "checkout.session.completed") {
    console.log("event completed===>", event);
    const orderId = event?.data?.object?.metadata?.orderId;
    const isPaid = event?.data?.object?.payment_status === "paid";
    if (isPaid) {
      await OrderModel.updateOne({ _id: orderId }, { isPaid: true });
    }
  }
  return Response.json("ok", { status: 200 });
}
