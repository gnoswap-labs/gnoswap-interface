import { useTheme } from "@emotion/react";
import { DEVICE_TYPE } from "@styles/media";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
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
  const { name, path, symbol, logoURI } = token;
  const theme = useTheme();
  const [shortenPath, setShortenPath] = useState(false);
  const elementId = useMemo(
    () => `${Math.random()}${token.path}`,
    [token.path],
  );

  useLayoutEffect(() => {
    const element = document.getElementById(elementId);
    if (
      (element?.clientWidth || 0) > 165 &&
      (breakpoint === DEVICE_TYPE.TABLET ||
        breakpoint === DEVICE_TYPE.TABLET_M ||
        breakpoint === DEVICE_TYPE.TABLET_S ||
        breakpoint === DEVICE_TYPE.MEDIUM_TABLET ||
        breakpoint === DEVICE_TYPE.MOBILE)
    ) {
      setShortenPath(true);
      return;
    }

    if (
      breakpoint === DEVICE_TYPE.WEB ||
      breakpoint === DEVICE_TYPE.MEDIUM_WEB
    ) {
      setShortenPath(false);
    }
  }, [elementId, breakpoint]);

  const tokenPathDisplay = useMemo(() => {
    if (isNative) return "Native coin";

    const tokenPathArr = path?.split("/") ?? [];

    if (tokenPathArr?.length <= 0) return path;

    const lastPath = tokenPathArr[tokenPathArr?.length - 1];

    if (shortenPath) {
      return "";
    }

    if (lastPath.length >= 12) {
      return (
        "..." +
        tokenPathArr[tokenPathArr?.length - 1].slice(length - 12, length - 1)
      );
    }

    return path?.replace("gno.land", "...");
  }, [isNative, path, shortenPath]);

  const onClickPath = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      if (path === "gnot") {
        window.open("https://gnoscan.io/", "_blank");
      } else {
        window.open(
          "https://gnoscan.io/tokens/" + encodeURIComponent(path),
          "_blank",
        );
      }
    },
    [path],
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
