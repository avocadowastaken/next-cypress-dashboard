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
import React, { ReactNode, useMemo } from "react";

interface AppTitleProps {
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

      <Container maxWidth={maxWidth}>
        <Box paddingY={2}>
          <Grid container={true} spacing={1} alignItems="center">
            <Grid item={true}>
              <Breadcrumbs maxItems={3} separator="–">
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
