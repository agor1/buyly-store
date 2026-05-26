"use client";

import { motion } from "motion/react";
import Link from "next/link";

export default function Footer() {
  return (
    <motion.footer
      className="border-t border-border bg-surface"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1 }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10">
        <div>
          <p className="font-display text-xl font-extrabold text-text-bright">
            BUY<span className="text-cyan">LY</span>
          </p>
          <p className="mt-2 text-caption text-muted-foreground">
            Zakupy online na wyciągnięcie ręki. Poznaj BUYLY
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-caption uppercase tracking-[0.12em] text-muted-foreground">
          <Link href="/instagram">Instagram</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
        </div>
      </div>
    </motion.footer>
  );
}
