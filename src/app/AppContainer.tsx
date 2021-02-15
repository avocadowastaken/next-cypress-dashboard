import { AppThemeProvider } from "@/app/AppThemeProvider";
import { ReactElement, ReactNode } from "react";
import { cache, ConfigInterface, SWRConfig } from "swr";

const swrConfig: ConfigInterface<unknown, Error, (url: string) => unknown> = {
  shouldRetryOnError: false,

  revalidateOnFocus: false,
  revalidateOnReconnect: false,

  fetcher: (url: string) =>
    fetch(url).then((response) => {
      if (!response.ok) {
        return Promise.reject(
          new Error(
            `Failed to load resource: the server responded with a status of ${response.status} (${response.statusText})`
          )
        );
      }

      return response.json();
    }),
};

if (process.browser && process.env.NODE_ENV === "development") {
  globalThis["__swr"] = cache;
}

export interface AppContainerProps {
  children?: ReactNode;
}

export function AppContainer({ children }: AppContainerProps): ReactElement {
  return (
    <AppThemeProvider>
      <SWRConfig value={swrConfig}>{children}</SWRConfig>
    </AppThemeProvider>
  );
}
