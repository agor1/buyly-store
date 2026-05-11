"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col h-screen items-center justify-center gap-6 scanlines">
      <h1 className="font-display text-6xl font-extrabold text-text-bright">
        404
      </h1>
      <p className="text-body text-muted-foreground">
        Ups! Nie możemy znaleźć tej strony.
      </p>
      <Link
        href="/"
        className="rounded-md bg-cyan px-4 py-2 text-black hover:bg-cyan/80"
      >
        Wróć do strony głównej
      </Link>
    </div>
  );
}
