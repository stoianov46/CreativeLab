"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cl-announcement-dismissed";

export function AnnouncementBar({ text, dismissLabel }: { text: string; dismissLabel: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // sessionStorage isn't available during SSR/initial render, so reading
    // dismissal state has to happen post-mount rather than during render.
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (sessionStorage.getItem(STORAGE_KEY) !== "1") setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="relative flex items-center justify-center gap-4 bg-olive px-5 py-2.5 text-center text-xs text-text-inverse">
      <p>{text}</p>
      <button
        type="button"
        aria-label={dismissLabel}
        className="absolute end-4 text-text-inverse-secondary hover:text-text-inverse"
        onClick={() => {
          setVisible(false);
          try {
            sessionStorage.setItem(STORAGE_KEY, "1");
          } catch {
            // ignore storage failures (private browsing, etc.)
          }
        }}
      >
        ✕
      </button>
    </div>
  );
}
