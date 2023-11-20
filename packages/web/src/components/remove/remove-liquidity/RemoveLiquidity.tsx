import Button, { ButtonHierarchy } from "@components/common/button/Button";
import React, { useCallback, useMemo } from "react";
import { wrapper } from "./RemoveLiquidity.styles";
import { LPPositionModel } from "@models/position/lp-position-model";
import RemoveLiquiditySelectList from "../remove-liquidity-select-list/RemoveLiquiditySelectList";
import RemoveLiquiditySelectResult from "../remove-liquidity-select-result/RemoveLiquiditySelectResult";
import { DEVICE_TYPE } from "@styles/media";

interface RemoveLiquidityProps {
  selectedAll: boolean;
  lpPositions: LPPositionModel[];
  selectedIds: string[];
  select: (id: string) => void;
  selectAll: () => void;
  removeLiquidity: () => void;
  breakpoint: DEVICE_TYPE;
}

const RemoveLiquidity: React.FC<RemoveLiquidityProps> = ({
  selectedAll,
  lpPositions,
  selectedIds,
  select,
  selectAll,
  removeLiquidity,
  breakpoint,
}) => {
  const selectedLiquidites = useMemo(() => {
    return lpPositions.filter(lpPosition => selectedIds.includes(lpPosition.lpRewardId));
  }, [selectedIds, lpPositions]);

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
        lpPositions={lpPositions}
        selectedIds={selectedIds}
        selectedAll={selectedAll}
        select={select}
        selectAll={selectAll}
        breakpoint={breakpoint}
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
