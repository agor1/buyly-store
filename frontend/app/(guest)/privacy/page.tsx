import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Cookie,
  Database,
  EnvelopeSimple,
  Eye,
  LockKey,
  ShieldCheck,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr";

import Footer from "@/components/layout/footer";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Polityka prywatnosci",
  description: "Polityka prywatnosci sklepu internetowego Buyly Store.",
};

const privacyHighlights = [
  {
    icon: UserCircle,
    title: "Dane konta",
    text: "Przetwarzamy dane potrzebne do rejestracji, logowania i obslugi profilu klienta.",
  },
  {
    icon: Database,
    title: "Zamowienia",
    text: "Dane zakupowe wykorzystujemy do realizacji koszyka, platnosci, dostawy i historii zamowien.",
  },
  {
    icon: Cookie,
    title: "Pliki cookie",
    text: "Cookie moga wspierac dzialanie sesji, koszyka, analityki oraz ustawien aplikacji.",
  },
  {
    icon: LockKey,
    title: "Bezpieczenstwo",
    text: "Dostep do danych powinien byc ograniczony do osob i systemow potrzebnych do obslugi sklepu.",
  },
];

const privacySections = [
  {
    title: "1. Administrator danych",
    content: [
      "Administratorem danych osobowych jest operator sklepu Buyly Store. Przed wdrozeniem produkcyjnym nalezy uzupelnic pelne dane firmy, adres, NIP oraz dane kontaktowe administratora.",
      "W sprawach dotyczacych prywatnosci mozesz skontaktowac sie przez formularz kontaktowy dostepny w sklepie.",
      "Polityka ma charakter informacyjny i powinna zostac dopasowana do faktycznego sposobu prowadzenia sklepu oraz uzywanych dostawcow uslug.",
    ],
  },
  {
    title: "2. Zakres przetwarzanych danych",
    content: [
      "Mozemy przetwarzac dane podane podczas rejestracji, logowania, skladania zamowienia, kontaktu z obsluga oraz korzystania z funkcji sklepu.",
      "Zakres danych moze obejmowac imie i nazwisko, adres email, adres dostawy, numer telefonu, dane do faktury, historie zamowien, zawartosc koszyka i liste ulubionych produktow.",
      "Dodatkowo system moze zapisywac informacje techniczne, takie jak adres IP, identyfikatory sesji, typ przegladarki oraz logi zwiazane z bezpieczenstwem.",
    ],
  },
  {
    title: "3. Cele i podstawy przetwarzania",
    content: [
      "Dane wykorzystujemy do prowadzenia konta klienta, obslugi zamowien, platnosci, dostaw, zwrotow, reklamacji oraz komunikacji z klientem.",
      "Przetwarzanie moze byc niezbedne do wykonania umowy, wypelnienia obowiazkow prawnych, ochrony uzasadnionych interesow sklepu albo odbywac sie na podstawie zgody uzytkownika.",
      "Dane kontaktowe przeslane przez formularz sluza do odpowiedzi na wiadomosc i obslugi zgloszenia.",
    ],
  },
  {
    title: "4. Odbiorcy danych",
    content: [
      "Dane moga byc przekazywane podmiotom wspierajacym dzialanie sklepu, w szczegolnosci dostawcom hostingu, systemow platnosci, firmom kurierskim, narzedziom komunikacji i obsludze technicznej.",
      "Dostep do danych powinien byc udzielany tylko w zakresie koniecznym do wykonania danej uslugi.",
      "Lista rzeczywistych odbiorcow danych powinna zostac uzupelniona po wyborze produkcyjnych integracji sklepu.",
    ],
  },
  {
    title: "5. Okres przechowywania",
    content: [
      "Dane konta przechowujemy przez czas korzystania z konta, a po jego usunieciu przez okres wymagany przepisami prawa lub potrzebny do zabezpieczenia roszczen.",
      "Dane zwiazane z zamowieniami i dokumentami ksiegowymi przechowujemy przez okres wymagany przepisami podatkowymi i rachunkowymi.",
      "Dane z formularza kontaktowego przechowujemy przez czas potrzebny do obslugi sprawy oraz ewentualnej dalszej komunikacji.",
    ],
  },
  {
    title: "6. Prawa uzytkownika",
    content: [
      "Masz prawo dostepu do danych, ich sprostowania, usuniecia, ograniczenia przetwarzania, przenoszenia danych oraz wniesienia sprzeciwu wobec przetwarzania.",
      "Jesli dane sa przetwarzane na podstawie zgody, mozesz ja wycofac w dowolnym momencie bez wplywu na zgodnosc wczesniejszego przetwarzania.",
      "Masz takze prawo wniesienia skargi do organu nadzorczego zajmujacego sie ochrona danych osobowych.",
    ],
  },
  {
    title: "7. Pliki cookie i technologie podobne",
    content: [
      "Sklep moze wykorzystywac pliki cookie niezbedne do utrzymania sesji, obslugi koszyka, zapamietywania ustawien oraz zapewnienia bezpieczenstwa.",
      "W zaleznosci od konfiguracji sklep moze takze uzywac cookie analitycznych lub marketingowych. Takie narzedzia nalezy opisac po ich faktycznym wdrozeniu.",
      "Ustawienia cookie mozesz kontrolowac z poziomu przegladarki. Ograniczenie cookie moze wplynac na dzialanie niektorych funkcji sklepu.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="scanlines flex-1 overflow-x-hidden bg-base text-text">
      <section className="mx-auto grid min-h-[58vh] w-full max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
            {"// prywatnosc"}
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-none text-text-bright sm:text-5xl md:text-6xl">
            Jak Buyly chroni dane klientow.
          </h1>
          <p className="mt-6 max-w-xl text-body text-muted-foreground">
            Tu znajdziesz informacje o tym, jakie dane moga byc przetwarzane w
            sklepie, w jakich celach, komu moga byc przekazywane oraz jakie
            prawa przysluguja uzytkownikom.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="bg-cyan text-black hover:bg-cyan-dim">
              <Link href="/contact">
                Zapytaj o dane
                <EnvelopeSimple />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-border bg-surface text-text-bright hover:bg-elevated hover:text-cyan"
            >
              <Link href="/terms">
                Regulamin
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </Reveal>

        <Reveal
          className="border-hairline border-border bg-surface p-4 shadow-cyan sm:p-5"
          delay={0.08}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <span className="font-mono text-label uppercase tracking-[0.14em] text-cyan">
              {"// zakres ochrony"}
            </span>
            <span className="text-caption text-muted-foreground">
              BUYLY_PRIVACY
            </span>
          </div>
          <Stagger className="grid gap-3 sm:grid-cols-2">
            {privacyHighlights.map((item) => {
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
            {"// ochrona danych"}
          </p>
          <p className="max-w-2xl text-caption text-muted-foreground md:text-right">
            Ten widok opisuje modelowe zasady prywatnosci. Przed publikacja
            nalezy zweryfikowac go prawnie i uzupelnic dane administratora.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16 lg:px-10">
        <Stagger className="grid gap-4">
          {privacySections.map((section) => (
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
            Chcesz skorzystac ze swoich praw?
          </h2>
          <p className="mt-3 max-w-2xl text-body text-muted-foreground">
            Napisz do nas, jesli chcesz uzyskac dostep do danych, poprawic je,
            usunac konto albo zapytac o sposob przetwarzania informacji w
            sklepie.
          </p>
          <Button asChild className="mt-5 bg-cyan text-black hover:bg-cyan-dim">
            <Link href="/contact">
              Skontaktuj sie
              <Eye />
            </Link>
          </Button>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
