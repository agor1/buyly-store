"use client";

import { useEffect } from "react";
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

export default function Navbar() {
  const { hasHydrated, user } = useAuthStore();
  const { logout, loading } = useAuth();
  const router = useRouter();
  const isAuthenticated = !!user;
  const setCartOwner = useCartStore((state) => state.setCartOwner);
  const loadCart = useCartStore((state) => state.loadCart);
  const cartItemsCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    setCartOwner(user?.id ?? null);
    if (user?.id) {
      void loadCart();
    }
  }, [hasHydrated, loadCart, setCartOwner, user?.id]);

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

      <form
        action="/products/search"
        className="hidden min-w-0 flex-1 justify-center md:flex"
      >
        <InputGroup className="h-9 w-full max-w-xs border-border bg-surface text-text-bright focus-within:border-cyan focus-within:ring-1 focus-within:ring-cyan/30 xl:max-w-sm">
          <InputGroupAddon>
            <MagnifyingGlass className="text-cyan" />
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Wyszukaj produkty"
            className="h-9 text-text-bright placeholder:text-muted-foreground"
            name="q"
            placeholder="Szukaj produktów"
            type="search"
          />
        </InputGroup>
      </form>

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
              <form action="/products/search">
                <InputGroup className="h-10 border-border bg-base text-text-bright focus-within:border-cyan focus-within:ring-1 focus-within:ring-cyan/30">
                  <InputGroupAddon>
                    <MagnifyingGlass className="text-cyan" />
                  </InputGroupAddon>
                  <InputGroupInput
                    aria-label="Wyszukaj produkty"
                    className="h-10 text-text-bright placeholder:text-muted-foreground"
                    name="q"
                    placeholder="Szukaj produktów"
                    type="search"
                  />
                </InputGroup>
              </form>
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
