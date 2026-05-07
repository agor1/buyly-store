"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const sortOptions = [
  {
    href: "/products/search?sort=relevance",
    label: "Trafność",
    text: "Najlepsze dopasowanie do zapytania",
  },
  {
    href: "/products/search?sort=price-asc",
    label: "Cena rosnąco",
    text: "Od najtańszych produktów",
  },
  {
    href: "/products/search?sort=price-desc",
    label: "Cena malejąco",
    text: "Od najdroższych produktów",
  },
  {
    href: "/products/search?sort=newest",
    label: "Najnowsze",
    text: "Ostatnio dodane oferty",
  },
];

export default function SortMenu() {
  return (
    <NavigationMenu
      className="relative z-[100] justify-start sm:justify-end"
      viewport={false}
    >
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="border-hairline border-border bg-base px-3 py-2 font-mono text-caption uppercase tracking-[0.12em] text-muted-foreground hover:bg-elevated hover:text-cyan data-open:bg-elevated data-open:text-cyan">
            sort: trafność
          </NavigationMenuTrigger>
          <NavigationMenuContent className="absolute right-0 top-full z-[100] mt-1.5 min-w-56 border-hairline border-border bg-surface p-2 text-text shadow-cyan">
            <div className="grid gap-1">
              {sortOptions.map((option) => (
                <NavigationMenuLink
                  className="block border-hairline border-transparent bg-base p-3 hover:border-cyan hover:bg-elevated focus:border-cyan focus:bg-elevated"
                  href={option.href}
                  key={option.href}
                >
                  <span className="block font-mono text-label uppercase tracking-[0.14em] text-cyan">
                    {option.label}
                  </span>
                  <span className="mt-1 block text-caption text-muted-foreground">
                    {option.text}
                  </span>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
