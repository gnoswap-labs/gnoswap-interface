import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import React, { useMemo } from "react";
import { tooltipWrapper, wrapper } from "./SelectLiquidityListItem.styles";
import { useWindowSize } from "@hooks/common/use-window-size";
import { convertLiquidityUsdToKMB, convertLiquidityUsdValue } from "@utils/stake-position-utils";
import BigNumber from "bignumber.js";
import { TokenModel } from "@models/token/token-model";
import styled from "@emotion/styled";

interface SelectLiquidityListItemProps {
  disabled?: boolean;
  position: PoolPositionModel;
  checkedList: string[];
  onCheckedItem: (checked: boolean, path: string) => void;
}

const TokenValueWrapper = styled.div``;
const TokenTitleWrapper = styled.div``;

const TooltipContent: React.FC<{ position: PoolPositionModel, disabled: boolean }> = ({ position, disabled }) => {
  const renderTokenValue = (imgUri: string, tokeSymbol: string, token: TokenModel, tokenBalance: bigint ) => {
    const tokenBalanceByTokenDecimal = BigNumber(makeDisplayTokenAmount(token, tokenBalance) || 0).toFormat();

    return <TokenValueWrapper>
      <div className="value">
        <img src={imgUri} alt="token logo" />
        {tokeSymbol}
      </div>
      <div className="value">{tokenBalanceByTokenDecimal}</div>
    </TokenValueWrapper>;
  };


  return (
    <div css={tooltipWrapper()}>
      <TokenTitleWrapper>
        <div className="title">Token ID</div>
        <div className="title">#{position.id}</div>
      </TokenTitleWrapper>
      {renderTokenValue(
        position.pool.tokenA.logoURI, 
        position.pool.tokenA.symbol, 
        position.pool.tokenA,
        position.token0Balance,
      )}
      {renderTokenValue(
        position.pool.tokenB.logoURI, 
        position.pool.tokenB.symbol, 
        position.pool.tokenB,
        position.token1Balance,
      )}
      {disabled && <div className="divider"></div>}
      {disabled && (
          <div className="unstake-description">
            This position is already staked.
          </div>
        )}
    </div>
  );
};

const SelectLiquidityListItem: React.FC<SelectLiquidityListItemProps> = ({
  position,
  checkedList,
  onCheckedItem,
  disabled = false,
}) => {
  const { width } = useWindowSize();

  const checked = useMemo(() => {
    return checkedList.includes(position.id);
  }, [checkedList, position.id]);

  const tokenA = useMemo(() => {
    return position.pool.tokenA;
  }, [position.pool.tokenA]);

  const tokenB = useMemo(() => {
    return position.pool.tokenB;
  }, [position.pool.tokenB]);

  const liquidityUSD = useMemo(() => {
    if (width < 400) return convertLiquidityUsdToKMB(position.positionUsdValue, { prefix: "$"});

    return convertLiquidityUsdValue(Number(position.positionUsdValue));
  }, [position.positionUsdValue, width]);

  return (
    <li css={wrapper(checked)}>
      <div className="left-content" >
        <input
          id={`checkbox-item-${position.id}`}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={e => onCheckedItem(e.target.checked, position.id)}
        />
        <label htmlFor={`checkbox-item-${position.id}`} />
        <Tooltip
          placement="top"
          FloatingContent={<TooltipContent position={position} disabled={disabled}/>}
        >
          <div className="logo-wrapper">
            <DoubleLogo left={tokenA.logoURI} right={tokenB.logoURI} size={24} leftSymbol={tokenA.symbol} rightSymbol={tokenB.symbol}/>
            {width > 768 && <span className="token-id">{`${position.pool.tokenA.symbol}/${position.pool.tokenB.symbol}`}</span>}
            <Badge text={`${Number(position.pool.fee) / 10000}%`} type={BADGE_TYPE.DARK_DEFAULT} />
          </div>
        </Tooltip>
      </div>
      <span className="liquidity-value" >{liquidityUSD}</span>
    </li>
  );
};

export default SelectLiquidityListItem;
