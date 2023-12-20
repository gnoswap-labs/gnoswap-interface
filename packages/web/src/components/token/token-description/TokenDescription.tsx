import React from "react";
import TokenDescriptionContent from "@components/token/token-description-content/TokenDescriptionContent";
import TokenDescriptionLinks from "@components/token/token-description-links/TokenDescriptionLinks";
import { wrapper } from "./TokenDescription.styles";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
interface TokenDescriptionProps {
  tokenName: string;
  tokenSymbol: string;
  content: string;
  links: any;
  loading: boolean;
  copied: boolean;
  copyClick: () => void;
  path: string;
}

const TokenDescription: React.FC<TokenDescriptionProps> = ({
  tokenName,
  tokenSymbol,
  content,
  links,
  loading,
  copied,
  copyClick,
  path,
}) => {
  return (
    <div css={wrapper}>
      <h2>{`About ${tokenName} (${tokenSymbol})`}</h2>
      {!loading && <TokenDescriptionContent content={content}/>}
      {loading && <>
        <span
          className="loading-value"
          css={pulseSkeletonStyle({ h: 22 })}
        />
        <span
          className="loading-value"
          css={pulseSkeletonStyle({ h: 22 })}
        />
      </>}

      <TokenDescriptionLinks links={links} copyClick={copyClick} copied={copied} path={path}/>
    </div>
  );
};

export default TokenDescription;
