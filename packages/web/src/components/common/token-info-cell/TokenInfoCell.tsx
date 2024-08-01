import { useTheme } from "@emotion/react";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { DEVICE_TYPE } from "@styles/media";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import IconOpenLink from "../icons/IconOpenLink";
import MissingLogo from "../missing-logo/MissingLogo";
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

const DETERMIN_SHORT_SIZE_WEB = 260 as const;
const DETERMIN_SHORT_SIZE_TABLET = 165 as const;
const DETERMIN_SHORT_SIZE_MOBILE = 130 as const;

function TokenInfoCell({ token, breakpoint, isNative }: TokenInfoCellProps) {
  const { name, path, symbol, logoURI } = token;
  const { t } = useTranslation();
  const theme = useTheme();
  const { getGnoscanUrl, getTokenUrl } = useGnoscanUrl();
  const [shortenPath, setShortenPath] = useState(false);
  const elementId = useMemo(
    () => `${Math.random()}${token.path}`,
    [token.path],
  );

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
      breakpoint === DEVICE_TYPE.TABLET_S
    ) {
      setShortenPath(true);
      return;
    }

    if (
      (element?.clientWidth || 0) > DETERMIN_SHORT_SIZE_TABLET &&
      breakpoint === DEVICE_TYPE.TABLET_M
    ) {
      setShortenPath(true);
      return;
    }

    if (
      ((element?.clientWidth || 0) > DETERMIN_SHORT_SIZE_WEB &&
        breakpoint === DEVICE_TYPE.MEDIUM_TABLET) ||
      breakpoint === DEVICE_TYPE.TABLET
    ) {
      setShortenPath(true);
      return;
    }

    if (
      (element?.clientWidth || 0) > DETERMIN_SHORT_SIZE_WEB &&
      (breakpoint === DEVICE_TYPE.WEB || breakpoint === DEVICE_TYPE.MEDIUM_WEB)
    ) {
      setShortenPath(true);
      return;
    }

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
    if (isNative) return t("business:nativeCoin");

    if (shortenPath) return "";

    const tokenPathArr = path?.split("/") ?? [];

    if (tokenPathArr?.length <= 0) return path;

    const replacedPath = path.replace("gno.land", "");

    if (replacedPath.length >= length) {
      return (
        "..." +
        replacedPath.slice(
          replacedPath.length - length,
          replacedPath.length - 1,
        )
      );
    }

    return path.replace("gno.land", "...");
  }, [isNative, length, path, shortenPath]);

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
      <div className="token-name-symbol-path">
        <div className="token-name-path" id={elementId}>
          <strong className="token-name">{name}</strong>
          <div className="token-path" onClick={onClickPath}>
            {tokenPathDisplay && <div>{tokenPathDisplay}</div>}
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
