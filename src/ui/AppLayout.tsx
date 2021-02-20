import {
  AppBar,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Grid,
  Link,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Head from "next/head";
import NextLink from "next/link";
import React, { ReactElement, ReactNode, useMemo } from "react";

export interface AppTitleProps {
  breadcrumbs: Array<string | [label: string, href: string]>;
}

export function AppTitle({ breadcrumbs }: AppTitleProps) {
  const documentTitle = useMemo(
    () =>
      [
        "Dashboard",
        ...breadcrumbs.map((breadcrumb) =>
          typeof breadcrumb == "string" ? breadcrumb : breadcrumb[0]
        ),
      ].join(" – "),
    [breadcrumbs]
  );

  return (
    <Head>
      <title>{documentTitle}</title>
    </Head>
  );
}

export function AppBreadcrumb({ breadcrumbs }: AppTitleProps): ReactElement {
  return (
    <Breadcrumbs>
      {breadcrumbs.map((breadcrumb, idx) => {
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
            <Link
              color={idx === breadcrumbs.length - 1 ? "primary" : "inherit"}
            >
              {title}
            </Link>
          </NextLink>
        );
      })}
    </Breadcrumbs>
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
  return (
    <>
      <AppTitle breadcrumbs={breadcrumbs} />

      <AppBar position="sticky">
        <Toolbar>
          <Grid container={true} spacing={1} justifyContent="flex-end">
            <Grid item={true}>
              <NextLink passHref={true} href="/docs">
                <Button color="inherit">Docs</Button>
              </NextLink>
            </Grid>

            <Grid item={true}>
              <NextLink
                passHref={true}
                href={{
                  pathname: "/api/auth/signout",
                  query: { callbackUrl: "/" },
                }}
              >
                <Button color="inherit">Sign Out</Button>
              </NextLink>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <Container maxWidth={maxWidth}>
        <Box paddingY={2}>
          <Grid container={true} spacing={1} alignItems="center">
            <Grid item={true}>
              <AppBreadcrumb breadcrumbs={breadcrumbs} />
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
