import { useTheme } from "@emotion/react";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { DEVICE_TYPE } from "@styles/media";
import { useCallback, useEffect, useMemo, useState } from "react";
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

function TokenInfoCell({ token, breakpoint, isNative }: TokenInfoCellProps) {
  const { name, symbol, logoURI } = token;
  const path = "gno.land/r/g146gxysfx24t3nar4z4yzkca2g8u9vl8xlpmtq0/jinwoo";
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
      (element?.clientWidth || 0) > 130 &&
      breakpoint === DEVICE_TYPE.MOBILE
    ) {
      setShortenPath(true);
      return;
    }

    if (
      (element?.clientWidth || 0) > 130 &&
      breakpoint === DEVICE_TYPE.TABLET_S
    ) {
      setShortenPath(true);
      return;
    }

    if (
      (element?.clientWidth || 0) > 130 &&
      breakpoint === DEVICE_TYPE.TABLET_M
    ) {
      setShortenPath(true);
      return;
    }

    if (
      ((element?.clientWidth || 0) > 130 &&
        breakpoint === DEVICE_TYPE.MEDIUM_TABLET) ||
      breakpoint === DEVICE_TYPE.TABLET
    ) {
      setShortenPath(true);
      return;
    }

    if (
      (element?.clientWidth || 0) > 260 &&
      (breakpoint === DEVICE_TYPE.WEB || breakpoint === DEVICE_TYPE.MEDIUM_WEB)
    ) {
      setShortenPath(true);
      return;
    }

    if ((element?.clientWidth || 0) > 165) {
      setShortenPath(true);
      return;
    }

    console.log("328947298");
    setShortenPath(false);
  }, [elementId, breakpoint]);

  const length = useMemo(() => {
    return breakpoint === DEVICE_TYPE.MOBILE ? 10 : 15;
  }, [breakpoint]);

  const tokenPathDisplay = useMemo(() => {
    if (isNative) return "Native coin";

    if (shortenPath) return "";

    const tokenPathArr = path?.split("/") ?? [];

    if (tokenPathArr?.length <= 0) return path;

    const replacedPath = path.replace("gno.land", "");
    console.log("🚀 ~ replacedPath:", replacedPath);

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
      if (false) {
        // if (path === "gnot") {
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
