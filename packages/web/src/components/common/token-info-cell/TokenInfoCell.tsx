import { useTheme } from "@emotion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import IconOpenLink from "@components/common/icons/IconOpenLink";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";

import { TokenInfoCellWrapper } from "./TokenInfoCell.styles";

export interface TokenInfoCellProps {
  token: {
    path: string;
    name: string;
    symbol: string;
    logoURI: string;
  };
  isNative: boolean;
  isMobile?: boolean;
}

const DETERMIN_SHORT_SIZE_WEB = 182 as const;
const DETERMIN_SHORT_SIZE_MOBILE = 160 as const;

function TokenInfoCell({ token, isMobile, isNative }: TokenInfoCellProps) {
  const { name, path, symbol, logoURI } = token;
  const { t } = useTranslation();
  const theme = useTheme();
  const { getGnoscanUrl, getTokenUrl } = useGnoscanUrl();
  const [shortenPath, setShortenPath] = useState(false);
  const elementId = useMemo(
    () => `${token.path}`,
    [token.path],
  );

  useEffect(() => {
    const element = document.getElementById(elementId);

    if (isMobile && (element?.clientWidth || 0) < DETERMIN_SHORT_SIZE_MOBILE) {
      setShortenPath(true);
      return;
    }

    if ((element?.clientWidth || 0) < DETERMIN_SHORT_SIZE_WEB) {
      setShortenPath(true);
      return;
    }

    setShortenPath(false);
  }, [elementId, isMobile]);

  const length = isMobile ? 15 : 20;

  const tokenPathDisplay = useMemo(() => {
    if (shortenPath) return "";
    if (isNative) return t("business:nativeCoin");

    let replacedPath = path.replace("gno.land", "");

    if (replacedPath.length > length) {
      replacedPath = replacedPath.slice(replacedPath.length - length);
    }
    return "...".concat(replacedPath);
  }, [isNative, length, path, shortenPath, t]);

  const onClickPath = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      if (path === "gnot") {
        window.open(getGnoscanUrl(), "_blank");
      } else {
        window.open(getTokenUrl(path), "_blank");
      }
    },
    [path, getGnoscanUrl, getTokenUrl],
  );

  return (
    <TokenInfoCellWrapper id={elementId}>
      <MissingLogo
        symbol={symbol}
        url={logoURI}
        className="token-logo"
        width={28}
        mobileWidth={28}
      />
      <div className={`token-name-symbol-path ${isMobile ? "mobile" : ""}`}>
        <div className="token-name-path">
          <strong className="token-name">{name}</strong>
          <div className="token-link" onClick={onClickPath}>
            {tokenPathDisplay}
            <IconOpenLink
              fill={theme.color.text04}
              className="path-link-icon"
            />
          </div>
        </div>
        <span className="token-symbol">{symbol}</span>
      </div>
    </TokenInfoCellWrapper>
  );
}

export default TokenInfoCell;
