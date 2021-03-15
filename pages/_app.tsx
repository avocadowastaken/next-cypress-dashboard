import { requestJSON } from "@/core/data/Http";
import {
  AppRouterProgressIndicator,
  AppRouterStateProvider,
} from "@/core/routing/AppRouterState";
import { AppThemeProvider } from "@/core/theme/AppThemeProvider";
import { AppProps } from "next/app";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
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
          <AppRouterProgressIndicator />

          <Component {...pageProps} />
        </QueryClientProvider>
      </AppRouterStateProvider>
    </AppThemeProvider>
  );
}
