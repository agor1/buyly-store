import type { Category } from "@/lib/categories";

interface CategoryFilterProps {
  categories: Category[];
  error: string | null;
  isLoading: boolean;
  onSelectCategory: (categoryId: string) => void;
  selectedCategoryId: string;
}

const getButtonClassName = (isActive: boolean) =>
  isActive
    ? "border-hairline border-cyan bg-cyan-bg px-3 py-2 text-left text-caption uppercase tracking-[0.12em] text-cyan transition-colors"
    : "border-hairline border-border bg-base px-3 py-2 text-left text-caption uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-cyan hover:text-cyan";

export default function CategoryFilter({
  categories,
  error,
  isLoading,
  onSelectCategory,
  selectedCategoryId,
}: CategoryFilterProps) {
  return (
    <div>
      <p className="mb-3 text-caption uppercase tracking-[0.12em] text-muted-foreground">
        Kategorie
      </p>
      <div className="flex flex-wrap gap-2 lg:flex-col">
        <button
          className={getButtonClassName(selectedCategoryId === "all")}
          onClick={() => onSelectCategory("all")}
          type="button"
        >
          Wszystko
        </button>

        {isLoading ? (
          <div className="grid gap-2">
            {[1, 2, 3].map((item) => (
              <div
                className="h-9 animate-pulse border-hairline border-border bg-base"
                key={item}
              />
            ))}
          </div>
        ) : null}

        {!isLoading && error ? (
          <p className="text-caption text-muted-foreground">{error}</p>
        ) : null}

        {!isLoading && !error
          ? categories.map((category) => (
              <button
                className={getButtonClassName(
                  selectedCategoryId === category.id,
                )}
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                type="button"
              >
                {category.name}
              </button>
            ))
          : null}
      </div>
    </div>
  );
}
