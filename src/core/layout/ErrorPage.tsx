import {
  extractErrorCode,
  formatAppError,
  getAppErrorStatusCode,
} from "@/core/data/AppError";
import Error from "next/error";
import React, { ReactElement, useEffect } from "react";

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
  useErrorHandler(error);

  return (
    <Error
      title={formatAppError(error)}
      statusCode={getAppErrorStatusCode(error)}
    />
  );
}
