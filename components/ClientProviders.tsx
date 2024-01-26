"use client";
import { cartStore } from "@/lib/hooks/useCartStore";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { SWRConfig } from "swr";
import useLayoutService from "@/lib/hooks/useLayout";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useLayoutService();
  const [selectedTheme, setSelectedTheme] = useState("system");

  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  //reload / rehydrate the data in the cart store (exp:if we have 2 window of the project & we make a change in one => the other will be updated )
  const updateStore = () => {
    cartStore.persist.rehydrate();
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", updateStore);
    window.addEventListener("focus", updateStore);
    return () => {
      document.removeEventListener("visibilitychange", updateStore);
      window.removeEventListener("focus", updateStore);
    };
  }, []);
  return (
    <SWRConfig //By this wrap => we can access to SWR in all the project
      value={{
        onError: (error, key) => {
          toast.error(error.message);
        },
        fetcher: async (resource, init) => {
          const res = await fetch(resource, init);
          if (!res.ok) {
            throw new Error("An error occurred while fetching the data.");
          }
          return res.json();
        },
      }}
    >
      <div data-theme={selectedTheme}>
        <Toaster />
        {children}
      </div>
    </SWRConfig>
  );
}
