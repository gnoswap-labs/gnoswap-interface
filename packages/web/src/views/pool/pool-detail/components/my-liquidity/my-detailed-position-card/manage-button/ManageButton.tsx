import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";

import useCustomRouter from "@hooks/common/use-custom-router";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { IncreaseState } from "@states/index";

import { POSITION_ACTION } from "./types";

import { ManageButtonWrapper, ManageItem } from "./ManageButton.styles";
import { useMemo } from "react";

interface ManageButtonProps {
  position: PoolPositionModel;
  inRange: boolean;
  isClosed: boolean;
  isStaked: boolean;
  isStakable: boolean;
}

const ManageButton: React.FC<ManageButtonProps> = ({
  position,
  inRange,
  isClosed,
  isStaked,
  isStakable,
}) => {
  const router = useCustomRouter();
  const { t } = useTranslation();
  const [, setSelectedPosition] = useAtom(IncreaseState.selectedPosition);

  const handleSelect = (text: POSITION_ACTION) => {
    switch (text) {
      case POSITION_ACTION.DECREASE:
        setSelectedPosition(position);
        router.movePageWithPositionId(
          "POSITION_DECREASE_LIQUIDITY",
          position.poolPath,
          position?.id,
        );
        break;
      case POSITION_ACTION.INCREASE:
        setSelectedPosition(position);
        router.movePageWithPositionId(
          "POSITION_INCREASE_LIQUIDITY",
          position.poolPath,
          position?.id,
        );
        break;
      case POSITION_ACTION.REPOSITION:
        setSelectedPosition(position);
        router.movePageWithPositionId(
          "POSITION_REPOSITION",
          position.poolPath,
          position?.id,
        );
        break;
      case POSITION_ACTION.REMOVE:
        setSelectedPosition(position);
        router.movePageWithPositionId(
          "POOL_REMOVE",
          position.poolPath,
          position?.id,
        );
        break;
      case POSITION_ACTION.STAKE:
        setSelectedPosition(position);
        router.movePageWithPositionId(
          "POOL_STAKE",
          position.poolPath,
          position?.id,
        );
        break;
      case POSITION_ACTION.UNSTAKE:
        setSelectedPosition(position);
        router.movePageWithPositionId(
          "POOL_UNSTAKE",
          position.poolPath,
          position?.id,
        );
        break;
    }
  };

  const itemList = useMemo(() => {
    if (isClosed) return [POSITION_ACTION.INCREASE];
    if (isStaked) return [POSITION_ACTION.UNSTAKE];
    const base = isStakable ? [POSITION_ACTION.STAKE] : [];
    return [
      ...base,
      POSITION_ACTION.REMOVE,
      POSITION_ACTION.REPOSITION,
      POSITION_ACTION.INCREASE,
      POSITION_ACTION.DECREASE,
    ];
  }, [isClosed, isStaked, isStakable]);

  return (
    <ManageButtonWrapper
      className={!inRange && !isClosed ? "out-range" : ""}
      current={t("Pool:position.card.btn.manage.label")}
      items={itemList}
      select={handleSelect}
      render={item => <ManageItem>{t(item)}</ManageItem>}
    />
  );
};

export default ManageButton;