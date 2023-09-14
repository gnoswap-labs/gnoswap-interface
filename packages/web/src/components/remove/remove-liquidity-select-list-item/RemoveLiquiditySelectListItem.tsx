import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import React, { useCallback, useMemo } from "react";
import { LiquidityInfoModel } from "@models/liquidity/liquidity-info-model";
import { RemoveLiquiditySelectListItemWrapper } from "./RemoveLiquiditySelectListItem.styles";

interface RemoveLiquiditySelectListItemProps {
  selected: boolean;
  liquidity: LiquidityInfoModel;
  select: (id: string) => void;
}

const RemoveLiquiditySelectListItem: React.FC<RemoveLiquiditySelectListItemProps> = ({
  selected,
  liquidity,
  select,
}) => {

  const selectable = useMemo(() => {
    return liquidity.stakeType === "UNSTAKED";
  }, [liquidity.stakeType]);

  const doubleLogo = useMemo(() => {
    const { token0, token1 } = liquidity.tokenPair;
    return {
      left: token0.tokenLogo,
      right: token1.tokenLogo,
    };
  }, [liquidity.tokenPair]);

  const onChangeCheckbox = useCallback(() => {
    select(liquidity.liquidityId);
  }, [liquidity.liquidityId, select]);

  return (
    <RemoveLiquiditySelectListItemWrapper selected={selected}>
      <input
        id={`checkbox-item-${liquidity.liquidityId}`}
        type="checkbox"
        disabled={!selectable}
        checked={selected}
        onChange={onChangeCheckbox}
      />
      <label htmlFor={`checkbox-item-${liquidity.liquidityId}`} />
      <DoubleLogo {...doubleLogo} size={24} />
      <span className="token-id">{liquidity.liquidityId}</span>
      {!selectable && (
        <div className="hover-info">
          <Tooltip
            placement="top"
            FloatingContent={
              <div>You need to unstake your liquidity first</div>
            }
          >
            <IconInfo className="icon-info" />
          </Tooltip>
        </div>
      )}
      <span className="liquidity-value">{liquidity.amount}</span>
    </RemoveLiquiditySelectListItemWrapper>
  );
};

export default RemoveLiquiditySelectListItem;
