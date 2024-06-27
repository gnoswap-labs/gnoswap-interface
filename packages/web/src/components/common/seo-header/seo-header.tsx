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
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    {pageDescription && <meta name="description" content={pageDescription} />}
    <link rel="icon" href={"/favicon.ico"} />
    <link rel="apple-touch-icon" href="/apple-icon.png" />

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