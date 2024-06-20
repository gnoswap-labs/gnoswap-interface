import Head from "next/head";

export interface SEOHeaderProps {
  title: string;
  pageDescription?: string;
}

const SEOHeader: React.FC<SEOHeaderProps> = ({ title, pageDescription }) => {
  return <Head>
    <title>{title}</title>
    {pageDescription && <meta>{pageDescription}</meta>}
    <meta property="og:image" content="https://source.unsplash.com/random/200x200?sig=3" />
  </Head>;
};


export default SEOHeader;