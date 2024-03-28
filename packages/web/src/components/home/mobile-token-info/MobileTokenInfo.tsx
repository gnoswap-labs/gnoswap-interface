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
} from "./MobileTokenInfo.styles";
import { MOBILE_TOKEN_TD_WIDTH } from "@constants/skeleton.constant";
import SimpleLineGraph from "@components/common/simple-line-graph/SimpleLineGraph";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { makeId } from "@utils/common";

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

const MobileTokenInfo: React.FC<TokenInfoProps> = ({ item, idx }) => {
  const {
    token,
    price,
    priceOf1d
  } = item;

  const onClickItem = (path: string) => {
    location.href = "/tokens/" + makeId(path);
  };

  return (
    <TokenInfoWrapper>
      <HoverSection onClick={() => onClickItem(token.path)}>
        <TableColumn className="left" tdWidth={MOBILE_TOKEN_TD_WIDTH[1]}>
          <MissingLogo symbol={token.symbol} url={token.logoURI} className="token-logo" width={24} mobileWidth={24}/>
          <div className="symbol-col">
            <strong className="token-name">{token.name}</strong>
            <span className="token-symbol">{token.symbol}</span>
          </div>
        </TableColumn>
        <TableColumn className="price-col" tdWidth={MOBILE_TOKEN_TD_WIDTH[2]}>
          <span>{price}</span>
          <div className={cx(priceOf1d.status.toLowerCase())}>{renderToNegativeType(priceOf1d.status, priceOf1d.value)}</div>
        </TableColumn>
      </HoverSection>
    </TokenInfoWrapper>
  );
};

export default MobileTokenInfo;
