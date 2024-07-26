import React from "react";
import TokenDescriptionContent from "@components/token/token-description-content/TokenDescriptionContent";
import TokenDescriptionLinks from "@components/token/token-description-links/TokenDescriptionLinks";
import { wrapper } from "./TokenDescription.styles";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  return (
    <div css={wrapper}>
      {!loading && (
        <h2>
          {t("TokenDetails:description.title", {
            name: `${tokenName} (${tokenSymbol})`,
          })}
        </h2>
      )}
      {loading && (
        <span
          className="loading-value"
          css={pulseSkeletonStyle({ h: 25, w: 195 })}
        />
      )}
      {!loading && <TokenDescriptionContent content={content} />}
      {loading && (
        <>
          <span className="loading-value" css={pulseSkeletonStyle({ h: 22 })} />
          <span className="loading-value" css={pulseSkeletonStyle({ h: 22 })} />
        </>
      )}

      <TokenDescriptionLinks
        links={links}
        copyClick={copyClick}
        copied={copied}
        path={path}
        isLoading={loading}
      />
    </div>
  );
};

export default TokenDescription;
