import { useTheme } from "@emotion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import IconOpenLink from "@components/common/icons/IconOpenLink";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { DEVICE_TYPE } from "@styles/media";

import { STATIC_TEXT } from "@common/values";
import { TokenInfoCellWrapper } from "./TokenInfoCell.styles";

export interface TokenInfoCellProps {
  token: {
    path: string;
    name: string;
    symbol: string;
    logoURI: string;
  };
  isNative: boolean;
  breakpoint?: DEVICE_TYPE;
}

const DETERMIN_SHORT_SIZE_WEB = 160 as const;
const DETERMIN_SHORT_SIZE_TABLET = 60 as const;
const DETERMIN_SHORT_SIZE_MOBILE = 70 as const;

function TokenInfoCell({ token, breakpoint, isNative }: TokenInfoCellProps) {
  const { name, path, symbol, logoURI } = token;
  const { t } = useTranslation();
  const theme = useTheme();
  const { getGnoscanUrl, getTokenUrl } = useGnoscanUrl();
  const [shortenPath, setShortenPath] = useState(false);
  const elementId = useMemo(() => `${token.path}`, [token.path]);

  useEffect(() => {
    const element = document.getElementById(elementId);

    if (
      (element?.clientWidth || 0) > DETERMIN_SHORT_SIZE_MOBILE &&
      breakpoint === DEVICE_TYPE.MOBILE
    ) {
      setShortenPath(true);
      return;
    }

    if (
      (element?.clientWidth || 0) > DETERMIN_SHORT_SIZE_TABLET &&
      (breakpoint === DEVICE_TYPE.TABLET ||
        breakpoint === DEVICE_TYPE.TABLET_M ||
        breakpoint === DEVICE_TYPE.TABLET_S)
    ) {
      setShortenPath(true);
      return;
    }

    // breakpoint === DEVICE_TYPE.WEB || breakpoint === DEVICE_TYPE.MEDIUM_WEB
    if ((element?.clientWidth || 0) > DETERMIN_SHORT_SIZE_WEB) {
      setShortenPath(true);
      return;
    }

    setShortenPath(false);
  }, [elementId, breakpoint]);

  const length = useMemo(() => {
    return breakpoint === DEVICE_TYPE.MOBILE ? 10 : 15;
  }, [breakpoint]);

  const tokenPathDisplay = useMemo(() => {
    if (shortenPath) return "";
    if (isNative) return STATIC_TEXT.NATIVE_COIN;

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
    <TokenInfoCellWrapper>
      <MissingLogo
        symbol={symbol}
        url={logoURI}
        className="token-logo"
        width={28}
        mobileWidth={28}
      />
      <div
        className={`token-name-symbol-path ${
          breakpoint === DEVICE_TYPE.MOBILE ? "mobile" : ""
        }`}
      >
        <div className="token-name-path">
          <strong className="token-name" id={elementId}>
            {name}
          </strong>
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
