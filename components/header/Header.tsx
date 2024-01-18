import Link from "next/link";
import React from "react";
import Menu from "./Menu";
Menu;
export default function Header() {
  return (
    <header>
      <nav>
        <div className="navbar justify-between bg-base-300">
          <Link href="/" className="btn btn-ghost text-lg">
            SRayen E-Commerce
          </Link>
          <Menu />
        </div>
      </nav>
    </header>
  );
}
