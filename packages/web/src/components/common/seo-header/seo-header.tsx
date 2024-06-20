import Head from "next/head";
import { useRouter } from "next/router";

export interface SEOHeaderProps {
  title: string;
  pageDescription?: string;
}

const SEOHeader: React.FC<SEOHeaderProps> = ({ title, pageDescription }) => {
  const router = useRouter();

  const folderLevel = router.asPath.split("/").length - 2;
  const imagePath = folderLevel <= 0 ? "" : new Array(folderLevel).fill("..").join("/") + "/";

  return <Head>
    <title>{title}</title>
    {pageDescription && <meta>{pageDescription}</meta>}
    <link rel="icon" href="favicon.svg" />
    <meta name="keywords" content="Swap, Earn, Gnoswap, Liquidity, DeFi, trader" />

    <meta property="og:image" content={`${imagePath}opengraph-image.png`} />
    <meta property="og:url" content={window.location.origin} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={pageDescription} />

    <meta name="twitter:image:src" content={`${imagePath}opengraph-image.png`} />
    <meta name="twitter:image" content={`${imagePath}opengraph-image.png`} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={pageDescription} />
  </Head>;
};


export default SEOHeader;