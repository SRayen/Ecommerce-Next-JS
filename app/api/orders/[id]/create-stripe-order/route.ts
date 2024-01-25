import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";
const stripe = require("stripe")(process.env.STRIPE_SK);

export const POST = auth(async (...request: any) => {
  const [req, { params }] = request;
  if (!req.auth) {
    return Response.json(
      { message: "unauthorized" },
      {
        status: 401,
      }
    );
  }
  await dbConnect();
  const order = await OrderModel.findById(params.id).populate("user");
  if (order) {
    try {
      let stripeItems: any = [];

      for (const product of order.items) {
        stripeItems.push({
          quantity: product.qty,
          price_data: {
            currency: "USD",
            product_data: {
              name: product.name,
            },
            unit_amount: product.price * 100,
          },
        });
      }
      // Add tax line item
      stripeItems.push({
        price_data: {
          currency: "USD",
          product_data: {
            name: "Taxes",
          },
          unit_amount: order?.taxPrice * 100,
        },
        quantity: 1,
      });
      const stripeSession = await stripe.checkout.sessions.create({
        line_items: stripeItems,
        mode: "payment",
        customer_email: order.user.email,
        success_url: process.env.NEXTAUTH_URL + "order/" + order._id.toString(),
        cancel_url: "http://localhost:3000/cancel",
        shipping_options: [
          {
            shipping_rate_data: {
              display_name: "Delivery fee",
              type: "fixed_amount",
              fixed_amount: {
                amount: order.shippingPrice * 100,
                currency: "USD",
              },
            },
          },
        ],
      });
      return Response.json(stripeSession.url, { status: 201 });
    } catch (err: any) {
      return Response.json(
        { message: "Something went wrong" },
        {
          status: 500,
        }
      );
    }
  } else {
    return Response.json(
      { message: "Order not found" },
      {
        status: 404,
      }
    );
  }
}) as any;
