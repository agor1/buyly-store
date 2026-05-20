"use client";

import { MagnifyingGlass } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { getProducts, type Product } from "@/lib/api/products";
import { formatPrice, getEffectiveProductPrice } from "@/lib/product-utils";
import { cn } from "@/lib/utils";

interface SearchAutocompleteProps {
  className?: string;
  inputGroupClassName?: string;
  inputClassName?: string;
  wrapperClassName?: string;
}

export default function SearchAutocomplete({
  className,
  inputGroupClassName = "h-9 w-full max-w-xs border-border bg-surface text-text-bright focus-within:border-cyan focus-within:ring-1 focus-within:ring-cyan/30 xl:max-w-sm",
  inputClassName = "h-9 text-text-bright placeholder:text-muted-foreground",
  wrapperClassName = "w-full max-w-xs xl:max-w-sm",
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      return;
    }

    let isCurrent = true;
    const timeout = window.setTimeout(() => {
      getProducts({ limit: 5, page: 1, search: trimmedQuery })
        .then((response) => {
          if (isCurrent) {
            setResults(response.data);
          }
        })
        .catch(() => {
          if (isCurrent) {
            setResults([]);
          }
        })
        .finally(() => {
          if (isCurrent) {
            setIsLoading(false);
          }
        });
    }, 220);

    return () => {
      isCurrent = false;
      window.clearTimeout(timeout);
    };
  }, [query]);

  const trimmedQuery = query.trim();
  const shouldShowDropdown = isOpen && trimmedQuery.length >= 2;

  return (
    <form action="/products/search" className={className ?? "w-full"}>
      <div className={cn("relative", wrapperClassName)}>
        <InputGroup className={inputGroupClassName}>
          <InputGroupAddon>
            <MagnifyingGlass className="text-cyan" />
          </InputGroupAddon>
          <InputGroupInput
            aria-autocomplete="list"
            aria-expanded={shouldShowDropdown}
            aria-label="Wyszukaj produkty"
            className={inputClassName}
            name="q"
            onBlur={() => {
              window.setTimeout(() => setIsOpen(false), 120);
            }}
            onChange={(event) => {
              const nextQuery = event.target.value;

              setQuery(nextQuery);
              setIsOpen(true);

              if (nextQuery.trim().length < 2) {
                setResults([]);
                setIsLoading(false);
              } else {
                setIsLoading(true);
              }
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Szukaj produktów"
            type="search"
            value={query}
          />
        </InputGroup>

        {shouldShowDropdown ? (
          <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden border border-border bg-surface shadow-cyan">
            <div className="border-b border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan">
              Wyniki wyszukiwania
            </div>
            {isLoading ? (
              <div className="px-3 py-4 text-sm text-muted-foreground">
                Skanuję katalog...
              </div>
            ) : results.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {results.map((product) => (
                  <Link
                    className="flex items-center gap-3 border-b border-border px-3 py-3 transition-colors last:border-b-0 hover:bg-elevated"
                    href={`/products/${product.slug}`}
                    key={product.id}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="grid size-10 shrink-0 place-items-center border border-border bg-base font-mono text-xs font-bold text-cyan">
                      {product.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text-bright">
                        {product.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {product.category?.name ?? "Produkt"}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-cyan">
                      {formatPrice(getEffectiveProductPrice(product))}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-3 py-4 text-sm text-muted-foreground">
                Brak produktów dla „{trimmedQuery}”.
              </div>
            )}
            <Link
              className="block border-t border-border px-3 py-2 text-center font-mono text-xs uppercase tracking-[0.14em] text-cyan transition-colors hover:bg-elevated"
              href={`/products/search?q=${encodeURIComponent(trimmedQuery)}`}
              onClick={() => setIsOpen(false)}
            >
              Zobacz wszystkie wyniki
            </Link>
          </div>
        ) : null}
      </div>
    </form>
  );
}
