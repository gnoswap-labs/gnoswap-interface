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
    <meta property="og:image:url" content="opengraph-image.png" />
    <meta property="og:url" content={window.location.origin} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
  </Head>;
};


export default SEOHeader;