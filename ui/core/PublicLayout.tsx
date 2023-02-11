import { AppBar, Button, ContainerProps, Stack, Toolbar } from "@mui/material";
import Head from "next/head";
import NextLink from "next/link";
import { ReactElement, ReactNode } from "react";
import { AppLayoutContent } from "./AppLayout";

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
          <Stack
            spacing={1}
            width="100%"
            direction="row"
            justifyContent="flex-end"
          >
            {!!action && action}

            <NextLink href="/projects" passHref={true}>
              <Button color="inherit">Dashboard</Button>
            </NextLink>
          </Stack>
        </Toolbar>
      </AppBar>

      <AppLayoutContent {...props} maxWidth={maxWidth} />
    </>
  );
}
