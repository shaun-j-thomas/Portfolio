"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    goatcounter?: {
      endpoint?: string;
      no_onload?: boolean;
      allow_local?: boolean;
      count?: (vars?: { path?: string; title?: string; event?: boolean }) => void;
    };
  }
}

export function GoatCounter() {
  const pathname = usePathname();

  useEffect(() => {
    // Set global goatcounter configuration before or after script loads
    if (typeof window !== "undefined") {
      window.goatcounter = window.goatcounter || {};
      window.goatcounter.endpoint = "https://shaunjthomas.goatcounter.com/count";

      // Trigger count on client-side route changes
      if (typeof window.goatcounter.count === "function") {
        window.goatcounter.count({
          path: pathname,
        });
      }
    }
  }, [pathname]);

  return (
    <>
      <Script
        id="goatcounter-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.goatcounter = window.goatcounter || {};
            window.goatcounter.endpoint = 'https://shaunjthomas.goatcounter.com/count';
          `,
        }}
      />
      <Script
        id="goatcounter-script"
        src="https://gc.zgo.at/count.js"
        strategy="afterInteractive"
        data-goatcounter="https://shaunjthomas.goatcounter.com/count"
      />
    </>
  );
}
