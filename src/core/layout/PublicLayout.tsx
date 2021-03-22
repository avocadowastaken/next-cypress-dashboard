import { AppLayoutContent } from "@/core/layout/AppLayout";
import { Inline } from "@/core/layout/Inline";
import { AppBar, Button, ContainerProps, Toolbar } from "@material-ui/core";
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
  maxWidth = "sm",
  ...props
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

      <AppLayoutContent {...props} maxWidth={maxWidth} />
    </>
  );
}
