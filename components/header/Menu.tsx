"use client";
import useCartService from "@/lib/hooks/useCartStore";
import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import ChevronDown from "@/icons/ChevronDown";

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

  const { data: session } = useSession();
  const handleClick = () => {
    (document.activeElement as HTMLElement).blur();
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
        {session && session.user ? (
          <>
            <li>
              <div className="dropdown dropdown-bottom dropdown-end">
                <label tabIndex={0} className="btn btn-ghost rounded-btn">
                  {session.user.name}
                  <ChevronDown />
                </label>
                <ul
                  tabIndex={0}
                  className="menu dropdown-content z-[1] p-2 shadow bg-base-300 rounded-box w-52"
                >
                  <li onClick={handleClick}>
                    <button type="button" onClick={signoutHandler}>
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          </>
        ) : (
          <li>
            <button
              className="btn btn-ghost rounded-btn"
              type="button"
              onClick={() => signIn()}
            >
              Sign in
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
