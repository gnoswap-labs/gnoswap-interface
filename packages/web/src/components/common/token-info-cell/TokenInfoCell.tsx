import { useTheme } from "@emotion/react";
import { useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import IconOpenLink from "@components/common/icons/IconOpenLink";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { DEVICE_TYPE } from "@styles/media";

import { STATIC_TEXT } from "@common/values";
import { TokenInfoCellWrapper } from "./TokenInfoCell.styles";
import useElementWidth from "@hooks/common/use-element-width";

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

function TokenInfoCell({ token, breakpoint, isNative }: TokenInfoCellProps) {
  const { name, path, symbol, logoURI } = token;
  const { t } = useTranslation();
  const theme = useTheme();
  const { getGnoscanUrl, getTokenUrl } = useGnoscanUrl();
  const elementId = useMemo(() => `${token.path}`, [token.path]);

  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useElementWidth(containerRef, [token]);

  const tokenNameRef = useRef<HTMLDivElement>(null);
  const tokenNameWidth = useElementWidth(tokenNameRef, [token]);

  const tokenPathDisplay = useMemo(() => {
    if (isNative) return STATIC_TEXT.NATIVE_COIN;

    return path;
  }, [isNative, path, t]);

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
    <TokenInfoCellWrapper ref={containerRef} containerWidth={containerWidth} tokenNameWidth={tokenNameWidth}>
      <MissingLogo symbol={symbol} url={logoURI} className="token-logo" width={28} mobileWidth={28} />
      <div className={`token-name-symbol-path ${breakpoint === DEVICE_TYPE.MOBILE ? "mobile" : ""}`}>
        <div className="token-name-path">
          <strong className="token-name" ref={tokenNameRef} id={elementId}>
            {name}
          </strong>
          <div className="token-link" onClick={onClickPath}>
            <span>{tokenPathDisplay}</span>
            <IconOpenLink fill={theme.color.text04} className="path-link-icon" />
          </div>
        </div>
        <span className="token-symbol">{symbol}</span>
      </div>
    </TokenInfoCellWrapper>
  );
}

export default TokenInfoCell;
