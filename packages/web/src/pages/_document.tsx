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
          <meta name="keywords" content="Swap, Earn, Gnoswap, Liquidity, DeFi, trader" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
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
