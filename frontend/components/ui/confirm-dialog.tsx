"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ConfirmDialogProps {
  children: React.ReactNode;
  confirmLabel?: string;
  description: string;
  isPending?: boolean;
  title: string;
  onConfirm: () => void | Promise<void>;
}

export default function ConfirmDialog({
  children,
  confirmLabel = "Potwierdź",
  description,
  isPending = false,
  title,
  onConfirm,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    await onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="border border-border bg-surface text-text-bright shadow-cyan">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            className="border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
            disabled={isPending}
            onClick={() => setOpen(false)}
            type="button"
            variant="outline"
          >
            Anuluj
          </Button>
          <Button
            className="bg-red-500 text-white hover:bg-red-600"
            disabled={isPending}
            onClick={() => void handleConfirm()}
            type="button"
          >
            {isPending ? "Usuwanie..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
