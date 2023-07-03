// TODO : remove eslint-disable after work
/* eslint-disable */
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { POOL_TD_WIDTH } from "@constants/skeleton.constant";
import { type Pool } from "@containers/pool-list-container/PoolListContainer";
import React from "react";
import { PoolInfoWrapper, TableColumn } from "./PoolInfo.styles";
interface PoolInfoProps {
  pool: Pool;
}

const PoolInfo: React.FC<PoolInfoProps> = ({ pool }) => {
  const {
    poolId,
    tokenPair,
    feeRate,
    liquidity,
    apr,
    volume24h,
    fees24h,
    rewards,
    incentiveType,
  } = pool;
  return (
    <PoolInfoWrapper>
      <TableColumn className="left" tdWidth={POOL_TD_WIDTH[0]}>
        <DoubleLogo
          left={tokenPair.token0.tokenLogo}
          right={tokenPair.token1.tokenLogo}
          size={20}
        />
        <span className="symbol-pair">{`${tokenPair.token0.symbol}/${tokenPair.token1.symbol}`}</span>
        <span className="feeRate">{feeRate}</span>
      </TableColumn>
      <TableColumn tdWidth={POOL_TD_WIDTH[1]}>
        <span className="liquidity">{liquidity}</span>
      </TableColumn>
      <TableColumn tdWidth={POOL_TD_WIDTH[2]}>
        <span className="volume">{volume24h}</span>
      </TableColumn>
      <TableColumn tdWidth={POOL_TD_WIDTH[3]}>
        <span className="fees">{fees24h}</span>
      </TableColumn>
      <TableColumn tdWidth={POOL_TD_WIDTH[4]}>
        <span className="apr">{apr}</span>
      </TableColumn>
      <TableColumn tdWidth={POOL_TD_WIDTH[5]}>
        <DoubleLogo left={rewards[0]} right={rewards[1]} size={20} />
      </TableColumn>
    </PoolInfoWrapper>
  );
};

export default PoolInfo;
