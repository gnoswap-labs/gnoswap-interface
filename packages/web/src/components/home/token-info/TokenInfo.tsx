// TODO : remove eslint-disable after work
/* eslint-disable */
import React from "react";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconTriangleArrowDown from "@components/common/icons/IconTriangleArrowDown";
import IconTriangleArrowUp from "@components/common/icons/IconTriangleArrowUp";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { type Token } from "@containers/token-list-container/TokenListContainer";
import { cx } from "@emotion/css";
import { tokenPairSymbolToOneCharacter } from "@utils/string-utils";
import {
  HoverSection,
  TableColumn,
  TokenInfoWrapper,
} from "./TokenInfo.styles";
import { TOKEN_TD_WIDTH } from "@constants/skeleton.constant";
import SimpleLineGraph from "@components/common/simple-line-graph/SimpleLineGraph";

interface TokenInfoProps {
  item: Token;
  idx: number;
}

const renderToNegativeType = (status: MATH_NEGATIVE_TYPE, value: string) => (
  <>
    {status === MATH_NEGATIVE_TYPE.NEGATIVE ? (
      <IconTriangleArrowDown />
    ) : (
      <IconTriangleArrowUp />
    )}
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
  } = item;

  const onClickItem = (symbol: string) => {
    location.href = "/tokens/" + symbol;
  };

  return (
    <TokenInfoWrapper>
      <HoverSection onClick={() => onClickItem(token.symbol)}>
        <TableColumn className="left" tdWidth={TOKEN_TD_WIDTH[0]}>
          <span className="token-index">{idx}</span>
        </TableColumn>
        <TableColumn className="left left-padding" tdWidth={TOKEN_TD_WIDTH[1]}>
          <img src={token.logoURI} alt="token logo" className="token-logo" />
          <strong className="token-name">{token.name}</strong>
          <span className="token-symbol">{token.symbol}</span>
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
      <HoverSection>
        <TableColumn className="liquid-col padding-12" tdWidth={TOKEN_TD_WIDTH[9]}>
          <DoubleLogo
            left={mostLiquidPool.tokenPair.tokenA.logoURI}
            right={mostLiquidPool.tokenPair.tokenB.logoURI}
            size={20}
          />
          <span className="liquid-symbol right-padding-12">
            {tokenPairSymbolToOneCharacter(mostLiquidPool.tokenPair)}
          </span>
          <span className="fee-rate right-padding-12">
            {mostLiquidPool.feeRate}
          </span>
        </TableColumn>
      </HoverSection>
      <TableColumn
        tdWidth={TOKEN_TD_WIDTH[10]}
        className="right-padding-12 last7days-graph"
      >
        <SimpleLineGraph width={100} height={33} datas={last7days} />
      </TableColumn>
    </TokenInfoWrapper>
  );
};

export default TokenInfo;
