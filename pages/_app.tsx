import {
  createMuiTheme,
  CssBaseline,
  Link,
  ThemeProvider,
} from "@material-ui/core";
import { Components, MDXProvider } from "@mdx-js/react";
import { Provider, useSession } from "next-auth/client";
import { AppProps } from "next/app";
import Head from "next/head";

const theme = createMuiTheme({
  palette: {
    mode: "dark",

    primary: { main: "#2196f3", dark: "#0d47a1" },
    secondary: { main: "#78909c" },
    error: { main: "#f44336" },
  },

  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: "default",
      },
    },
  },
});

const mdxComponents: Components = {
  a: Link,
};

export default function App({ Component, pageProps }: AppProps) {
  const [session] = useSession();

  return (
    <MDXProvider components={mdxComponents}>
      <ThemeProvider theme={theme}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />

          <link rel="preconnect" href="https://fonts.googleapis.com" />

          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
        </Head>

        <CssBaseline />

        <Provider session={session}>
          <Component {...pageProps} />
        </Provider>
      </ThemeProvider>
    </MDXProvider>
  );
}
