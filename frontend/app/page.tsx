import {
  ArrowRight,
  Package,
  ShieldCheck,
  Truck,
} from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";

const products = [
  {
    brand: "sony",
    name: "Wireless Headphones",
    price: "349 PLN",
    tag: "NEW",
    color: "bg-cyan",
  },
  {
    brand: "philips",
    name: "Smart LED Starter Kit",
    price: "199 PLN",
    tag: "HOME",
    color: "bg-green",
  },
  {
    brand: "lego",
    name: "Creator Space Rover",
    price: "249 PLN",
    tag: "TOYS",
    color: "bg-amber",
  },
];

const collections = [
  "Elektronika",
  "Dom i kuchnia",
  "Ksiazki",
  "Zabawki",
  "Sport",
  "Beauty",
  "Motoryzacja",
  "Gaming",
];

const benefits = [
  {
    icon: Truck,
    title: "Wysyłka 24h",
    text: "Szybka realizacja zamówień z wielu kategorii produktowych.",
  },
  {
    icon: ShieldCheck,
    title: "Bezpieczne zakupy",
    text: "Przejrzyste ceny, ochrona płatności i wygodne zwroty.",
  },
  {
    icon: Package,
    title: "Tysiące produktów",
    text: "Elektronika, dom, hobby, sport, gaming i codzienne zakupy.",
  },
];

export default function Home() {
  return (
    <main className="scanlines flex-1 bg-base text-text">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-10 px-6 py-12 md:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <div className="max-w-2xl">
          <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
            {"// marketplace online"}
          </p>
          <h1 className="mt-4 font-display text-5xl font-extrabold leading-none tracking-normal text-text-bright md:text-7xl">
            Wszystko, czego szukasz, w jednym sklepie.
          </h1>
          <p className="mt-6 max-w-xl text-body text-muted-foreground">
            Buyly to marketplace dla codziennych zakupow: elektronika, dom,
            ksiazki, zabawki, gaming, sport i okazje w jednym miejscu.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button className="bg-cyan text-black hover:bg-cyan-dim">
              Zobacz okazje
              <ArrowRight />
            </Button>
            <Button
              variant="outline"
              className="border-border bg-surface text-text-bright hover:bg-elevated hover:text-cyan"
            >
              Kategorie
            </Button>
          </div>
        </div>

        <div className="border-hairline border-border bg-surface p-4 shadow-cyan">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
            <span className="font-mono text-label uppercase tracking-[0.14em] text-cyan">
              {"// dzisiejsza oferta"}
            </span>
            <span className="text-caption text-muted-foreground">BUYLY_01</span>
          </div>
          <div className="grid min-h-[430px] gap-3 sm:grid-cols-[0.8fr_1.2fr]">
            <div className="grid gap-3">
              <div className="border-hairline border-border bg-elevated p-4">
                <p className="text-caption uppercase tracking-[0.12em] text-muted-foreground">
                  conversion ready
                </p>
                <p className="mt-2 font-display text-4xl font-extrabold text-green">
                  +38%
                </p>
              </div>
              <div className="border-hairline border-border bg-elevated p-4">
                <div className="h-32 bg-[linear-gradient(135deg,var(--cyan-bg),var(--elevated))]" />
                <div className="mt-4 h-2 w-3/4 bg-border-strong" />
                <div className="mt-3 h-2 w-1/2 bg-cyan" />
              </div>
            </div>
            <div className="flex flex-col justify-between border-hairline border-cyan bg-base p-5">
              <div>
                <span className="border-hairline border-amber bg-amber-bg px-2 py-1 font-mono text-label font-bold uppercase tracking-[0.1em] text-amber">
                  bestseller
                </span>
                <h2 className="mt-5 font-display text-4xl font-extrabold leading-none text-text-bright">
                  Smart Home Bundle
                </h2>
              </div>
              <div>
                <div className="mb-5 grid grid-cols-3 gap-2">
                  <div className="h-24 border-hairline border-border bg-surface" />
                  <div className="h-24 border-hairline border-border bg-surface" />
                  <div className="h-24 border-hairline border-border bg-cyan-bg" />
                </div>
                <p className="font-mono text-price font-bold text-cyan">
                  699 PLN
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-6 py-8 md:grid-cols-4 lg:px-10">
          {collections.map((collection) => (
            <div
              className="border-hairline border-border bg-base px-4 py-6 hover:border-cyan cursor-pointer transition-colors"
              key={collection}
            >
              <p className="font-mono text-label uppercase tracking-[0.14em] text-cyan">
                {"// "}
                {collection}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
              {"// produkty"}
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-text-bright">
              Popularne produkty z roznych kategorii.
            </h2>
          </div>
          <p className="max-w-md text-body text-muted-foreground md:text-right">
            Przeglądaj najpopularniejsze produkty z elektroniki, domu, hobby,
            sportu, gamingu i codziennych zakupow. Najlepsze oferty w jednym
            miejscu.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {products.map((product) => (
            <article
              className="group border-hairline border-border bg-surface p-3 transition-colors hover:border-cyan"
              key={product.name}
            >
              <div className="relative mb-4 flex aspect-[4/3] items-center justify-center overflow-hidden bg-elevated">
                <div className="absolute left-3 top-3 border-hairline border-cyan bg-cyan-bg px-2 py-1 font-mono text-label font-bold text-cyan">
                  {product.tag}
                </div>
                <div
                  className={`h-24 w-24 ${product.color} opacity-80 transition-transform group-hover:scale-110`}
                />
                <div className="absolute bottom-5 h-2 w-2/3 bg-border-strong" />
              </div>
              <p className="font-mono text-label uppercase tracking-[0.14em] text-cyan">
                {"// "}
                {product.brand}
              </p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <h3 className="font-display text-xl font-bold leading-tight text-text-bright">
                  {product.name}
                </h3>
                <p className="font-mono text-price font-bold text-cyan">
                  {product.price}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 pb-16 md:grid-cols-3 lg:px-10">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <div
              className="border-hairline border-border bg-surface p-5"
              key={benefit.title}
            >
              <Icon className="mb-5 text-cyan" size={24} />
              <h3 className="font-display text-xl font-bold text-text-bright">
                {benefit.title}
              </h3>
              <p className="mt-2 text-body text-muted-foreground">
                {benefit.text}
              </p>
            </div>
          );
        })}
      </section>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between lg:px-10">
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
    </main>
  );
}
