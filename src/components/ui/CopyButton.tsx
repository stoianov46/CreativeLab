"use client";

import { useState } from "react";

/** Copies `value` to the clipboard; the label switches to `doneLabel` for 2 s. */
export function CopyButton({ value, label, doneLabel }: { value: string; label: string; doneLabel: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="ms-3 border border-line px-2.5 py-1 text-xs text-text-secondary hover:text-accent"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        } catch {
          /* clipboard unavailable: the number stays visible and selectable */
        }
      }}
    >
      <span aria-live="polite">{done ? doneLabel : label}</span>
    </button>
  );
}
