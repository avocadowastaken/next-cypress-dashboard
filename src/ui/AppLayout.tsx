import { SignOutDialog } from "@/ui/SignOutDialog";
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React, { ReactNode, useState } from "react";

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
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);

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

      <Container maxWidth="md">
        <Box paddingY={2}>
          <Grid container={true} spacing={1} alignItems="center">
            {!!backButton && <Grid item={true}>{backButton}</Grid>}
            {!!title && (
              <Grid item={true}>
                <Typography variant="h5">{title}</Typography>
              </Grid>
            )}

            <Grid item={true} xs={true} />

            {!!actions && <Grid item={true}>{actions}</Grid>}
          </Grid>
        </Box>

        {children}
      </Container>
    </>
  );
}
