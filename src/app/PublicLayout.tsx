import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
} from "@material-ui/core";
import Head from "next/head";
import NextLink from "next/link";
import React, { ReactElement, ReactNode } from "react";
import { AppBreadcrumb, AppTitleProps } from "./AppLayout";

export interface PublicLayoutProps {
  title?: string;
  action?: ReactNode;
  children?: ReactNode;
  breadcrumbs?: AppTitleProps["breadcrumbs"];
}

export function PublicLayout({
  title,
  action,
  children,
  breadcrumbs,
}: PublicLayoutProps): ReactElement {
  return (
    <>
      {!!title && (
        <Head>
          <title>{title}</title>
        </Head>
      )}

      <AppBar position="sticky">
        <Toolbar>
          <Grid container={true} spacing={1} justifyContent="flex-end">
            {!!action && <Grid item={true}>{action}</Grid>}

            <Grid item={true}>
              <NextLink href="/app" passHref={true}>
                <Button color="inherit">Dashboard</Button>
              </NextLink>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm">
        <Grid container={true} spacing={1}>
          {!!breadcrumbs && (
            <Grid item={true} xs={12}>
              <Box paddingY={2}>
                <AppBreadcrumb breadcrumbs={breadcrumbs} />
              </Box>
            </Grid>
          )}

          <Grid item={true} xs={12}>
            {children}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
