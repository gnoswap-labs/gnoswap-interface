import React, { useCallback, useMemo } from "react";
import IconTriangleArrowDown from "@components/common/icons/IconTriangleArrowDown";
import IconTriangleArrowUp from "@components/common/icons/IconTriangleArrowUp";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { type Token } from "@containers/token-list-container/TokenListContainer";
import { cx } from "@emotion/css";
import {
  HoverSection,
  PriceValueWrapper,
  TableColumn,
  TokenInfoWrapper,
} from "./MobileTokenInfo.styles";
import { MOBILE_TOKEN_TD_WIDTH } from "@constants/skeleton.constant";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { makeId } from "@utils/common";
import useRouter from "@hooks/common/use-custom-router";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import { useTheme } from "@emotion/react";

interface TokenInfoProps {
  item: Token;
  idx: number;
}

const renderToNegativeType = (status: MATH_NEGATIVE_TYPE, value: string) => (
  <>
    {status === MATH_NEGATIVE_TYPE.NEGATIVE ? (
      <IconTriangleArrowDown />
    ) : status === MATH_NEGATIVE_TYPE.POSITIVE ? (
      <IconTriangleArrowUp />
    ) : null}
    <span>{value}</span>
  </>
);

const MobileTokenInfo: React.FC<TokenInfoProps> = ({ item }) => {
  const { token, price, priceOf1d } = item;
  const router = useRouter();
  const theme = useTheme();

  const onClickItem = (path: string) => {
    router.push("/tokens/" + makeId(path));
  };

  const tokenPathDisplay = useMemo(() => {
    const path_ = item?.path;

    if (item.isNative) return "Native coin";

    const tokenPathArr = path_?.split("/") ?? [];

    if (tokenPathArr?.length <= 0) return path_;

    const lastPath = tokenPathArr[tokenPathArr?.length - 1];

    if (lastPath.length >= 12) {
      return (
        "..." +
        tokenPathArr[tokenPathArr?.length - 1].slice(length - 12, length - 1)
      );
    }

    return path_?.replace("gno.land", "...");
  }, [item.isNative, item.path]);

  const onClickPath = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>, path: string) => {
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
    [],
  );

  return (
    <TokenInfoWrapper>
      <HoverSection onClick={() => onClickItem(token.path)}>
        <TableColumn
          className="name-col left"
          tdWidth={MOBILE_TOKEN_TD_WIDTH[1]}
        >
          <MissingLogo
            symbol={token.symbol}
            url={token.logoURI}
            className="token-logo"
            width={28}
            mobileWidth={28}
          />
          <div className="token-name-symbol-path">
            <div className="token-name-path">
              <strong className="token-name">{token.name}</strong>
              <div
                className="token-path"
                onClick={e => onClickPath(e, item.path)}
              >
                <div>{tokenPathDisplay}</div>
                <IconOpenLink
                  viewBox="0 0 22 22"
                  fill={theme.color.text04}
                  className="path-link-icon"
                />
              </div>
            </div>
            <span className="token-symbol">{token.symbol} </span>
          </div>
        </TableColumn>
        <TableColumn className="price-col" tdWidth={MOBILE_TOKEN_TD_WIDTH[2]}>
          {price === "--" ? (
            <PriceValueWrapper>{price}</PriceValueWrapper>
          ) : (
            price
          )}
          <div className={cx(priceOf1d.status.toLowerCase())}>
            {renderToNegativeType(priceOf1d.status, priceOf1d.value)}
          </div>
        </TableColumn>
      </HoverSection>
    </TokenInfoWrapper>
  );
};

export default MobileTokenInfo;
