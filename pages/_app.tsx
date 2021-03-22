import { requestJSON } from "@/core/data/Http";
import {
  AppRouterProgressIndicator,
  AppRouterStateProvider,
} from "@/core/routing/AppRouterState";
import { AppThemeProvider } from "@/core/theme/AppThemeProvider";
import { AppProps } from "next/app";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 10 * 1000,
      cacheTime: 10 * 60 * 1000,
      async queryFn({ queryKey }) {
        return requestJSON(queryKey[0]);
      },
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppThemeProvider>
      <AppRouterStateProvider>
        <QueryClientProvider client={queryClient}>
          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools position="bottom-right" />
          )}

          <AppRouterProgressIndicator />

          <Component {...pageProps} />
        </QueryClientProvider>
      </AppRouterStateProvider>
    </AppThemeProvider>
  );
}
