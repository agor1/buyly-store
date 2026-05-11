"use client";

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
import { useAuthStore } from "@/lib/auth-store";
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
  const { user } = useAuthStore();
  const { logout, loading } = useAuth();
  const router = useRouter();
  const isAuthenticated = !!user;

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-40 flex h-16 w-full items-center justify-between gap-3 border-b border-border bg-base/90 px-4 text-white backdrop-blur sm:px-6">
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
              <DrawerDescription>{"// navigation"}</DrawerDescription>
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
                  <button
                    className="border-b border-border px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:text-cyan"
                    type="button"
                  >
                    Profil
                  </button>
                  <button
                    className="border-b border-border px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:text-cyan"
                    type="button"
                  >
                    Moje zamówienia
                  </button>
                  <button
                    className="border-b border-border px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:text-cyan"
                    type="button"
                  >
                    Ustawienia
                  </button>
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
            <Link
              href={link.href}
              key={link.href}
              className="hover:text-cyan hover:underline underline-offset-4"
            >
              {"// "}
              {link.label}
            </Link>
          ))}
        </div>
        {isAuthenticated ? (
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
                <DropdownMenuItem>Profil</DropdownMenuItem>
                <DropdownMenuItem>Moje zamówienia</DropdownMenuItem>
                <DropdownMenuItem>Ustawienia</DropdownMenuItem>
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
    </nav>
  );
}
