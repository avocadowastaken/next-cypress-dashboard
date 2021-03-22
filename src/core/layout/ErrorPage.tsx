import {
  extractErrorCode,
  formatAppError,
  getAppErrorStatusCode,
} from "@/core/data/AppError";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
import Error from "next/error";
import NextLink from "next/link";
import React, { ReactElement, useEffect, useState } from "react";

function SignInDialog() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Dialog open={true} maxWidth="xs" fullWidth={true}>
      <DialogContent>Please sign in to access this page</DialogContent>
      <DialogActions>
        <NextLink href="/" passHref={true}>
          <Button disabled={isLoading}>Back</Button>
        </NextLink>

        <form
          action="/api/auth"
          method="post"
          onSubmit={() => {
            setIsLoading(true);
          }}
        >
          <LoadingButton type="submit" pending={isLoading}>
            Sign In
          </LoadingButton>
        </form>
      </DialogActions>
    </Dialog>
  );
}

export interface ErrorPageProps {
  error: unknown;
}

export function useErrorHandler(error: unknown): void {
  useEffect(() => {
    const errorCode = !error ? null : extractErrorCode(error);

    if (errorCode === "UNAUTHORIZED") {
      window.location.replace("/api/auth");
    }
  }, [error]);
}

export function ErrorPage({ error }: ErrorPageProps): ReactElement {
  if (extractErrorCode(error) === "UNAUTHORIZED") {
    return <SignInDialog />;
  }

  return (
    <Error
      title={formatAppError(error)}
      statusCode={getAppErrorStatusCode(error)}
    />
  );
}
