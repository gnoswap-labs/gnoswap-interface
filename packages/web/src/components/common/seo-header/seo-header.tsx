import Head from "next/head";

export interface SEOHeaderProps {
  title: string;
  pageDescription?: string;
}

const SEOHeader: React.FC<SEOHeaderProps> = ({ title, pageDescription }) => {
  return <Head>
    <title>{title}</title>
    {pageDescription && <meta>{pageDescription}</meta>}
  </Head>;
};


export default SEOHeader;