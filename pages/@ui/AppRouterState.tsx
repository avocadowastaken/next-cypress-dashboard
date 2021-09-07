import { Collapse, LinearProgress } from "@mui/material";
import { Router } from "next/router";
import React, {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useIsFetching } from "react-query";

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
  const fetchingCount = useIsFetching();
  const routerState = useAppRouterState();

  return (
    <Collapse
      in={routerState === "navigating" || fetchingCount > 0}
      unmountOnExit={true}
      style={{
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2000,
        position: "fixed",
      }}
    >
      <LinearProgress color="primary" />
    </Collapse>
  );
}
