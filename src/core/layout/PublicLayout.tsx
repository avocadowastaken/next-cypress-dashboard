import { Inline } from "@/core/layout/Inline";
import {
  AppBar,
  Button,
  Container,
  ContainerProps,
  Toolbar,
} from "@material-ui/core";
import Head from "next/head";
import NextLink from "next/link";
import React, { ReactElement, ReactNode } from "react";

export interface PublicLayoutProps {
  title?: string;
  action?: ReactNode;
  children?: ReactNode;
  maxWidth?: ContainerProps["maxWidth"];
}

export function PublicLayout({
  title,
  action,
  children,
  maxWidth = "sm",
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
          <Inline justifyContent="flex-end">
            {!!action && action}

            <NextLink href="/projects" passHref={true}>
              <Button color="inherit">Dashboard</Button>
            </NextLink>
          </Inline>
        </Toolbar>
      </AppBar>

      <Container maxWidth={maxWidth}>{children}</Container>
    </>
  );
}
