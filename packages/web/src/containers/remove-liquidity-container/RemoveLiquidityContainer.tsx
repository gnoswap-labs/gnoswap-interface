import RemoveLiquidity from "@components/remove/remove-liquidity/RemoveLiquidity";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRemovePositionModal } from "@hooks/earn/use-remove-position-modal";
import { useWindowSize } from "@hooks/common/use-window-size";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { usePositionData } from "@hooks/common/use-position-data";

const RemoveLiquidityContainer: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { width } = useWindowSize();
  const { openModal } = useRemovePositionModal();
  const [positions, setPositions] = useState<PoolPositionModel[]>([]);
  const { getPositions } = usePositionData();

  useEffect(() => {
    getPositions().then(setPositions);
  }, [getPositions]);

  const unstakedLiquidities = useMemo(() => {
    return positions.filter(item => item.unclaimedFee0Amount + item.unclaimedFee1Amount > 0);
  }, [positions]);

  const selectedAll = useMemo(() => {
    return unstakedLiquidities.length === selectedIds.length;
  }, [selectedIds.length, unstakedLiquidities.length]);

  const selectAll = useCallback(() => {
    if (selectedAll) {
      setSelectedIds([]);
      return;
    }
    const selectedIds = unstakedLiquidities.map(liquidity => liquidity.id);
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
    openModal();
  }, []);

  return (
    <RemoveLiquidity
      positions={positions}
      selectedAll={selectedAll}
      selectedIds={selectedIds}
      select={select}
      selectAll={selectAll}
      removeLiquidity={removeLiquidity}
      width={width}
    />
  );
};

export default RemoveLiquidityContainer;
