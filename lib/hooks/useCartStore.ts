import { OrderItem } from "@/lib/models/OrderModel";
import { create } from "zustand";
import { round2 } from "../utils";

type Cart = {
  items: OrderItem[];
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
};

const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  taxPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
};

export const cartStore = create<Cart>(() => initialState);

export default function useCartService() {
  const { items, itemsPrice, taxPrice, shippingPrice, totalPrice } =
    cartStore();
  return {
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    increase: (item: OrderItem) => {
      const exist = items.find((x) => x.slug === item.slug);
      const updatedCartItems = exist
        ? items.map((x) =>
            x.slug === exist.slug ? { ...exist, qty: exist.qty + 1 } : x
          )
        : [...items, { ...item, qty: 1 }];
      const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
        calcPrice(updatedCartItems);
      cartStore.setState({
        items: updatedCartItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
    },
  };
}

const calcPrice = (items: OrderItem[]) => {
  const itemsPrice = Number(
      round2(items.reduce((acc, item) => acc + item.price * item.qty, 0))
    ),
    shippingPrice = Number(round2(Number(itemsPrice) > 100 ? 0 : 100)),
    taxPrice = Number(round2(Number(0.15 * Number(itemsPrice)))),
    totalPrice = Number(
      round2(Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice))
    );
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};