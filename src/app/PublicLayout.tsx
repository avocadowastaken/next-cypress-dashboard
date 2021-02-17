import { AppBar, Container, Grid, Toolbar } from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
import NextLink from "next/link";
import { ReactElement, ReactNode } from "react";

export interface PublicLayoutProps {
  children?: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps): ReactElement {
  return (
    <>
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
