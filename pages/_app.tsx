import { AppContainer } from "@/app/AppContainer";
import { AppRouterProgressIndicator } from "@/app/AppRouterState";
import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppContainer>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />

        <link
          rel="stylesheet"
          href="https://unpkg.com/prismjs@1.23.0/themes/prism-tomorrow.css"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>

      <AppRouterProgressIndicator />

      <Component {...pageProps} />
    </AppContainer>
  );
}
