import { Button } from "@material-ui/core";
import NextLink from "next/link";
import React from "react";

interface SignInButtonProps {
  callbackUrl?: string;
}

export function SignInButton({
  callbackUrl = process.browser ? window.location.href : undefined,
}: SignInButtonProps) {
  return (
    <NextLink
      replace={true}
      passHref={true}
      href={{ pathname: "/api/auth/signin", query: { callbackUrl } }}
    >
      <Button color="inherit">Sign In</Button>
    </NextLink>
  );
}
