import RemoveLiquidity from "@components/remove/remove-liquidity/RemoveLiquidity";
import React, { useCallback, useMemo, useState } from "react";
import { LPPositionModel } from "@models/position/lp-position-model";

const RemoveLiquidityContainer: React.FC = () => {
  const [lpPositions] = useState<LPPositionModel[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const unstakedLiquidities = useMemo(() => {
    return lpPositions;
  }, [lpPositions]);

  const selectedAll = useMemo(() => {
    return unstakedLiquidities.length === selectedIds.length;
  }, [selectedIds.length, unstakedLiquidities.length]);

  const selectAll = useCallback(() => {
    if (selectedAll) {
      setSelectedIds([]);
      return;
    }
    const selectedIds = unstakedLiquidities.map(liquidity => liquidity.lpRewardId);
    setSelectedIds(selectedIds);
  }, [selectedAll, unstakedLiquidities]);

  const select = useCallback((id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId => selectedId !== id)));
      return;
    }
    setSelectedIds([...selectedIds, id]);
  }, [selectedIds]);

  const removeLiquidity = useCallback(() => {
    console.log("removeLiquidity");
  }, []);

  return (
    <RemoveLiquidity
      lpPositions={lpPositions}
      selectedAll={selectedAll}
      selectedIds={selectedIds}
      select={select}
      selectAll={selectAll}
      removeLiquidity={removeLiquidity}
    />
  );
};

export default RemoveLiquidityContainer;
