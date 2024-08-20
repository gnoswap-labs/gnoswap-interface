import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import Switch from "@components/common/switch/Switch";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { PoolPositionModel } from "@models/position/pool-position-model";

import {
  HeaderTextWrapper,
  PositionsWrapper
} from "./EarnMyPositionsHeader.styles";

export interface EarnMyPositionsHeaderProps {
  address?: string | null;
  addressName?: string;
  isOtherPosition: boolean;
  visiblePositions: boolean;
  positionLength: number;
  connected: boolean;
  isSwitchNetwork: boolean;
  availableStake: boolean;
  moveEarnAdd: () => void;
  moveEarnStake: () => void;
  isClosed: boolean;
  handleChangeClosed: () => void;
  positions: PoolPositionModel[];
}

const EarnMyPositionsHeader: React.FC<EarnMyPositionsHeaderProps> = ({
  address,
  addressName,
  isOtherPosition,
  visiblePositions,
  positionLength,
  connected,
  isSwitchNetwork,
  availableStake,
  moveEarnAdd,
  moveEarnStake,
  isClosed,
  handleChangeClosed,
}) => {
  const { getAccountUrl } = useGnoscanUrl();
  const { t } = useTranslation();

  const disabledStake = useMemo(() => {
    return !connected || isSwitchNetwork || !availableStake;
  }, [availableStake, connected, isSwitchNetwork]);

  const onClickAddressPosition = useCallback(() => {
    if (address) window.open(getAccountUrl(address), "_blank");
  }, [address, getAccountUrl]);

  const onClickNewPosition = useCallback(() => {
    moveEarnAdd();
  }, [moveEarnAdd]);

  const renderMyPositionTitle = () => {
    if (isOtherPosition)
      return (
        <>
          <span className="name" onClick={onClickAddressPosition}>
            {addressName}
          </span>
          <span>{`${t("Earn:positions.title", {
            context: "other",
          })} (${positionLength})`}</span>
        </>
      );

    if (connected)
      return <span>{`${t("Earn:positions.title")} (${positionLength})`}</span>;

    return <span>{t("Earn:positions.title")}</span>;
  };

  return (
    <PositionsWrapper>
      <div className="header-content">
        <HeaderTextWrapper>{renderMyPositionTitle()}</HeaderTextWrapper>
        {visiblePositions && (
          <Switch
            checked={isClosed}
            onChange={handleChangeClosed}
            hasLabel={true}
            labelText={t("Earn:positions.showClosedSwitch", {
              context: "short",
            })}
          />
        )}
      </div>
      <div className="button-wrapper">
        {visiblePositions && (
          <Switch
            checked={isClosed}
            onChange={handleChangeClosed}
            hasLabel={true}
            labelText={t("Earn:positions.showClosedSwitch")}
          />
        )}
        <Button
          text={t("Earn:positions.stakeBtn")}
          style={{
            hierarchy: ButtonHierarchy.Primary,
            fontType: "p1",
            height: 36,
            padding: "10px 16px",
          }}
          disabled={disabledStake}
          onClick={moveEarnStake}
        />
        <Button
          text={t("Earn:positions.addPositionBtn")}
          style={{
            hierarchy: ButtonHierarchy.Primary,
            fontType: "p1",
            height: 36,
            padding: "10px 16px",
          }}
          onClick={onClickNewPosition}
        />
      </div>
    </PositionsWrapper>
  );
};

export default EarnMyPositionsHeader;
