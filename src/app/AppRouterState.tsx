import { Collapse, LinearProgress } from "@material-ui/core";
import { Router } from "next/router";
import React, {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type AppRouterState = "unknown" | "navigated" | "navigating";

const context = createContext<AppRouterState>("unknown");

export function useAppRouterState(): AppRouterState {
  return useContext(context);
}

export interface AppRouterStateProviderProps {
  children?: ReactNode;
}

export function AppRouterStateProvider({
  children,
}: AppRouterStateProviderProps): ReactElement {
  const [state, setState] = useState<AppRouterState>("unknown");

  useEffect(() => {
    function startAnimation() {
      setState("navigating");
    }

    function finishAnimation() {
      setState("navigated");
    }

    Router.events.on("routeChangeStart", startAnimation);
    Router.events.on("routeChangeComplete", finishAnimation);
    Router.events.on("routeChangeError", finishAnimation);

    return () => {
      Router.events.off("routeChangeStart", startAnimation);
      Router.events.off("routeChangeComplete", finishAnimation);
      Router.events.off("routeChangeError", finishAnimation);
    };
  }, []);

  return <context.Provider value={state}>{children}</context.Provider>;
}

export function AppRouterProgressIndicator() {
  const routerState = useAppRouterState();

  return (
    <Collapse in={routerState === "navigating"} unmountOnExit={true}>
      <LinearProgress color="primary" />
    </Collapse>
  );
}
