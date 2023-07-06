import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { tokenPairSymbolToOneCharacter } from "@utils/string-utils";
import React from "react";
import { wrapper } from "./PoolPairInfoHeader.styles";

interface PoolPairInfoHeaderProps {
  info: any;
}

const PoolPairInfoHeader: React.FC<PoolPairInfoHeaderProps> = ({ info }) => {
  return (
    <div css={wrapper}>
      <DoubleLogo
        left={info.tokenPair.token0.tokenLogo}
        right={info.tokenPair.token1.tokenLogo}
      />
      <h3>{tokenPairSymbolToOneCharacter(info.tokenPair)}</h3>
      <div className="badge-wrap">
        <Badge type={BADGE_TYPE.DARK_DEFAULT} text={info.feeRate} />
        <Badge type={BADGE_TYPE.DARK_DEFAULT} text={info.incentivized} />
      </div>
    </div>
  );
};

export default PoolPairInfoHeader;
