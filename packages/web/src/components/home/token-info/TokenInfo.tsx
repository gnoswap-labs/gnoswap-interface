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
    tokenId,
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
  return (
    <TokenInfoWrapper>
      <HoverSection>
        <TableColumn className="left" tdWidth={TOKEN_TD_WIDTH[0]}>
          <span className="token-index">{idx}</span>
        </TableColumn>
        <TableColumn className="left" tdWidth={TOKEN_TD_WIDTH[1]}>
          <img src={token.tokenLogo} alt="token logo" className="token-logo" />
          <strong className="token-name">{token.name}</strong>
          <span className="token-symbol">{token.symbol}</span>
        </TableColumn>
        <TableColumn tdWidth={TOKEN_TD_WIDTH[2]}>
          <span>{price}</span>
        </TableColumn>
        <TableColumn
          tdWidth={TOKEN_TD_WIDTH[3]}
          className={cx(priceOf1d.status.toLowerCase())}
        >
          {renderToNegativeType(priceOf1d.status, priceOf1d.value)}
        </TableColumn>
        <TableColumn
          tdWidth={TOKEN_TD_WIDTH[4]}
          className={cx(priceOf7d.status.toLowerCase())}
        >
          {renderToNegativeType(priceOf7d.status, priceOf7d.value)}
        </TableColumn>
        <TableColumn
          tdWidth={TOKEN_TD_WIDTH[5]}
          className={cx(priceOf30d.status.toLowerCase())}
        >
          {renderToNegativeType(priceOf30d.status, priceOf30d.value)}
        </TableColumn>
        <TableColumn tdWidth={TOKEN_TD_WIDTH[6]}>
          <span>{marketCap}</span>
        </TableColumn>
        <TableColumn tdWidth={TOKEN_TD_WIDTH[7]}>
          <span>{liquidity}</span>
        </TableColumn>

        <TableColumn tdWidth={TOKEN_TD_WIDTH[8]}>
          <span className="volume">{volume24h}</span>
        </TableColumn>
      </HoverSection>

      <HoverSection>
        <TableColumn tdWidth={TOKEN_TD_WIDTH[9]}>
          <DoubleLogo
            left={mostLiquidPool.tokenPair.token0.tokenLogo}
            right={mostLiquidPool.tokenPair.token1.tokenLogo}
            size={20}
          />
          <span className="liquid-symbol">
            {tokenPairSymbolToOneCharacter(mostLiquidPool.tokenPair)}
          </span>
          <span className="fee-rate">{mostLiquidPool.feeRate}</span>
        </TableColumn>
      </HoverSection>
      <TableColumn tdWidth={TOKEN_TD_WIDTH[10]} className="dummy-graph">
        <span />
      </TableColumn>
    </TokenInfoWrapper>
  );
};

export default TokenInfo;
