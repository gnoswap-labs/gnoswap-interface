import Button, { ButtonHierarchy } from "@components/common/button/Button";
import React, { useCallback, useMemo } from "react";
import RemoveLiquiditySelectList from "@components/remove/remove-liquidity-select-list/RemoveLiquiditySelectList";
import RemoveLiquiditySelectResult from "@components/remove/remove-liquidity-select-result/RemoveLiquiditySelectResult";
import { wrapper } from "./RemoveLiquidity.styles";
import { LiquidityInfoModel } from "@models/liquidity/liquidity-info-model";

interface RemoveLiquidityProps {
  selectedAll: boolean;
  liquidities: LiquidityInfoModel[];
  selectedIds: string[];
  select: (id: string) => void;
  selectAll: () => void;
  removeLiquidity: () => void;
}

const RemoveLiquidity: React.FC<RemoveLiquidityProps> = ({
  selectedAll,
  liquidities,
  selectedIds,
  select,
  selectAll,
  removeLiquidity,
}) => {
  const selectedLiquidites = useMemo(() => {
    return liquidities.filter(liquidity => selectedIds.includes(liquidity.liquidityId));
  }, [selectedIds, liquidities]);

  const disabledConfirm = useMemo(() => {
    return selectedLiquidites.length === 0;
  }, [selectedLiquidites.length]);

  const onClickRemoveLiquidity = useCallback(() => {
    removeLiquidity();
  }, [removeLiquidity]);

  return (
    <div css={wrapper}>
      <h3 className="title">Remove Liquidity</h3>
      <RemoveLiquiditySelectList
        liquidities={liquidities}
        selectedIds={selectedIds}
        selectedAll={selectedAll}
        select={select}
        selectAll={selectAll}
      />
      <RemoveLiquiditySelectResult selectedLiquidities={selectedLiquidites} />
      <Button
        text="Remove Liquidity"
        disabled={disabledConfirm}
        style={{
          hierarchy: ButtonHierarchy.Primary,
          height: 57,
          fullWidth: true,
        }}
        onClick={onClickRemoveLiquidity}
      />
    </div>
  );
};

export default RemoveLiquidity;
