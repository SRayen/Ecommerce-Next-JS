"use client";
import useCartService from "@/lib/hooks/useCartStore";
import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import ChevronDown from "@/icons/ChevronDown";
import useLayoutService from "@/lib/hooks/useLayout";
import SunIcon from "@/icons/SunIcon";
import MoonIcon from "@/icons/MoonIcon";

import React from "react";

export default function Menu() {
  const { items, init } = useCartService();
  const [mounted, setMounted] = useState(false); //if true => client side
  useEffect(() => {
    setMounted(true);
  }, []);

  const signoutHandler = () => {
    signOut({ callbackUrl: "/signin" });
    init(); //remove all user info (saved in CartStore)
  };

  const { data: session } = useSession();

  const { theme, toggleTheme } = useLayoutService();

  const handleClick = () => {
    (document.activeElement as HTMLElement).blur();
  };

  return (
    <div>
      <ul className="flex items-stretch">
        <li>
          {mounted && (
            <label className="swap swap-rotate">
              {/* this hidden checkbox controls the state */}
              <input
                type="checkbox"
                checked={theme === "light"}
                onChange={toggleTheme}
              />

              <SunIcon />

              <MoonIcon />
            </label>
          )}
        </li>
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
                  <li>
                    <Link href="/order-history">Order history</Link>
                  </li>
                  <li>
                    <Link href="/profile">Profile</Link>
                  </li>
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
