import { AppRouterStateProvider } from "@/app/AppRouterState";
import { AppThemeProvider } from "@/app/AppThemeProvider";
import { ReactElement, ReactNode } from "react";

export interface AppContainerProps {
  children?: ReactNode;
}

export function AppContainer({ children }: AppContainerProps): ReactElement {
  return (
    <AppThemeProvider>
      <AppRouterStateProvider>{children}</AppRouterStateProvider>
    </AppThemeProvider>
  );
}
