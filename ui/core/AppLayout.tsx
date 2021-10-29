import {
  Alert,
  AppBar,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Link,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement, ReactNode, useMemo } from "react";

export interface AppTitleProps {
  breadcrumbs?: Array<string | [label: string, href: string]>;
}

export function AppTitle({ breadcrumbs = [] }: AppTitleProps) {
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

export function AppBreadcrumb({
  breadcrumbs = [],
}: AppTitleProps): ReactElement {
  return (
    <Breadcrumbs>
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
  );
}

export interface AppLayoutContentProps extends AppTitleProps {
  actions?: ReactNode;
  children?: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
}

export function AppLayoutContent({
  actions,
  children,
  maxWidth = "md",
  breadcrumbs = [],
}: AppLayoutContentProps) {
  const router = useRouter();

  return (
    <Container maxWidth={maxWidth}>
      <Box paddingY={2}>
        <Stack
          spacing={1}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <AppBreadcrumb breadcrumbs={breadcrumbs} />

          {!!actions && actions}
        </Stack>
      </Box>

      <Stack spacing={2}>
        {!!router.query["error"] && (
          <Alert
            severity="error"
            action={
              <NextLink
                href={{
                  pathname: router.pathname,
                  query: { ...router.query, error: [] },
                }}
              >
                <Button color="inherit">Close</Button>
              </NextLink>
            }
          >
            {router.query["error"]}
          </Alert>
        )}

        {!!router.query["success"] && (
          <Alert
            severity="success"
            action={
              <NextLink
                href={{
                  pathname: router.pathname,
                  query: { ...router.query, success: [] },
                }}
              >
                <Button color="inherit">Close</Button>
              </NextLink>
            }
          >
            {router.query["success"]}
          </Alert>
        )}

        <div>{children}</div>
      </Stack>
    </Container>
  );
}

export interface LayoutProps extends AppTitleProps, AppLayoutContentProps {}

export function AppLayout({ breadcrumbs, ...props }: LayoutProps) {
  return (
    <>
      <AppTitle breadcrumbs={breadcrumbs} />

      <AppBar position="sticky">
        <Toolbar>
          <Stack
            spacing={1}
            width="100%"
            direction="row"
            justifyContent="flex-end"
          >
            <NextLink passHref={true} href="/docs">
              <Button color="inherit">Docs</Button>
            </NextLink>

            <form method="post" action="/api/auth/destroy">
              <Button type="submit" color="inherit">
                Sign Out
              </Button>
            </form>
          </Stack>
        </Toolbar>
      </AppBar>

      <AppLayoutContent {...props} breadcrumbs={breadcrumbs} />
    </>
  );
}
