import { LiveQueryProvider } from "@sanity/preview-kit";
import { client } from "./lib/client";
import type { ReactNode } from "react";

export function SanityProvider({ children, preview }: { children: ReactNode; preview?: boolean }) {
  if (!preview) return <>{children}</>;

  return (
    <LiveQueryProvider client={client} logger={console}>
      {children}
    </LiveQueryProvider>
  );
}
