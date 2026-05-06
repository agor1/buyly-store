"use client";

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
import { List } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

const navLinks = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/products",
    label: "Products",
  },
  {
    href: "/contact",
    label: "Contact",
  },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-base/90 px-6 text-white backdrop-blur">
      <Link
        href="/"
        className="inline-flex items-center font-display text-xl font-extrabold tracking-normal text-text-bright"
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
      <div className="md:hidden">
        <Drawer direction="right">
          <DrawerTrigger asChild>
            <Button
              aria-label="Otworz menu"
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
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  Zamknij
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="hidden items-center gap-6 text-muted-foreground md:flex">
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
    </nav>
  );
}
