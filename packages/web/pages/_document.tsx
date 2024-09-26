import {
  UMAMI_SCRIPT_URL,
  UMAMI_WEBSITE_ID,
} from "@constants/environment.constant";
import "dayjs/locale/de";
import "dayjs/locale/en";
import "dayjs/locale/es";
import "dayjs/locale/fr";
import "dayjs/locale/hi";
import "dayjs/locale/ja";
import "dayjs/locale/ko";
import "dayjs/locale/ru";
import "dayjs/locale/zh";
import Document, { Head, Html, Main, NextScript } from "next/document";
import i18nextConfig from "../next-i18next.config";

class MyDocument extends Document {
  render() {
    const currentLocale =
      this.props.__NEXT_DATA__.locale || i18nextConfig.i18n.defaultLocale;

    return (
      <Html lang={currentLocale}>
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="keywords"
            content="Swap, Earn, GnoSwap, Liquidity, DeFi, trader"
          />
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
          <div id="portal-dropdown" />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
