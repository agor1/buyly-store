"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const appName = "Buyly Store";

const pageTitles: Record<string, string> = {
  "/": appName,
  "/cart": "Koszyk",
  "/checkout/success": "Zamówienie złożone",
  "/contact": "Kontakt",
  "/favorites": "Ulubione",
  "/login": "Logowanie",
  "/orders": "Moje zamówienia",
  "/panel": "Panel admina",
  "/panel/orders": "Zamówienia",
  "/panel/products": "Produkty w panelu",
  "/products": "Produkty",
  "/products/search": "Wyniki wyszukiwania",
  "/profile": "Profil",
  "/profile/settings": "Ustawienia profilu",
  "/register": "Rejestracja",
  "/search": "Wyszukiwanie",
};

const formatSlug = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getTitle = (pathname: string) => {
  const staticTitle = pageTitles[pathname];

  if (staticTitle) {
    return staticTitle === appName ? appName : `${staticTitle} | ${appName}`;
  }

  if (pathname.startsWith("/products/")) {
    const slug = pathname.split("/").at(-1);

    return slug ? `${formatSlug(decodeURIComponent(slug))} | ${appName}` : appName;
  }

  if (pathname.startsWith("/orders/")) {
    return `Szczegóły zamówienia | ${appName}`;
  }

  if (pathname.startsWith("/panel/orders/")) {
    return `Szczegóły zamówienia | ${appName}`;
  }

  return appName;
};

export default function PageTitle() {
  const pathname = usePathname();

  useEffect(() => {
    document.title = getTitle(pathname);
  }, [pathname]);

  return null;
}
