import React from "react";
import TokenDescriptionContent from "@components/token/token-description-content/TokenDescriptionContent";
import TokenDescriptionLinks from "@components/token/token-description-links/TokenDescriptionLinks";
import { wrapper } from "./TokenDescription.styles";
interface TokenDescriptionProps {
  tokenName: string;
  tokenSymbol: string;
  content: string;
  links: any;
}

const TokenDescription: React.FC<TokenDescriptionProps> = ({
  tokenName,
  tokenSymbol,
  content,
  links,
}) => {
  return (
    <div css={wrapper}>
      <h2>{`About ${tokenName} (${tokenSymbol})`}</h2>
      <TokenDescriptionContent content={content} />
      <TokenDescriptionLinks links={links} />
    </div>
  );
};

export default TokenDescription;
