"use client";

import {
  ChatCircleText,
  Clock,
  EnvelopeSimple,
  MapPin,
  Phone,
  Question,
} from "@phosphor-icons/react";
import { useState } from "react";

import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { sendContactMessage } from "@/lib/api/contact";
import { getFirstZodError } from "@/lib/schemas/forms";
import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Podaj imię i nazwisko"),
  email: z.string().trim().email("Podaj poprawny email"),
  topic: z.string().trim().min(3, "Podaj temat wiadomości"),
  message: z.string().trim().min(10, "Wiadomość musi mieć minimum 10 znaków"),
});

const contactChannels = [
  {
    icon: EnvelopeSimple,
    title: "Email",
    value: "support@buyly.store",
    text: "Napisz do nas w sprawie zamówienia, płatności, zwrotu albo reklamacji.",
  },
  {
    icon: Phone,
    title: "Telefon",
    value: "+48 123 456 789",
    text: "Zadzwoń, jeśli potrzebujesz szybkiej pomocy przy zakupie lub dostawie.",
  },
  {
    icon: ChatCircleText,
    title: "Czat",
    value: "Online w dni robocze",
    text: "Porozmawiaj z obsługą klienta, gdy potrzebujesz krótkiej odpowiedzi od ręki.",
  },
];

const supportDetails = [
  {
    icon: Clock,
    title: "Godziny obsługi",
    text: "Poniedziałek - piątek, 9:00-17:00",
  },
  {
    icon: MapPin,
    title: "Adres korespondencyjny",
    text: "BUYLY Store, ul. Marketplace 12, 00-001 Warszawa",
  },
  {
    icon: Question,
    title: "Najczęstsze tematy",
    text: "Status zamówienia, faktura, zwrot, reklamacja, zmiana danych dostawy.",
  },
];

const helpfulInfo = [
  "Numer zamówienia lub adres email z konta",
  "Numer przesyłki, jeśli pytasz o dostawę",
  "Zwroty: 14 dni od odbioru paczki",
  "Dane do faktury: NIP i nazwa firmy",
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const result = contactFormSchema.safeParse({
      name,
      email,
      topic,
      message,
    });

    if (!result.success) {
      setFormError(getFirstZodError(result.error));
      return;
    }

    try {
      setIsSubmitting(true);
      await sendContactMessage({
        name: result.data.name,
        email: result.data.email,
        message: `Temat: ${result.data.topic}\n\n${result.data.message}`,
      });
      setName("");
      setEmail("");
      setTopic("");
      setMessage("");
      setFormSuccess("Wiadomość została wysłana. Odpowiemy najszybciej jak to możliwe.");
    } catch {
      setFormError("Nie udało się wysłać wiadomości. Spróbuj ponownie później.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="scanlines flex-1 overflow-x-hidden bg-base text-text">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 md:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
            {"// centrum kontaktu"}
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-none text-text-bright sm:text-5xl md:text-6xl">
            Masz pytanie? Skontaktuj się z Buyly.
          </h1>
          <p className="mt-6 max-w-xl text-body text-muted-foreground">
            Pomożemy sprawdzić status zamówienia, wyjaśnić płatność, rozpocząć
            zwrot albo dobrać produkt przed zakupem. Wybierz najwygodniejszy
            kanał kontaktu.
          </p>

          <Stagger className="mt-8 grid gap-3 sm:grid-cols-3">
            {contactChannels.map((channel) => {
              const Icon = channel.icon;

              return (
                <StaggerItem
                  className="border-hairline border-border bg-surface p-4 transition-colors hover:border-cyan"
                  key={channel.title}
                >
                  <Icon className="text-cyan" size={24} />
                  <h2 className="mt-4 font-display text-lg font-bold text-text-bright">
                    {channel.title}
                  </h2>
                  <p className="mt-2 font-mono text-label uppercase tracking-[0.12em] text-cyan">
                    {channel.value}
                  </p>
                  <p className="mt-3 text-caption text-muted-foreground">
                    {channel.text}
                  </p>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Reveal>

        <Reveal className="border-hairline border-border bg-surface p-4 shadow-cyan sm:p-6" delay={0.08}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <span className="font-mono text-label uppercase tracking-[0.14em] text-cyan">
              {"// formularz"}
            </span>
            <span className="text-caption text-muted-foreground">
              BUYLY_SUPPORT
            </span>
          </div>

          <form className="grid gap-5" onSubmit={handleSubmit}>
            {formError ? (
              <div className="border border-amber bg-amber-bg p-3 text-sm text-amber">
                {formError}
              </div>
            ) : null}

            {formSuccess ? (
              <div className="border border-green bg-green-bg p-3 text-sm text-green">
                {formSuccess}
              </div>
            ) : null}

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  className="font-mono text-label uppercase tracking-[0.14em] text-cyan"
                  htmlFor="name"
                >
                  Imię i nazwisko
                </label>
                <Input
                  className="h-11 border-border bg-base text-text-bright placeholder:text-muted-foreground focus-visible:border-cyan focus-visible:ring-cyan/30"
                  id="name"
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Jan Kowalski"
                  type="text"
                  value={name}
                />
              </div>
              <div className="space-y-2">
                <label
                  className="font-mono text-label uppercase tracking-[0.14em] text-cyan"
                  htmlFor="email"
                >
                  Email
                </label>
                <Input
                  className="h-11 border-border bg-base text-text-bright placeholder:text-muted-foreground focus-visible:border-cyan focus-visible:ring-cyan/30"
                  id="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="adres@email.pl"
                  type="email"
                  value={email}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="font-mono text-label uppercase tracking-[0.14em] text-cyan"
                htmlFor="topic"
              >
                Temat
              </label>
              <Input
                className="h-11 border-border bg-base text-text-bright placeholder:text-muted-foreground focus-visible:border-cyan focus-visible:ring-cyan/30"
                id="topic"
                onChange={(event) => setTopic(event.target.value)}
                placeholder="Np. status zamówienia #1234"
                type="text"
                value={topic}
              />
            </div>

            <div className="space-y-2">
              <label
                className="font-mono text-label uppercase tracking-[0.14em] text-cyan"
                htmlFor="message"
              >
                Wiadomość
              </label>
              <Textarea
                className="min-h-36 border-border bg-base text-text-bright placeholder:text-muted-foreground focus-visible:border-cyan focus-visible:ring-cyan/30"
                id="message"
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Opisz, w czym możemy pomóc."
                value={message}
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md text-caption text-muted-foreground">
                Odpowiadamy zwykle w ciągu jednego dnia roboczego. Jeśli piszesz
                o zamówieniu, podaj jego numer w treści wiadomości.
              </p>
              <Button
                className="h-11 bg-cyan px-4 text-black hover:bg-cyan-dim"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Wysyłanie..." : "Wyślij wiadomość"}
              </Button>
            </div>
          </form>
        </Reveal>
      </section>

      <section className="border-y border-border bg-surface">
        <Stagger className="mx-auto grid max-w-7xl gap-px px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-10">
          {supportDetails.map((detail) => {
            const Icon = detail.icon;

            return (
              <StaggerItem
                className="border-hairline border-border bg-base p-5"
                key={detail.title}
              >
                <Icon className="mb-5 text-cyan" size={24} />
                <h2 className="font-display text-xl font-bold text-text-bright">
                  {detail.title}
                </h2>
                <p className="mt-2 text-body text-muted-foreground">
                  {detail.text}
                </p>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-10">
        <Reveal className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
              {"// informacje"}
            </p>
            <h2 className="mt-3 font-display text-2xl font-extrabold text-text-bright sm:text-3xl">
              Przygotuj dane, dzięki którym szybciej rozwiążemy sprawę.
            </h2>
          </div>
          <Stagger className="grid gap-3 sm:grid-cols-2">
            {helpfulInfo.map((item) => (
              <StaggerItem
                className="border-hairline border-border bg-surface p-4 font-mono text-label uppercase tracking-[0.12em] text-cyan"
                key={item}
              >
                {"// "}
                {item}
              </StaggerItem>
            ))}
          </Stagger>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
