import IconOpenLink from "@components/common/icons/IconOpenLink";
import React from "react";
import { wrapper } from "./TokenDescriptionLinks.styles";

interface TokenDescriptionLinksProps {
  links: { [key: string]: string };
}

const TokenDescriptionLinks: React.FC<TokenDescriptionLinksProps> = ({
  links,
}) => {
  const onClickLink = (link: string) => {
    return window.open(link, "_blank");
  };
  return (
    <div css={wrapper}>
      <h3>Links</h3>
      <div className="group-button">
        {Object.keys(links)?.map((link, idx) => (
          <button key={idx} onClick={() => onClickLink(links[link])}>
            <span>{link}</span>
            <IconOpenLink className="link-icon" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default TokenDescriptionLinks;
