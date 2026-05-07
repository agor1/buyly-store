export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
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
          <span>Instagram</span>
          <span>Terms</span>
          <span>Privacy</span>
        </div>
      </div>
    </footer>
  );
}
