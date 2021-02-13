import { AppContainer } from "@/app/AppContainer";
import { CssBaseline } from "@material-ui/core";
import { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppContainer>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>

      <CssBaseline />

      <Component {...pageProps} />
    </AppContainer>
  );
}
