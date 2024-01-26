import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Providers from "@/components/Providers";
import Sidebar from "@/components/Sidebar";
import DrawerButton from "@/components/DrawerButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SRayen E-Commerce",
  description: "Modern E-Commerce Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="drawer">
            <DrawerButton />
            <div className="drawer-content">
              {/* Page content here */}
              <div className="min-h-screen flex flex-col">
                <Header />
                {children}
                <Footer />
              </div>
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <Sidebar />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
