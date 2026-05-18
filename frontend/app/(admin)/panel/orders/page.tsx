"use client";

import { ArrowsClockwise, MagnifyingGlass, Trash } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
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
import {
  deleteOrder,
  getAllOrders,
  updateOrderStatus,
  type Order,
  type OrderStatus,
  type PaginationMeta,
} from "@/lib/api/orders";
import { orderStatusLabels, orderStatuses } from "@/lib/order-options";
import { formatPrice } from "@/lib/product-utils";

const ordersPerPage = 10;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    page: 1,
    limit: ordersPerPage,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getAllOrders({
          page: currentPage,
          limit: ordersPerPage,
          search: search.trim() || undefined,
        });

        if (isMounted) {
          setOrders(response.data);
          setPaginationMeta(response.meta);
        }
      } catch {
        if (isMounted) {
          setError("Nie udało się pobrać zamówień.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [currentPage, refreshKey, search]);

  const refreshOrders = () => {
    setRefreshKey((key) => key + 1);
  };

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    const previousOrders = orders;

    setPendingOrderId(orderId);
    setError(null);
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    );

    try {
      await updateOrderStatus(orderId, status);
    } catch {
      setOrders(previousOrders);
      setError("Nie udało się zaktualizować statusu zamówienia.");
    } finally {
      setPendingOrderId(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const previousOrders = orders;
    const previousPaginationMeta = paginationMeta;

    setPendingOrderId(orderId);
    setError(null);
    setOrders((currentOrders) =>
      currentOrders.filter((order) => order.id !== orderId),
    );
    setPaginationMeta((meta) => ({
      ...meta,
      total: Math.max(0, meta.total - 1),
      totalPages: Math.max(
        1,
        Math.ceil(Math.max(0, meta.total - 1) / meta.limit),
      ),
    }));

    try {
      await deleteOrder(orderId);
    } catch {
      setOrders(previousOrders);
      setPaginationMeta(previousPaginationMeta);
      setError("Nie udało się usunąć zamówienia.");
    } finally {
      setPendingOrderId(null);
    }
  };

  return (
    <>
      <section className="border-hairline border-border bg-surface p-4 shadow-cyan">
        <div className="mb-4 flex flex-col gap-3 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
              {"// zamówienia"}
            </p>
            <p className="mt-2 text-caption text-muted-foreground">
              Łącznie: {paginationMeta.total} zamówień. Strona{" "}
              {paginationMeta.page} z {paginationMeta.totalPages}.
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
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Szukaj po numerze zamówienia"
                value={search}
              />
            </div>
            <Button
              className="border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
              disabled={isLoading}
              onClick={refreshOrders}
              type="button"
              variant="outline"
            >
              Odśwież
              <ArrowsClockwise />
            </Button>
          </div>
        </div>

        {error ? (
          <div className="mb-4 border border-amber bg-amber-bg p-3 text-sm text-amber">
            {error}
          </div>
        ) : null}

        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-cyan">Numer</TableHead>
              <TableHead className="text-cyan">Klient</TableHead>
              <TableHead className="text-cyan">Data</TableHead>
              <TableHead className="text-cyan">Produkty</TableHead>
              <TableHead className="text-cyan">Kwota</TableHead>
              <TableHead className="text-cyan">Status</TableHead>
              <TableHead className="text-right text-cyan">Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="border-border">
                <TableCell
                  className="py-8 text-center text-muted-foreground"
                  colSpan={7}
                >
                  Ładowanie zamówień...
                </TableCell>
              </TableRow>
            ) : null}

            {!isLoading && orders.length === 0 ? (
              <TableRow className="border-border">
                <TableCell
                  className="py-8 text-center text-muted-foreground"
                  colSpan={7}
                >
                  Brak zamówień pasujących do wyszukiwania.
                </TableCell>
              </TableRow>
            ) : null}

            {!isLoading
              ? orders.map((order) => {
                  const isPending = pendingOrderId === order.id;
                  const totalItems = order.order_items.reduce(
                    (total, item) => total + item.quantity,
                    0,
                  );

                  return (
                    <TableRow className="border-border" key={order.id}>
                      <TableCell className="max-w-48 truncate font-mono text-text-bright">
                        {order.id}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {order.user?.email ?? "Brak danych"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("pl-PL")}
                      </TableCell>
                      <TableCell className="text-text-bright">
                        {totalItems}
                      </TableCell>
                      <TableCell className="font-mono font-bold text-cyan">
                        {formatPrice(String(order.total_price))}
                      </TableCell>
                      <TableCell>
                        <Select
                          disabled={isPending}
                          onValueChange={(value) =>
                            handleStatusChange(order.id, value as OrderStatus)
                          }
                          value={order.status}
                        >
                          <SelectTrigger className="w-40 border-border bg-base text-text-bright focus-visible:border-cyan focus-visible:ring-cyan/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-border bg-surface text-text">
                            {orderStatuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {orderStatusLabels[status]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            asChild
                            aria-label="Szczegóły zamówienia"
                            className="border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
                            size="sm"
                            variant="outline"
                          >
                            <Link href={`/panel/orders/${order.id}`}>
                              Szczegóły
                            </Link>
                          </Button>
                          <ConfirmDialog
                            confirmLabel="Usuń zamówienie"
                            description="Ta operacja usunie zamówienie z panelu. Dla zrealizowanych zamówień backend zablokuje usunięcie."
                            isPending={isPending}
                            title="Usunąć zamówienie?"
                            onConfirm={() => handleDeleteOrder(order.id)}
                          >
                            <Button
                              aria-label="Usuń zamówienie"
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

        {!isLoading && paginationMeta.totalPages > 1 ? (
          <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-caption text-muted-foreground">
              Strona {paginationMeta.page} z {paginationMeta.totalPages}.
              Łącznie: {paginationMeta.total} zamówień.
            </p>
            <Pagination className="mx-0 w-auto justify-start sm:justify-end">
              <PaginationContent className="flex-wrap gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    className="border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setCurrentPage((page) => Math.max(1, page - 1));
                    }}
                    text="Poprzednia"
                  />
                </PaginationItem>
                {Array.from({ length: paginationMeta.totalPages }).map(
                  (_, index) => {
                    const page = index + 1;

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          className={
                            paginationMeta.page === page
                              ? "border-cyan bg-cyan text-black hover:bg-cyan-dim"
                              : "border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
                          }
                          href="#"
                          isActive={paginationMeta.page === page}
                          onClick={(event) => {
                            event.preventDefault();
                            setCurrentPage(page);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  },
                )}
                <PaginationItem>
                  <PaginationNext
                    className="border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setCurrentPage((page) =>
                        Math.min(paginationMeta.totalPages, page + 1),
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
