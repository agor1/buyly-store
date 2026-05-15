export default function ProductsListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          className="border-hairline border-border bg-surface p-3"
          key={item}
        >
          <div className="mb-4 aspect-[4/3] animate-pulse bg-elevated" />
          <div className="h-3 w-1/3 animate-pulse bg-border-strong" />
          <div className="mt-3 h-6 w-3/4 animate-pulse bg-border-strong" />
        </div>
      ))}
    </div>
  );
}
