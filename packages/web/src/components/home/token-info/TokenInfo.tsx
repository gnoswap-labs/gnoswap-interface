// TODO : remove eslint-disable after work
import React, { useCallback, useMemo } from "react";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconTriangleArrowDown from "@components/common/icons/IconTriangleArrowDown";
import IconTriangleArrowUp from "@components/common/icons/IconTriangleArrowUp";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import {
  MostLiquidPool,
  type Token,
} from "@containers/token-list-container/TokenListContainer";
import { cx } from "@emotion/css";
import { tokenPairSymbolToOneCharacter } from "@utils/string-utils";
import {
  HoverSection,
  TableColumn,
  TokenInfoWrapper,
} from "./TokenInfo.styles";
import { TOKEN_TD_WIDTH } from "@constants/skeleton.constant";
import SimpleLineGraph from "@components/common/simple-line-graph/SimpleLineGraph";
import { Global, css, useTheme } from "@emotion/react";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { makeId } from "@utils/common";
import useRouter from "@hooks/common/use-custom-router";
import IconOpenLink from "@components/common/icons/IconOpenLink";

interface TokenInfoProps {
  item: Token;
  idx: number;
}
const ChartGlobalTooltip = () => {
  return (
    <Global
      styles={() => css`
        .chart-tooltip {
          display: none !important;
        }
      `}
    />
  );
};
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

const TokenInfo: React.FC<TokenInfoProps> = ({ item, idx }) => {
  const {
    path,
    token,
    price,
    priceOf1d,
    priceOf7d,
    priceOf30d,
    marketCap,
    liquidity,
    volume24h,
    mostLiquidPool,
    last7days,
    graphStatus,
    isNative,
  } = item;
  const router = useRouter();
  const theme = useTheme();

  const onClickItem = (path: string) => {
    router.push("/tokens/" + makeId(path));
  };

  const onClickPoolItem = (item: MostLiquidPool) => {
    const poolPath = `${item.tokenPair.tokenA.path}:${item.tokenPair.tokenB.path
      }:${Number(item.feeRate.slice(0, item.feeRate.length - 1)) * 10000}`;
    if (item.tokenPair.tokenA.logoURI) {
      location.href = `/earn/pool/${makeId(poolPath)}`;
    }
  };

  const tokenPathDisplay = useMemo(() => {
    const path_ = path;

    if (isNative) return "Native coin";

    const tokenPathArr = path_?.split("/");

    if (tokenPathArr?.length <= 0) return path_;

    const lastPath = tokenPathArr[tokenPathArr?.length - 1];

    if (lastPath.length >= 12) {
      return "..." + tokenPathArr[tokenPathArr?.length - 1].slice(length - 12, length - 1);
    }

    return path_.replace("gno.land", "...");
  }, [isNative, path]);

  const onClickPath = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>, path: string) => {
    e.stopPropagation();
    if (path === "gnot") {
      window.open("https://gnoscan.io/", "_blank");
    } else {
      window.open("https://gnoscan.io/tokens/" + makeId(path), "_blank");
    }
  }, []);

  return (
    <TokenInfoWrapper>
      <HoverSection onClick={() => onClickItem(token.path)}>
        <TableColumn className="left" tdWidth={TOKEN_TD_WIDTH[0]}>
          <span className="token-index">{idx}</span>
        </TableColumn>
        <TableColumn className="name-col left left-padding" tdWidth={TOKEN_TD_WIDTH[1]}>
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
              <div className="token-path" onClick={(e) => onClickPath(e, path)}>
                <div>{tokenPathDisplay}</div>
                <IconOpenLink
                  viewBox="0 0 22 22"
                  fill={theme.color.text04}
                  className="path-link-icon" />
              </div>
            </div>
            <span className="token-symbol">{token.symbol} </span>
          </div>
        </TableColumn>
        <TableColumn className="right-padding-16" tdWidth={TOKEN_TD_WIDTH[2]}>
          <span>{price}</span>
        </TableColumn>
        <TableColumn
          tdWidth={TOKEN_TD_WIDTH[3]}
          className={cx("right-padding-16", priceOf1d.status.toLowerCase())}
        >
          {renderToNegativeType(priceOf1d.status, priceOf1d.value)}
        </TableColumn>
        <TableColumn
          tdWidth={TOKEN_TD_WIDTH[4]}
          className={cx("right-padding-16", priceOf7d.status.toLowerCase())}
        >
          {renderToNegativeType(priceOf7d.status, priceOf7d.value)}
        </TableColumn>
        <TableColumn
          tdWidth={TOKEN_TD_WIDTH[5]}
          className={cx("right-padding-16", priceOf30d.status.toLowerCase())}
        >
          {renderToNegativeType(priceOf30d.status, priceOf30d.value)}
        </TableColumn>
        <TableColumn className="right-padding-16" tdWidth={TOKEN_TD_WIDTH[6]}>
          <span>{marketCap}</span>
        </TableColumn>
        <TableColumn className="right-padding-12" tdWidth={TOKEN_TD_WIDTH[7]}>
          <span>{liquidity}</span>
        </TableColumn>

        <TableColumn className="right-padding-12" tdWidth={TOKEN_TD_WIDTH[8]}>
          <span className="volume">{volume24h}</span>
        </TableColumn>
      </HoverSection>
      <HoverSection
        onClick={() => onClickPoolItem(mostLiquidPool)}
        className={
          !!mostLiquidPool.tokenPair.tokenA.logoURI ? "" : "disabled-pointer"
        }
      >
        <TableColumn
          className="liquid-col padding-12"
          tdWidth={TOKEN_TD_WIDTH[9]}
        >
          {mostLiquidPool.tokenPair.tokenA.logoURI ? (
            <>
              <DoubleLogo
                left={mostLiquidPool.tokenPair.tokenA.logoURI}
                right={mostLiquidPool.tokenPair.tokenB.logoURI}
                size={20}
                leftSymbol={mostLiquidPool.tokenPair.tokenA.symbol}
                rightSymbol={mostLiquidPool.tokenPair.tokenB.symbol}
              />
              <span className="liquid-symbol right-padding-12">
                {tokenPairSymbolToOneCharacter(mostLiquidPool.tokenPair)}
              </span>
              <span className="fee-rate right-padding-12">
                {mostLiquidPool.feeRate}
              </span>
            </>
          ) : (
            "-"
          )}
        </TableColumn>
      </HoverSection>
      <TableColumn
        tdWidth={TOKEN_TD_WIDTH[10]}
        className="right-padding-12 last7days-graph"
      >
        <SimpleLineGraph
          width={100}
          height={33}
          datas={last7days}
          status={graphStatus}
        />
        <ChartGlobalTooltip />
      </TableColumn>
    </TokenInfoWrapper>
  );
};

export default TokenInfo;
