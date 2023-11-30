import React from "react";
import TokenDescriptionContent from "@components/token/token-description-content/TokenDescriptionContent";
import TokenDescriptionLinks from "@components/token/token-description-links/TokenDescriptionLinks";
import { wrapper } from "./TokenDescription.styles";
import { SHAPE_TYPES, skeletonTokenDetail } from "@constants/skeleton.constant";
interface TokenDescriptionProps {
  tokenName: string;
  tokenSymbol: string;
  content: string;
  links: any;
  loading: boolean;
}

const TokenDescription: React.FC<TokenDescriptionProps> = ({
  tokenName,
  tokenSymbol,
  content,
  links,
  loading,
}) => {
  return (
    <div css={wrapper}>
      <h2>{`About ${tokenName} (${tokenSymbol})`}</h2>
      {!loading && <TokenDescriptionContent content={content}/>}
      {loading && <>
        <span
          css={skeletonTokenDetail("100%", SHAPE_TYPES.ROUNDED_SQUARE)}
        />
        <span
          css={skeletonTokenDetail("100%", SHAPE_TYPES.ROUNDED_SQUARE)}
        />
      </>}

      <TokenDescriptionLinks links={links} />
    </div>
  );
};

export default TokenDescription;
