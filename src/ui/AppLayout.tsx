import {
  AppBar,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Fade,
  Grid,
  LinearProgress,
  Link,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Head from "next/head";
import NextLink from "next/link";
import { Router } from "next/router";
import React, { ReactNode, useEffect, useMemo, useState } from "react";

interface AppTitleProps {
  breadcrumbs: Array<string | [label: string, href: string]>;
}

export function AppTitle({ breadcrumbs }: AppTitleProps) {
  const documentTitle = useMemo(
    () =>
      [
        "Dashboard",
        ...breadcrumbs.map(([breadcrumbTitle]) => breadcrumbTitle),
      ].join(" - "),
    [breadcrumbs]
  );

  return (
    <Head>
      <title>{documentTitle}</title>
    </Head>
  );
}

export interface LayoutProps extends AppTitleProps {
  actions?: ReactNode;
  children?: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
}

export function AppLayout({
  actions,
  children,
  maxWidth = "md",
  breadcrumbs = [],
}: LayoutProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    function startAnimation() {
      setIsLoading(true);
    }

    function finishAnimation() {
      setIsLoading(false);
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

  return (
    <>
      <AppTitle breadcrumbs={breadcrumbs} />

      <AppBar position="sticky">
        <Toolbar>
          <Grid container={true} justifyContent="flex-end">
            <Grid item={true}>
              <NextLink
                href={{
                  pathname: "/api/auth/signout",
                  query: { callbackUrl: "/" },
                }}
                passHref={true}
              >
                <Button color="inherit">Sign Out</Button>
              </NextLink>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <Fade in={isLoading}>
        <LinearProgress color="secondary" />
      </Fade>

      <Container maxWidth={maxWidth}>
        <Box paddingY={2}>
          <Grid container={true} spacing={1} alignItems="center">
            <Grid item={true}>
              <Breadcrumbs maxItems={3}>
                <NextLink href="/" passHref={true}>
                  <Link color="inherit">Home</Link>
                </NextLink>

                {breadcrumbs.map((breadcrumb) => {
                  if (typeof breadcrumb == "string") {
                    return (
                      <Typography key={breadcrumb} color="textPrimary">
                        {breadcrumb}
                      </Typography>
                    );
                  }

                  const [title, href] = breadcrumb;

                  return (
                    <NextLink key={title} href={href} passHref={true}>
                      <Link color="inherit">{title}</Link>
                    </NextLink>
                  );
                })}
              </Breadcrumbs>
            </Grid>

            <Grid item={true} xs={true} />

            {!!actions && <Grid item={true}>{actions}</Grid>}
          </Grid>
        </Box>

        {children}
      </Container>
    </>
  );
}
