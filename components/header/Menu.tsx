"use client";
import useCartService from "@/lib/hooks/useCartStore";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";

import React from "react";

export default function Menu() {
  const { items } = useCartService();
  const [mounted, setMounted] = useState(false); //if true => client side
  useEffect(() => {
    setMounted(true);
  }, []);

  const signoutHandler = () => {
    signOut({ callbackUrl: "/signin" });
  };

  return (
    <div>
      <ul className="flex items-stretch">
        <li>
          <Link className="btn btn-ghost rounded-btn" href="/cart">
            Cart
            {mounted && items.length != 0 && (
              <div className="badge badge-secondary">
                {items.reduce((acc, item) => acc + item.qty, 0)}
              </div>
            )}
          </Link>
        </li>
        <li>
          <button className="btn btn-ghost rounded-btn">Sign in</button>
        </li>
      </ul>
    </div>
  );
}
