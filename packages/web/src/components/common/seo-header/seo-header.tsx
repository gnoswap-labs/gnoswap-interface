import Head from "next/head";
import { useRouter } from "next/router";

export interface SEOHeaderProps {
  title: string;
  pageDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
}

const SEOHeader: React.FC<SEOHeaderProps> = ({ title, pageDescription, ogDescription, ogTitle }) => {
  const router = useRouter();

  const folderLevel = router.asPath.split("/").length - 2;
  const imagePath = folderLevel <= 0 ? "" : new Array(folderLevel).fill("..").join("/") + "/";

  return <Head>
    <title>{title}</title>
    {pageDescription && <meta>{pageDescription}</meta>}
    <link rel="icon" href={`${imagePath}favicon.svg`} />

    <meta property="og:image" content={`${imagePath}opengraph-image.png`} />
    <meta property="og:url" content={window.location.origin} />
    <meta property="og:title" content={ogTitle || title} />
    <meta property="og:description" content={ogDescription || pageDescription} />

    <meta name="twitter:image:src" content={`${imagePath}opengraph-image.png`} />
    <meta name="twitter:image" content={`${imagePath}opengraph-image.png`} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={ogTitle || title} />
    <meta name="twitter:description" content={ogDescription || pageDescription} />
  </Head>;
};


export default SEOHeader;