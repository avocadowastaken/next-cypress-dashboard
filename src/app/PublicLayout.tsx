import { AppBar, Container, Grid, Toolbar } from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
import Head from "next/head";
import NextLink from "next/link";
import React, { ReactElement, ReactNode } from "react";

export interface PublicLayoutProps {
  title?: string;
  children?: ReactNode;
}

export function PublicLayout({
  title,
  children,
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
          <Grid container={true} justifyContent="flex-end">
            <Grid item={true}>
              <NextLink href="/app" passHref={true}>
                <LoadingButton color="inherit">Dashboard</LoadingButton>
              </NextLink>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm">{children}</Container>
    </>
  );
}
