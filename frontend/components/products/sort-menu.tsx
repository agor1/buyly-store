"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import type { ProductSort } from "@/lib/api/products";

const sortOptions = [
  {
    value: "relevance",
    label: "Trafność",
    text: "Najlepsze dopasowanie do zapytania",
  },
  {
    value: "price-asc",
    label: "Cena rosnąco",
    text: "Od najtańszych produktów",
  },
  {
    value: "price-desc",
    label: "Cena malejąco",
    text: "Od najdroższych produktów",
  },
  {
    value: "newest",
    label: "Najnowsze",
    text: "Ostatnio dodane oferty",
  },
] satisfies Array<{ value: ProductSort; label: string; text: string }>;

interface SortMenuProps {
  selectedSort: ProductSort;
  onSortChange: (sort: ProductSort) => void;
}

export default function SortMenu({
  selectedSort,
  onSortChange,
}: SortMenuProps) {
  const selectedOption =
    sortOptions.find((option) => option.value === selectedSort) ??
    sortOptions[0];

  return (
    <NavigationMenu
      className="relative justify-start sm:justify-end"
      viewport={false}
    >
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="border-hairline border-border bg-base px-3 py-2 font-mono text-caption uppercase tracking-[0.12em] text-muted-foreground hover:bg-elevated hover:text-cyan data-open:bg-elevated data-open:text-cyan">
            sortuj po: {selectedOption.label.toLowerCase()}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="absolute right-0 top-full z-[100] mt-1.5 min-w-56 border-hairline border-border bg-surface p-2 text-text shadow-cyan">
            <div className="grid gap-1">
              {sortOptions.map((option) => (
                <button
                  className={`block w-full border-hairline p-3 text-left hover:border-cyan hover:bg-elevated focus:border-cyan focus:bg-elevated ${
                    option.value === selectedSort
                      ? "border-cyan bg-cyan-bg"
                      : "border-transparent bg-base"
                  }`}
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  type="button"
                >
                  <span className="block font-mono text-label uppercase tracking-[0.14em] text-cyan">
                    {option.label}
                  </span>
                  <span className="mt-1 block text-caption text-muted-foreground">
                    {option.text}
                  </span>
                </button>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
