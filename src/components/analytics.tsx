"use client";

import { emitEvent } from "@/lib/firebase";
import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    emitEvent({
      event: "web_vitals",
      data: {
        ...metric,
      },
    });
  });
  return null;
}
