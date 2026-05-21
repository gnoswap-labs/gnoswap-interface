import React from "react";
import { useTranslation } from "react-i18next";

import IconCopy from "@components/common/icons/IconCopy";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import IconPolygon from "@components/common/icons/IconPolygon";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { getSafeExternalUrl, openExternalUrl } from "@utils/url-utils";

import { copyTooltip, wrapper } from "./TokenDescriptionLinks.styles";

interface TokenDescriptionLinksProps {
  links: Record<string, string>;
  copied: boolean;
  copyClick: () => void;
  path: string;
  isLoading: boolean;
}

const TokenDescriptionLinks: React.FC<TokenDescriptionLinksProps> = ({ links, copied, copyClick, path, isLoading }) => {
  const { t } = useTranslation();

  const onClickLink = (link: string) => {
    openExternalUrl(link);
  };

  const safeLinks = Object.entries(links)
    .map(([label, url]) => [label, getSafeExternalUrl(url.trim())] as const)
    .filter((entry): entry is readonly [string, string] => entry[1] !== null);

  return (
    <div css={wrapper}>
      {path && (
        <div className="contract-path">
          <h3>{t("TokenDetails:description.realmPath")}</h3>
          {!isLoading && (
            <button onClick={copyClick}>
              <span>{path}</span>
              <div className="icon-wrapper">
                <IconCopy className="link-icon" />
                {copied && (
                  <div css={copyTooltip}>
                    <div className="box">
                      <span>{t("common:copied")}!</span>
                    </div>
                    <IconPolygon className="polygon-icon" />
                  </div>
                )}
              </div>
            </button>
          )}
          {isLoading && <div css={pulseSkeletonStyle({ w: "150px", h: 20 })} />}
        </div>
      )}
      <div className="link">
        <h3>{t("TokenDetails:description.links")}</h3>
        {!isLoading && (
          <div className="group-button">
            {safeLinks.map(([link, url]) =>
              url ? (
                <button key={link} onClick={() => onClickLink(url)}>
                  <span>{link}</span>
                  <IconOpenLink className="link-icon" />
                </button>
              ) : null,
            )}
          </div>
        )}
        {isLoading && <div css={pulseSkeletonStyle({ w: "150px", h: 20 })} />}
      </div>
    </div>
  );
};

export default TokenDescriptionLinks;
