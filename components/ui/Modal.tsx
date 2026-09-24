"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CloseIcon } from "@/components/icons";

/** Native <dialog> modal: focus trapping, Escape-to-close and top-layer come for free. */
export function Modal({
  open,
  onClose,
  labelledBy,
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={(event) => {
        // Clicking the backdrop (the dialog element itself) closes it.
        if (event.target === ref.current) onClose();
      }}
      className={cn(
        "fixed inset-0 m-auto h-fit max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-lg p-0 shadow-2xl backdrop:bg-black/60",
        className,
      )}
    >
      <div className="relative p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded p-2 text-current opacity-80 hover:opacity-100"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
        {children}
      </div>
    </dialog>
  );
}
