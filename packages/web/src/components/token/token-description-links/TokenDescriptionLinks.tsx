import IconOpenLink from "@components/common/icons/IconOpenLink";
import React from "react";
import { copyTooltip, wrapper } from "./TokenDescriptionLinks.styles";
import IconCopy from "@components/common/icons/IconCopy";
import IconPolygon from "@components/common/icons/IconPolygon";

interface TokenDescriptionLinksProps {
  links: { [key: string]: string };
  copied: boolean;
  copyClick: () => void;
  path: string;
}

const TokenDescriptionLinks: React.FC<TokenDescriptionLinksProps> = ({
  links,
  copied,
  copyClick,
  path,
}) => {
  const onClickLink = (link: string) => {
    return window.open(link, "_blank");
  };
  return (
    <div css={wrapper}>
      <div className="contract-path">
        <h3>Realm (Contract) Path</h3>
        <button onClick={copyClick}>
          <span>{path}</span>
          <div className="icon-wrapper">
            <IconCopy className="link-icon"/>
            {copied && (
              <div css={copyTooltip}>
                <div className="box">
                  <span>Copied!</span>
                </div>
                <IconPolygon className="polygon-icon" />
              </div>
            )}
          </div>
        </button>
      </div>
      <div className="link">
        <h3>Links</h3>
        <div className="group-button">
          {Object.keys(links)?.map((link, idx) => (
            <button key={idx} onClick={() => onClickLink(links[link])}>
              <span>{link}</span>
              <IconOpenLink className="link-icon"/>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenDescriptionLinks;
