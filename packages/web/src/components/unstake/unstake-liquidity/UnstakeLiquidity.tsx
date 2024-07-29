import Button, { ButtonHierarchy } from "@components/common/button/Button";
import React, { useMemo } from "react";
import SelectLiquidity from "@components/unstake/select-liquidity/SelectLiquidity";
import SelectUnstakeResult from "@components/unstake/select-unstake-result/SelectUnstakeResult";
import { StakeWarningContentWrapper, wrapper } from "./UnstakeLiquidity.styles";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { IconCircleExclamationMark } from "@components/common/icons/IconExclamationRound";
import WarningCard from "@components/common/warning-card/WarningCard";
import { useTranslation } from "react-i18next";

interface UnstakeLiquidityProps {
  stakedPositions: PoolPositionModel[];
  checkedList: string[];
  onCheckedItem: (checked: boolean, path: string) => void;
  onCheckedAll: (checked: boolean) => void;
  checkedAll: boolean;
  handleConfirmUnstake: () => void;
  isLoading: boolean;
}

const UnstakeLiquidity: React.FC<UnstakeLiquidityProps> = ({
  stakedPositions,
  checkedList,
  onCheckedItem,
  onCheckedAll,
  checkedAll,
  handleConfirmUnstake,
  isLoading,
}) => {
  const { t } = useTranslation();

  const selectedPositions = useMemo(() => {
    return stakedPositions.filter(position =>
      checkedList.includes(position.id),
    );
  }, [checkedList, stakedPositions]);

  return (
    <div css={wrapper}>
      <h3 className="title">{t("UnstakePosition:title")}</h3>
      <SelectLiquidity
        stakedPositions={stakedPositions}
        checkedList={checkedList}
        onCheckedItem={onCheckedItem}
        onCheckedAll={onCheckedAll}
        checkedAll={checkedAll}
        isLoading={isLoading}
      />
      <SelectUnstakeResult positions={selectedPositions} />
      {selectedPositions.length > 0 && (
        <WarningCard
          title={t("UnstakePosition:warning.title")}
          icon={<IconCircleExclamationMark />}
          content={
            <StakeWarningContentWrapper>
              <p>{t("UnstakePosition:warning.content")}</p>
              <a href="/">
                {t("common:learnMore")}
                <IconOpenLink className="icon-link" />
              </a>
            </StakeWarningContentWrapper>
          }
        />
      )}
      <Button
        text={
          checkedList.length === 0
            ? t("UnstakePosition:btn.selectPosi")
            : t("UnstakePosition:btn.unstake")
        }
        style={{
          hierarchy: ButtonHierarchy.Primary,
          fullWidth: true,
        }}
        className="button-confirm"
        disabled={checkedList.length === 0}
        onClick={handleConfirmUnstake}
      />
    </div>
  );
};

export default UnstakeLiquidity;
