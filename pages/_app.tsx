import {
  AppRouterProgressIndicator,
  AppRouterStateProvider,
} from "@/core/routing/AppRouterState";
import { AppThemeProvider } from "@/core/theme/AppThemeProvider";
import { AppProps } from "next/app";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { parse } from "superjson";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      async queryFn({ queryKey }) {
        const response = await fetch(queryKey[0]);
        const text = await response.text();

        if (response.status >= 200 && response.status < 300) {
          return parse(text);
        }

        throw new Error(response.statusText);
      },
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppThemeProvider>
      <AppRouterStateProvider>
        <QueryClientProvider client={queryClient}>
          <AppRouterProgressIndicator />

          <Component {...pageProps} />
        </QueryClientProvider>
      </AppRouterStateProvider>
    </AppThemeProvider>
  );
}
