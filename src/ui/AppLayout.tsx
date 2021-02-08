import { SignOutDialog } from "@/ui/SignOutDialog";
import {
  AppBar,
  Box,
  Button,
  Collapse,
  Container,
  Grid,
  LinearProgress,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState } from "react";

export interface LayoutProps {
  title?: ReactNode;
  backButton?: ReactNode;
  actions?: ReactNode;

  children?: ReactNode;
}

export function AppLayout({
  children,
  title,
  backButton,
  actions,
}: LayoutProps) {
  const route = useRouter();
  const [session, isSessionLoading] = useSession();
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);

  useEffect(() => {
    if (!session && !isSessionLoading) {
      void signIn();
    }
  }, [session, isSessionLoading]);

  return (
    <>
      <SignOutDialog
        open={isSignOutDialogOpen}
        onClose={() => {
          setIsSignOutDialogOpen(false);
        }}
      />

      <AppBar position="sticky">
        <Toolbar>
          <Grid container={true} justifyContent="flex-end">
            <Grid item={true}>
              <Button
                color="inherit"
                disabled={isSessionLoading}
                onClick={() => {
                  setIsSignOutDialogOpen(true);
                }}
              >
                Sign Out
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <Collapse in={!session}>
        <LinearProgress color="secondary" />
      </Collapse>

      {!!session && (
        <Container maxWidth="md">
          <Box paddingY={2}>
            <Grid container={true} spacing={1} alignItems="center">
              {!!backButton && <Grid item={true}>{backButton}</Grid>}
              {!!title && (
                <Grid item={true}>
                  <Typography variant="h5">Add Project</Typography>
                </Grid>
              )}

              <Grid item={true} xs={true} />

              {!!actions && <Grid item={true}>{actions}</Grid>}
            </Grid>
          </Box>

          {children}
        </Container>
      )}
    </>
  );
}
