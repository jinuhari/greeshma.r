import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { SanityProvider } from "../sanity/provider";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Not found</p>
        <h1 className="editorial-h mt-4 text-6xl">404</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          This page has quietly stepped out of the exhibition.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center border-b border-foreground pb-1 text-sm tracking-wide hover:border-accent hover:text-accent"
        >
          Return to the gallery
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Something interrupted the exhibit</p>
        <h1 className="editorial-h mt-4 text-4xl">Please try again</h1>
        <div className="mt-8 flex justify-center gap-6 text-sm">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="border-b border-foreground pb-1 hover:border-accent hover:text-accent"
          >
            Reload
          </button>
          <a href="/" className="border-b border-foreground pb-1 hover:border-accent hover:text-accent">
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Greeshma R — Product Designer, Visual Designer & Illustrator" },
      {
        name: "description",
        content:
          "A digital exhibition by Greeshma R — designing thoughtful digital products through research, visual storytelling, and craft.",
      },
      { name: "author", content: "Greeshma R" },
      { property: "og:title", content: "Greeshma R — A Digital Exhibition" },
      {
        property: "og:description",
        content:
          "Product design, visual design, illustration and research by Greeshma R.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>G</text></svg>" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SanityProvider>
        <Outlet />
      </SanityProvider>
    </QueryClientProvider>
  );
}
