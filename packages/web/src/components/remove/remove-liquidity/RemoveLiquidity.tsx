import Button, { ButtonHierarchy } from "@components/common/button/Button";
import React, { useCallback, useMemo } from "react";
import { wrapper } from "./RemoveLiquidity.styles";
import RemoveLiquiditySelectList from "../remove-liquidity-select-list/RemoveLiquiditySelectList";
import RemoveLiquiditySelectResult from "../remove-liquidity-select-result/RemoveLiquiditySelectResult";
import { PoolPositionModel } from "@models/position/pool-position-model";

interface RemoveLiquidityProps {
  selectedAll: boolean;
  positions: PoolPositionModel[];
  selectedIds: string[];
  select: (id: string) => void;
  selectAll: () => void;
  removeLiquidity: () => void;
  width: number;
}

const RemoveLiquidity: React.FC<RemoveLiquidityProps> = ({
  selectedAll,
  positions,
  selectedIds,
  select,
  selectAll,
  removeLiquidity,
  width,
}) => {
  const selectedLiquidites = useMemo(() => {
    return positions.filter(lpPosition => selectedIds.includes(lpPosition.id));
  }, [selectedIds, positions]);

  const disabledConfirm = useMemo(() => {
    return selectedLiquidites.length === 0;
  }, [selectedLiquidites.length]);

  const onClickRemoveLiquidity = useCallback(() => {
    removeLiquidity();
  }, [removeLiquidity]);

  return (
    <div css={wrapper}>
      <h3 className="title">Remove Position</h3>
      <RemoveLiquiditySelectList
        positions={positions}
        selectedIds={selectedIds}
        selectedAll={selectedAll}
        select={select}
        selectAll={selectAll}
        width={width}
      />
      <RemoveLiquiditySelectResult selectedLiquidities={selectedLiquidites} />
      <Button
        text={disabledConfirm ? "Select Position" : "Remove Position"}
        disabled={disabledConfirm}
        style={{
          hierarchy: ButtonHierarchy.Primary,
          fullWidth: true,
        }}
        className="button-submit"
        onClick={onClickRemoveLiquidity}
      />
    </div>
  );
};

export default RemoveLiquidity;
