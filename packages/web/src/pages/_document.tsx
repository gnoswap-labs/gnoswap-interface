import {
  UMAMI_SCRIPT_URL,
  UMAMI_WEBSITE_ID,
} from "@constants/environment.constant";
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <meta property="og:image" content="open-graph.svg" />
          <meta property="og:url" content="https://beta.gnoswap.io/" />
          <meta property="og:title" content="The One-stop Gnoland DeFi Platform | Gnoswap" />
          <meta property="og:description" content="The first Concentrated Liquidity AMM DEX built using Gnolang to offer the most simplified and user-friendly DeFi experience for traders." />
          <meta name="description" content="" />
          <meta name="keywords" content="" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
          <link rel="icon" href="favicon.svg" />
          {UMAMI_SCRIPT_URL && UMAMI_WEBSITE_ID && (
            <script
              defer
              src={UMAMI_SCRIPT_URL}
              data-website-id={UMAMI_WEBSITE_ID}
            />
          )}
        </Head>
        <body>
          <Main />
          <div id="portal-root" />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
