import Head from "next/head";

export interface SEOHeaderProps {
  title: string;
  pageDescription?: string;
}

const SEOHeader: React.FC<SEOHeaderProps> = ({ title, pageDescription }) => {
  return <Head>
    <title>{title}</title>
    {pageDescription && <meta>{pageDescription}</meta>}
    <meta property="og:image" content="opengraph-image.png" />
    <meta property="og:url" content={window.location.origin} />
    <meta property="og:title" content="The One-stop Gnoland DeFi Platform | Gnoswap" />
    <meta property="og:description" content="The first Concentrated Liquidity AMM DEX built using Gnolang to offer the most simplified and user-friendly DeFi experience for traders." />

    <meta name="twitter:image:src" content="opengraph-image.png" />
    <meta name="twitter:image" content="opengraph-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="The One-stop Gnoland DeFi Platform | Gnoswap" />
    <meta name="twitter:description" content="The first Concentrated Liquidity AMM DEX built using Gnolang to offer the most simplified and user-friendly DeFi experience for traders." />
  </Head>;
};


export default SEOHeader;