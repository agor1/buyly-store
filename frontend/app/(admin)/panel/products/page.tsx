"use client";

import {
  ArrowsClockwise,
  MagnifyingGlass,
  PencilSimple,
  Trash,
  X,
} from "@phosphor-icons/react";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { getCategories, type Category } from "@/lib/api/categories";
import {
  createProduct,
  deleteProduct,
  getProducts,
  PRODUCT_SORT,
  updateProduct,
  type PaginationMeta,
  type Product,
} from "@/lib/api/products";
import { formatPrice } from "@/lib/product-utils";
import { getFirstZodError, productFormSchema } from "@/lib/schemas/forms";

const productsPerPage = 9;

const initialProductForm = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  price: "",
  stock: "0",
  categoryId: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productForm, setProductForm] = useState(initialProductForm);
  const [productSearch, setProductSearch] = useState("");
  const [productPage, setProductPage] = useState(1);
  const [productRefreshKey, setProductRefreshKey] = useState(0);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productPaginationMeta, setProductPaginationMeta] =
    useState<PaginationMeta>({
      page: 1,
      limit: productsPerPage,
      total: 0,
      totalPages: 1,
    });
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);
  const [productSuccess, setProductSuccess] = useState<string | null>(null);
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);
  const [isProductSubmitting, setIsProductSubmitting] = useState(false);
  const [isSlugEdited, setIsSlugEdited] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const data = await getCategories();

        if (isMounted) {
          setCategories(data);
          setProductForm((form) => ({
            ...form,
            categoryId: form.categoryId || data[0]?.id || "",
          }));
        }
      } catch {
        if (isMounted) {
          setProductError("Nie udało się pobrać kategorii produktów.");
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setIsProductsLoading(true);
        setProductError(null);

        const response = await getProducts({
          page: productPage,
          limit: productsPerPage,
          search: productSearch.trim() || undefined,
          sort: PRODUCT_SORT.NEWEST,
        });

        if (isMounted) {
          setProducts(response.data);
          setProductPaginationMeta(response.meta);
        }
      } catch {
        if (isMounted) {
          setProductError("Nie udało się pobrać produktów.");
        }
      } finally {
        if (isMounted) {
          setIsProductsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [productPage, productRefreshKey, productSearch]);

  const refreshProducts = () => {
    setProductRefreshKey((key) => key + 1);
  };

  const updateProductForm = (
    field: keyof typeof initialProductForm,
    value: string,
  ) => {
    setProductForm((form) => ({
      ...form,
      [field]: value,
    }));
  };

  const handleNameChange = (name: string) => {
    setProductForm((form) => ({
      ...form,
      name,
      slug: isSlugEdited ? form.slug : slugify(name),
    }));
  };

  const handleSlugChange = (slug: string) => {
    setIsSlugEdited(true);
    updateProductForm("slug", slug);
  };

  const resetProductForm = () => {
    setProductForm({
      ...initialProductForm,
      categoryId: categories[0]?.id || "",
    });
    setEditingProductId(null);
    setIsSlugEdited(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setIsSlugEdited(true);
    setProductError(null);
    setProductSuccess(null);
    setProductForm({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      imageUrl: product.image_url || "",
      price: String(product.price),
      stock: String(product.stock),
      categoryId: product.category_id,
    });
  };

  const handleCreateProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsProductSubmitting(true);
    setProductError(null);
    setProductSuccess(null);

    try {
      const result = productFormSchema.safeParse(productForm);

      if (!result.success) {
        setProductError(getFirstZodError(result.error));
        return;
      }

      if (editingProductId) {
        await updateProduct(editingProductId, result.data);
      } else {
        await createProduct(result.data);
      }

      resetProductForm();
      refreshProducts();
      setProductSuccess(
        editingProductId
          ? "Produkt został zaktualizowany."
          : "Produkt został dodany.",
      );
    } catch {
      setProductError(
        "Nie udało się zapisać produktu. Sprawdź dane formularza.",
      );
    } finally {
      setIsProductSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const previousProducts = products;
    const previousPaginationMeta = productPaginationMeta;

    setPendingProductId(productId);
    setProductError(null);
    setProductSuccess(null);
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productId),
    );
    setProductPaginationMeta((meta) => ({
      ...meta,
      total: Math.max(0, meta.total - 1),
      totalPages: Math.max(
        1,
        Math.ceil(Math.max(0, meta.total - 1) / meta.limit),
      ),
    }));

    try {
      await deleteProduct(productId);

      if (editingProductId === productId) {
        resetProductForm();
      }
    } catch {
      setProducts(previousProducts);
      setProductPaginationMeta(previousPaginationMeta);
      setProductError("Nie udało się usunąć produktu.");
    } finally {
      setPendingProductId(null);
    }
  };

  return (
    <>
      <section className="border-hairline border-border bg-surface p-4 shadow-cyan">
        <div className="mb-4 border-b border-border pb-4">
          <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
            {"// nowy produkt"}
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-text-bright">
            {editingProductId ? "Edytuj produkt" : "Dodaj produkt"}
          </h2>
          <p className="mt-2 text-caption text-muted-foreground">
            Formularz tworzy produkt z ceną, stanem magazynowym i adresem
            zdjęcia.
          </p>
        </div>

        {productError ? (
          <div className="mb-4 border border-amber bg-amber-bg p-3 text-sm text-amber">
            {productError}
          </div>
        ) : null}

        {productSuccess ? (
          <div className="mb-4 border border-green bg-green-bg p-3 text-sm text-green">
            {productSuccess}
          </div>
        ) : null}

        <form className="grid gap-4 lg:grid-cols-2" onSubmit={handleCreateProduct}>
          <div className="space-y-2">
            <Label
              className="font-mono uppercase tracking-[0.12em] text-cyan"
              htmlFor="product-name"
            >
              Nazwa
            </Label>
            <Input
              className="border-border bg-base text-text-bright focus-visible:border-cyan focus-visible:ring-cyan/30"
              id="product-name"
              minLength={3}
              onChange={(event) => handleNameChange(event.target.value)}
              required
              value={productForm.name}
            />
          </div>

          <div className="space-y-2">
            <Label
              className="font-mono uppercase tracking-[0.12em] text-cyan"
              htmlFor="product-slug"
            >
              Slug
            </Label>
            <Input
              className="border-border bg-base text-text-bright focus-visible:border-cyan focus-visible:ring-cyan/30"
              id="product-slug"
              onChange={(event) => handleSlugChange(event.target.value)}
              required
              value={productForm.slug}
            />
          </div>

          <div className="space-y-2">
            <Label
              className="font-mono uppercase tracking-[0.12em] text-cyan"
              htmlFor="product-category"
            >
              Kategoria
            </Label>
            <Select
              onValueChange={(value) => updateProductForm("categoryId", value)}
              value={productForm.categoryId}
            >
              <SelectTrigger
                className="border-border bg-base text-text-bright focus-visible:border-cyan focus-visible:ring-cyan/30"
                id="product-category"
              >
                <SelectValue placeholder="Wybierz kategorię" />
              </SelectTrigger>
              <SelectContent className="border-border bg-surface text-text">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label
                className="font-mono uppercase tracking-[0.12em] text-cyan"
                htmlFor="product-price"
              >
                Cena
              </Label>
              <Input
                className="border-border bg-base text-text-bright focus-visible:border-cyan focus-visible:ring-cyan/30"
                id="product-price"
                min="0"
                onChange={(event) => updateProductForm("price", event.target.value)}
                required
                step="0.01"
                type="number"
                value={productForm.price}
              />
            </div>

            <div className="space-y-2">
              <Label
                className="font-mono uppercase tracking-[0.12em] text-cyan"
                htmlFor="product-stock"
              >
                Stan
              </Label>
              <Input
                className="border-border bg-base text-text-bright focus-visible:border-cyan focus-visible:ring-cyan/30"
                id="product-stock"
                min="0"
                onChange={(event) => updateProductForm("stock", event.target.value)}
                required
                step="1"
                type="number"
                value={productForm.stock}
              />
            </div>
          </div>

          <div className="space-y-2 lg:col-span-2">
            <Label
              className="font-mono uppercase tracking-[0.12em] text-cyan"
              htmlFor="product-image"
            >
              URL zdjęcia
            </Label>
            <Input
              className="border-border bg-base text-text-bright focus-visible:border-cyan focus-visible:ring-cyan/30"
              id="product-image"
              onChange={(event) => updateProductForm("imageUrl", event.target.value)}
              placeholder="https://..."
              type="url"
              value={productForm.imageUrl}
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <Label
              className="font-mono uppercase tracking-[0.12em] text-cyan"
              htmlFor="product-description"
            >
              Opis
            </Label>
            <Textarea
              className="min-h-28 border-border bg-base text-text-bright focus-visible:border-cyan focus-visible:ring-cyan/30"
              id="product-description"
              onChange={(event) =>
                updateProductForm("description", event.target.value)
              }
              value={productForm.description}
            />
          </div>

          <div className="lg:col-span-2">
            <Button
              className="w-full bg-cyan text-black hover:bg-cyan-dim sm:w-auto"
              disabled={isProductSubmitting || categories.length === 0}
              type="submit"
            >
              {isProductSubmitting
                ? "Zapisywanie..."
                : editingProductId
                  ? "Zapisz produkt"
                  : "Dodaj produkt"}
            </Button>
            {editingProductId ? (
              <Button
                className="mt-3 w-full border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan sm:ml-3 sm:mt-0 sm:w-auto"
                onClick={resetProductForm}
                type="button"
                variant="outline"
              >
                Anuluj edycję
                <X />
              </Button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="mt-6 border-hairline border-border bg-surface p-4 shadow-cyan">
        <div className="mb-4 flex flex-col gap-3 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
              {"// katalog"}
            </p>
            <p className="mt-2 text-caption text-muted-foreground">
              Łącznie: {productPaginationMeta.total} produktów. Strona{" "}
              {productPaginationMeta.page} z {productPaginationMeta.totalPages}.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <MagnifyingGlass
                className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan"
                size={18}
              />
              <Input
                className="h-11 border-border bg-base pl-10 text-text-bright placeholder:text-muted-foreground focus-visible:border-cyan focus-visible:ring-cyan/30"
                onChange={(event) => {
                  setProductSearch(event.target.value);
                  setProductPage(1);
                }}
                placeholder="Szukaj produktu"
                value={productSearch}
              />
            </div>
            <Button
              className="border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
              disabled={isProductsLoading}
              onClick={refreshProducts}
              type="button"
              variant="outline"
            >
              Odśwież
              <ArrowsClockwise />
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-cyan">Zdjęcie</TableHead>
              <TableHead className="text-cyan">Produkt</TableHead>
              <TableHead className="text-cyan">Kategoria</TableHead>
              <TableHead className="text-cyan">Cena</TableHead>
              <TableHead className="text-cyan">Stan</TableHead>
              <TableHead className="text-right text-cyan">Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isProductsLoading ? (
              <TableRow className="border-border">
                <TableCell
                  className="py-8 text-center text-muted-foreground"
                  colSpan={6}
                >
                  Ładowanie produktów...
                </TableCell>
              </TableRow>
            ) : null}

            {!isProductsLoading && products.length === 0 ? (
              <TableRow className="border-border">
                <TableCell
                  className="py-8 text-center text-muted-foreground"
                  colSpan={6}
                >
                  Brak produktów pasujących do wyszukiwania.
                </TableCell>
              </TableRow>
            ) : null}

            {!isProductsLoading
              ? products.map((product) => {
                  const isPending = pendingProductId === product.id;

                  return (
                    <TableRow className="border-border" key={product.id}>
                      <TableCell>
                        <div
                          aria-label={product.name}
                          className="h-12 w-16 border-hairline border-border bg-elevated bg-cover bg-center"
                          role="img"
                          style={
                            product.image_url
                              ? {
                                  backgroundImage: `url(${product.image_url})`,
                                }
                              : undefined
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <p className="font-display text-base font-bold text-text-bright">
                          {product.name}
                        </p>
                        <p className="font-mono text-label text-muted-foreground">
                          /{product.slug}
                        </p>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.category?.name ?? product.category_id}
                      </TableCell>
                      <TableCell className="font-mono font-bold text-cyan">
                        {formatPrice(product.price)}
                      </TableCell>
                      <TableCell className="text-text-bright">
                        {product.stock}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            aria-label="Edytuj produkt"
                            className="border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
                            disabled={isPending}
                            onClick={() => handleEditProduct(product)}
                            size="icon"
                            type="button"
                            variant="outline"
                          >
                            <PencilSimple />
                          </Button>
                          <ConfirmDialog
                            confirmLabel="Usuń produkt"
                            description="Produkt zostanie ukryty w katalogu i nie będzie dostępny dla klientów."
                            isPending={isPending}
                            title="Usunąć produkt?"
                            onConfirm={() => handleDeleteProduct(product.id)}
                          >
                            <Button
                              aria-label="Usuń produkt"
                              className="border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
                              disabled={isPending}
                              size="icon"
                              type="button"
                              variant="outline"
                            >
                              <Trash />
                            </Button>
                          </ConfirmDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              : null}
          </TableBody>
        </Table>

        {!isProductsLoading && productPaginationMeta.totalPages > 1 ? (
          <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-caption text-muted-foreground">
              Strona {productPaginationMeta.page} z{" "}
              {productPaginationMeta.totalPages}. Łącznie:{" "}
              {productPaginationMeta.total} produktów.
            </p>
            <Pagination className="mx-0 w-auto justify-start sm:justify-end">
              <PaginationContent className="flex-wrap gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    className="border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setProductPage((page) => Math.max(1, page - 1));
                    }}
                    text="Poprzednia"
                  />
                </PaginationItem>
                {Array.from({
                  length: productPaginationMeta.totalPages,
                }).map((_, index) => {
                  const page = index + 1;

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        className={
                          productPaginationMeta.page === page
                            ? "border-cyan bg-cyan text-black hover:bg-cyan-dim"
                            : "border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
                        }
                        href="#"
                        isActive={productPaginationMeta.page === page}
                        onClick={(event) => {
                          event.preventDefault();
                          setProductPage(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    className="border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setProductPage((page) =>
                        Math.min(productPaginationMeta.totalPages, page + 1),
                      );
                    }}
                    text="Następna"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        ) : null}
      </section>
    </>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
