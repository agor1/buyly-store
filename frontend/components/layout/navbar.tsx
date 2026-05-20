"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  List,
  Heart,
  MagnifyingGlass,
  ShoppingCart,
  SignIn,
  SignOut,
  UserPlus,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useAuth } from "@/app/hooks/useAuth";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCartStore } from "@/lib/store/cart-store";
import { useFavoritesStore } from "@/lib/store/favorites-store";
import { getProducts, type Product } from "@/lib/api/products";
import { formatPrice, getEffectiveProductPrice } from "@/lib/product-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const navLinks = [
  {
    href: "/",
    label: "Strona Główna",
  },
  {
    href: "/products",
    label: "Produkty",
  },
  {
    href: "/contact",
    label: "Kontakt",
  },
];

function SearchAutocomplete({
  className,
  inputGroupClassName = "h-9 w-full max-w-xs border-border bg-surface text-text-bright focus-within:border-cyan focus-within:ring-1 focus-within:ring-cyan/30 xl:max-w-sm",
  inputClassName = "h-9 text-text-bright placeholder:text-muted-foreground",
  wrapperClassName = "w-full max-w-xs xl:max-w-sm",
}: {
  className?: string;
  inputGroupClassName?: string;
  inputClassName?: string;
  wrapperClassName?: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      return;
    }

    let isCurrent = true;
    const timeout = window.setTimeout(() => {
      getProducts({ limit: 5, page: 1, search: trimmedQuery })
        .then((response) => {
          if (isCurrent) {
            setResults(response.data);
          }
        })
        .catch(() => {
          if (isCurrent) {
            setResults([]);
          }
        })
        .finally(() => {
          if (isCurrent) {
            setIsLoading(false);
          }
        });
    }, 220);

    return () => {
      isCurrent = false;
      window.clearTimeout(timeout);
    };
  }, [query]);

  const trimmedQuery = query.trim();
  const shouldShowDropdown = isOpen && trimmedQuery.length >= 2;

  return (
    <form action="/products/search" className={className ?? "w-full"}>
      <div className={`relative ${wrapperClassName}`}>
        <InputGroup className={inputGroupClassName}>
          <InputGroupAddon>
            <MagnifyingGlass className="text-cyan" />
          </InputGroupAddon>
          <InputGroupInput
            aria-autocomplete="list"
            aria-expanded={shouldShowDropdown}
            aria-label="Wyszukaj produkty"
            className={inputClassName}
            name="q"
            onBlur={() => {
              window.setTimeout(() => setIsOpen(false), 120);
            }}
            onChange={(event) => {
              const nextQuery = event.target.value;

              setQuery(nextQuery);
              setIsOpen(true);

              if (nextQuery.trim().length < 2) {
                setResults([]);
                setIsLoading(false);
              } else {
                setIsLoading(true);
              }
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Szukaj produktów"
            type="search"
            value={query}
          />
        </InputGroup>

        {shouldShowDropdown ? (
          <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden border border-border bg-surface shadow-cyan">
            <div className="border-b border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan">
              Wyniki wyszukiwania
            </div>
            {isLoading ? (
              <div className="px-3 py-4 text-sm text-muted-foreground">
                Skanuję katalog...
              </div>
            ) : results.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {results.map((product) => (
                  <Link
                    className="flex items-center gap-3 border-b border-border px-3 py-3 transition-colors last:border-b-0 hover:bg-elevated"
                    href={`/products/${product.slug}`}
                    key={product.id}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="grid size-10 shrink-0 place-items-center border border-border bg-base font-mono text-xs font-bold text-cyan">
                      {product.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text-bright">
                        {product.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {product.category?.name ?? "Produkt"}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-cyan">
                      {formatPrice(getEffectiveProductPrice(product))}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-3 py-4 text-sm text-muted-foreground">
                Brak produktów dla „{trimmedQuery}”.
              </div>
            )}
            <Link
              className="block border-t border-border px-3 py-2 text-center font-mono text-xs uppercase tracking-[0.14em] text-cyan transition-colors hover:bg-elevated"
              href={`/products/search?q=${encodeURIComponent(trimmedQuery)}`}
              onClick={() => setIsOpen(false)}
            >
              Zobacz wszystkie wyniki
            </Link>
          </div>
        ) : null}
      </div>
    </form>
  );
}

export default function Navbar() {
  const { hasHydrated, user } = useAuthStore();
  const { logout, loading } = useAuth();
  const router = useRouter();
  const isAuthenticated = !!user;
  const setCartOwner = useCartStore((state) => state.setCartOwner);
  const loadCart = useCartStore((state) => state.loadCart);
  const setFavoritesOwner = useFavoritesStore((state) => state.setFavoritesOwner);
  const loadFavorites = useFavoritesStore((state) => state.loadFavorites);
  const cartItemsCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );
  const favoritesCount = useFavoritesStore((state) =>
    state.hasHydrated ? state.items.length : 0,
  );

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    setCartOwner(user?.id ?? null);
    setFavoritesOwner(user?.id ?? null);
    if (user?.id) {
      void loadCart();
      void loadFavorites();
    }
  }, [hasHydrated, loadCart, loadFavorites, setCartOwner, setFavoritesOwner, user?.id]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <motion.nav
      animate={{ opacity: 1 }}
      className="sticky top-0 z-40 flex h-16 w-full items-center justify-between gap-3 border-b border-border bg-base/90 px-4 text-white backdrop-blur sm:px-6"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href="/"
        className="inline-flex shrink-0 items-center font-display text-xl font-extrabold tracking-normal text-text-bright"
      >
        BUY<span className="text-cyan">LY</span>
        <motion.span
          className="size-2 bg-cyan mt-2 ml-2"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.49, 0.5, 1],
          }}
        />
      </Link>

      <SearchAutocomplete className="hidden min-w-0 flex-1 justify-center md:flex" />

      <div className="xl:hidden">
        <Drawer direction="right">
          <DrawerTrigger asChild>
            <Button
              aria-label="Otwórz menu"
              className="border-border bg-surface text-text-bright hover:bg-elevated hover:text-cyan"
              size="icon"
              variant="outline"
            >
              <List size={24} />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="border-border bg-surface text-text">
            <DrawerHeader>
              <DrawerTitle className="font-display text-text-bright">
                BUY<span className="text-cyan">LY</span>
              </DrawerTitle>
              <DrawerDescription className="text-cyan">
                {"// PANEL NAWIGACYJNY"}
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-2">
              <SearchAutocomplete
                inputClassName="h-10 text-text-bright placeholder:text-muted-foreground"
                inputGroupClassName="h-10 border-border bg-base text-text-bright focus-within:border-cyan focus-within:ring-1 focus-within:ring-cyan/30"
                wrapperClassName="w-full"
              />
            </div>
            <div className="flex flex-col px-4">
              {navLinks.map((link) => (
                <DrawerClose asChild key={link.href}>
                  <Link
                    href={link.href}
                    className="border-b border-border py-4 text-muted-foreground transition-colors hover:text-cyan"
                  >
                    {"// "}
                    {link.label}
                  </Link>
                </DrawerClose>
              ))}
            </div>
            {isAuthenticated && (
              <div className="mx-4 mt-4 border border-border bg-base">
                <div className="flex items-center gap-3 border-b border-border p-4">
                  <Avatar>
                    <AvatarImage />
                    <AvatarFallback>
                      {user?.name ? user.name[0] : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-bright">
                      {user?.name || "Moje konto"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col">
                  <DrawerClose asChild>
                    <Link
                      href="/cart"
                      className="border-b border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:text-cyan"
                    >
                      Koszyk
                    </Link>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Link
                      href="/favorites"
                      className="border-b border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:text-cyan"
                    >
                      Ulubione
                    </Link>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Link
                      href="/profile"
                      className="border-b border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:text-cyan"
                    >
                      Profil
                    </Link>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Link
                      href="/orders"
                      className="border-b border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:text-cyan"
                    >
                      Moje zamówienia
                    </Link>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Link
                      href="/profile/settings"
                      className="border-b border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:text-cyan"
                    >
                      Ustawienia
                    </Link>
                  </DrawerClose>
                  <DrawerClose asChild>
                    {user?.role === "ADMIN" ? (
                      <Link
                        href="/panel"
                        className="border-b border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:text-cyan"
                      >
                        Panel admina
                      </Link>
                    ) : null}
                  </DrawerClose>
                </div>
              </div>
            )}
            <DrawerFooter className="gap-3">
              {isAuthenticated ? (
                <DrawerClose asChild>
                  <Button
                    onClick={handleLogout}
                    disabled={loading}
                    variant="outline"
                    className="w-full border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
                  >
                    Wyloguj się
                    <SignOut />
                  </Button>
                </DrawerClose>
              ) : (
                <>
                  <DrawerClose asChild>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
                    >
                      <Link href="/login">
                        Logowanie
                        <SignIn />
                      </Link>
                    </Button>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Button asChild className="w-full bg-cyan text-black">
                      <Link href="/register">
                        Rejestracja
                        <UserPlus />
                      </Link>
                    </Button>
                  </DrawerClose>
                </>
              )}
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="w-full border-border bg-surface text-text-bright hover:bg-elevated hover:text-cyan"
                >
                  Zamknij
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="hidden shrink-0 items-center gap-6 text-muted-foreground xl:flex">
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <motion.div
              key={link.href}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
            >
              <Link
                href={link.href}
                className="hover:text-cyan hover:underline underline-offset-4"
              >
                {"// "}
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>
        {isAuthenticated ? (
          <div className="ml-2 flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              className="relative border-border bg-surface text-text-bright hover:bg-elevated hover:text-cyan"
            >
              <Link href="/cart">
                Koszyk
                <ShoppingCart />
                {cartItemsCount > 0 ? (
                  <span className="absolute -right-2 -top-2 grid size-5 place-items-center border border-cyan bg-base font-mono text-[10px] font-bold text-cyan">
                    {cartItemsCount}
                  </span>
                ) : null}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="relative border-border bg-surface text-text-bright hover:bg-elevated hover:text-cyan"
            >
              <Link href="/favorites">
                Ulubione
                <Heart />
                {favoritesCount > 0 ? (
                  <span className="absolute -right-2 -top-2 grid size-5 place-items-center border border-cyan bg-base font-mono text-[10px] font-bold text-cyan">
                    {favoritesCount}
                  </span>
                ) : null}
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="hover:cursor-pointer">
                  <AvatarImage />
                  <AvatarFallback>
                    {user?.name ? user.name[0] : "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-10 mt-2 w-48">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="">
                    <span className="font-medium text-text-bright">
                      {user.name}
                    </span>{" "}
                    <br /> {user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">Moje zamówienia</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favorites">Ulubione</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/settings">Ustawienia</Link>
                  </DropdownMenuItem>
                  {user?.role === "ADMIN" ? (
                    <DropdownMenuItem asChild>
                      <Link href="/panel">Panel admina</Link>
                    </DropdownMenuItem>
                  ) : null}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={loading}
                    variant="destructive"
                  >
                    Wyloguj się
                    <SignOut />
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="ml-2 flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              className="border-border bg-surface text-text-bright hover:bg-elevated hover:text-cyan"
            >
              <Link href="/login">
                Logowanie
                <SignIn />
              </Link>
            </Button>
            <Button asChild className="bg-cyan text-black hover:bg-cyan-dim">
              <Link href="/register">
                Rejestracja
                <UserPlus />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
