import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardText,
  CreditCard,
  Package,
  ShieldCheck,
  Truck,
} from "@phosphor-icons/react/dist/ssr";

import Footer from "@/components/layout/footer";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Regulamin",
  description: "Regulamin sklepu internetowego Buyly Store.",
};

const summaryItems = [
  {
    icon: ClipboardText,
    title: "Zakupy",
    text: "Zamówienie składasz przez koszyk i formularz checkout. Po złożeniu zamówienia otrzymujesz potwierdzenie.",
  },
  {
    icon: CreditCard,
    title: "Płatności",
    text: "Dostępne metody płatności widoczne są podczas finalizacji zamówienia.",
  },
  {
    icon: Truck,
    title: "Dostawa",
    text: "Koszt i typ dostawy wybierasz w checkout przed potwierdzeniem zakupu.",
  },
  {
    icon: Package,
    title: "Zwroty",
    text: "Jako konsument masz prawo odstąpić od umowy w terminie 14 dni od odbioru produktu.",
  },
];

const termsSections = [
  {
    title: "1. Postanowienia ogólne",
    content: [
      "Regulamin określa zasady korzystania ze sklepu internetowego Buyly Store oraz składania zamówień za jego pośrednictwem.",
      "Sklep prowadzony jest jako projekt demonstracyjny aplikacji e-commerce. Dane firmy, numery rejestrowe i szczegóły prawne należy uzupełnić przed użyciem komercyjnym.",
      "Korzystanie ze sklepu oznacza akceptację zasad opisanych w regulaminie w zakresie niezbędnym do złożenia i obsługi zamówienia.",
    ],
  },
  {
    title: "2. Konto klienta",
    content: [
      "Klient może utworzyć konto, podając wymagane dane rejestracyjne.",
      "Użytkownik odpowiada za zachowanie poufności danych logowania oraz za aktualność danych zapisanych na koncie.",
      "Konto pozwala m.in. przeglądać historię zamówień, korzystać z koszyka i zapisywać ulubione produkty.",
    ],
  },
  {
    title: "3. Produkty i ceny",
    content: [
      "Informacje o produktach, cenach, promocjach i dostępności prezentowane są na kartach produktów.",
      "Ceny podane w sklepie są cenami brutto, o ile przy produkcie nie wskazano inaczej.",
      "Promocje mogą być ograniczone czasowo. Cena obowiązująca dla zamówienia jest liczona w momencie jego złożenia.",
    ],
  },
  {
    title: "4. Zamówienia",
    content: [
      "Zamówienie zostaje złożone po wypełnieniu formularza checkout i potwierdzeniu zakupu.",
      "Sklep może odmówić realizacji zamówienia, jeżeli produkt jest niedostępny, dane są niepełne albo wystąpił błąd techniczny uniemożliwiający obsługę.",
      "Klient może sprawdzić status zamówienia na swoim koncie albo kontaktując się z obsługą sklepu.",
    ],
  },
  {
    title: "5. Dostawa i płatność",
    content: [
      "Dostępne metody dostawy i płatności są prezentowane w checkout.",
      "Termin realizacji zależy od wybranego sposobu dostawy oraz dostępności produktów.",
      "W przypadku problemów z płatnością lub dostawą klient powinien skontaktować się z obsługą sklepu.",
    ],
  },
  {
    title: "6. Zwroty i reklamacje",
    content: [
      "Konsument może odstąpić od umowy w terminie 14 dni od otrzymania produktu, chyba że przepisy przewidują wyjątek.",
      "Reklamacje dotyczące produktu, dostawy lub działania sklepu można zgłaszać przez formularz kontaktowy.",
      "Zgłoszenie powinno zawierać numer zamówienia, dane kontaktowe oraz opis sprawy.",
    ],
  },
  {
    title: "7. Dane osobowe",
    content: [
      "Dane klienta są przetwarzane w celu obsługi konta, zamówień, płatności, dostaw oraz kontaktu z obsługą sklepu.",
      "Szczegółowe zasady przetwarzania danych powinny zostać opisane w polityce prywatności sklepu.",
      "Przed wdrożeniem produkcyjnym należy dopasować treść regulaminu i polityki prywatności do faktycznych procesów biznesowych.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="scanlines flex-1 overflow-x-hidden bg-base text-text">
      <section className="mx-auto grid min-h-[58vh] w-full max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
            {"// regulamin"}
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-none text-text-bright sm:text-5xl md:text-6xl">
            Zasady korzystania ze sklepu Buyly.
          </h1>
          <p className="mt-6 max-w-xl text-body text-muted-foreground">
            Poniżej znajdziesz najważniejsze warunki zakupów, płatności,
            dostawy, zwrotów i korzystania z konta klienta.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="bg-cyan text-black hover:bg-cyan-dim">
              <Link href="/products">
                Przejdź do sklepu
                <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-border bg-surface text-text-bright hover:bg-elevated hover:text-cyan"
            >
              <Link href="/contact">Kontakt</Link>
            </Button>
          </div>
        </Reveal>

        <Reveal
          className="border-hairline border-border bg-surface p-4 shadow-cyan sm:p-5"
          delay={0.08}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <span className="font-mono text-label uppercase tracking-[0.14em] text-cyan">
              {"// podsumowanie"}
            </span>
            <span className="text-caption text-muted-foreground">
              BUYLY_TERMS
            </span>
          </div>
          <Stagger className="grid gap-3 sm:grid-cols-2">
            {summaryItems.map((item) => {
              const Icon = item.icon;

              return (
                <StaggerItem
                  className="border-hairline border-border bg-base p-4"
                  key={item.title}
                >
                  <Icon className="text-cyan" size={24} />
                  <h2 className="mt-4 font-display text-lg font-bold text-text-bright">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-caption text-muted-foreground">
                    {item.text}
                  </p>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Reveal>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10">
          <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
            {"// informacje prawne"}
          </p>
          <p className="max-w-2xl text-caption text-muted-foreground md:text-right">
            Regulamin Buyly Store ma charakter informacyjny i nie stanowi porady
            prawnej.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16 lg:px-10">
        <Stagger className="grid gap-4">
          {termsSections.map((section) => (
            <StaggerItem
              className="border-hairline border-border bg-surface p-5 sm:p-6"
              key={section.title}
            >
              <h2 className="font-display text-2xl font-extrabold text-text-bright">
                {section.title}
              </h2>
              <div className="mt-4 grid gap-3">
                {section.content.map((paragraph) => (
                  <p
                    className="text-body leading-relaxed text-muted-foreground"
                    key={paragraph}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-6 border-hairline border-cyan bg-cyan-bg p-5 sm:p-6">
          <ShieldCheck className="text-cyan" size={26} />
          <h2 className="mt-4 font-display text-2xl font-extrabold text-text-bright">
            Masz pytania do regulaminu?
          </h2>
          <p className="mt-3 max-w-2xl text-body text-muted-foreground">
            W sprawach zwrotów, reklamacji, płatności lub statusu zamówienia
            skontaktuj się z obsługą sklepu przez formularz kontaktowy.
          </p>
          <Button asChild className="mt-5 bg-cyan text-black hover:bg-cyan-dim">
            <Link href="/contact">Napisz do nas</Link>
          </Button>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
