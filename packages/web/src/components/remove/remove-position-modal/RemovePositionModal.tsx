import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconClose from "@components/common/icons/IconCancel";
import { useRemoveData } from "@hooks/stake/use-remove-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { formatNumberToLocaleString, numberToUSD } from "@utils/number-utils";
import React, { useCallback, useMemo } from "react";
import { Divider, RemovePositionModalWrapper, RemoveWarningContentWrapper, ToolTipContentWrapper } from "./RemovePositionModal.styles";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import IconInfo from "@components/common/icons/IconInfo";
import WarningCard from "@components/common/warning-card/WarningCard";
import { IconCircleExclamationMark } from "@components/common/icons/IconExclamationRound";
import { numberToRate } from "@utils/string-utils";

interface Props {
  selectedPosition: PoolPositionModel[];
  allPositions: PoolPositionModel[];
  close: () => void;
  onSubmit: () => void;
}

const RemovePositionModal: React.FC<Props> = ({ selectedPosition, close, onSubmit, allPositions }) => {
  const { unclaimedRewards, totalLiquidityUSD } = useRemoveData({ selectedPosition });
  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  const warningPercent = useMemo(() => {
    const selectRemoveUsd = selectedPosition.reduce((acc, current) => {
      return acc + Number(current.usdValue || 0) * Number(current.apr || 0);
    }, 0);
    const allUsd = allPositions.reduce((acc, current) => {
      return acc + Number(current.usdValue || 0);
    }, 0);

    if (selectRemoveUsd === 0) return "0%";
    if (allUsd === 0) return "-";
    return numberToRate(selectRemoveUsd / allUsd);
  }, [allPositions, selectedPosition]);

  return (
    <RemovePositionModalWrapper>
      <div className="modal-body">
        <div className="header">
          <h6>Confirm Remove Position</h6>
          <div className="close-wrap" onClick={onClickClose}>
            <IconClose className="close-icon" />
          </div>
        </div>
        <div className="content">
          <div className="box-item">
            <h4>Positions</h4>
            <div className="item-content">
              {selectedPosition.map((position, index) => (
                <div key={index}>
                  <div className="label-logo">
                    <DoubleLogo
                      left={position.pool.tokenA.logoURI}
                      right={position.pool.tokenB.logoURI}
                      size={24}
                      leftSymbol={position.pool.tokenA.symbol}
                      rightSymbol={position.pool.tokenB.symbol}
                    />
                    <div>{`${position.pool.tokenA.symbol}/${position.pool.tokenB.symbol}`}</div>
                    <Badge className="position-bar" text={`${Number(position.pool.fee) / 10000}%`} type={BADGE_TYPE.DARK_DEFAULT} />
                  </div>
                  <div className="value">{numberToUSD(Number(position.positionUsdValue))}</div>
                </div>
              ))}
            </div>
            <div className="box-item box-item-unclaim">
              <h4>Unclaimed Fees</h4>
              <div className="item-content">
                {unclaimedRewards.map((rewardInfo, index) => (
                  <div key={index} className="item-detail">
                    <div>
                      <div className="label-logo">
                        <MissingLogo
                          symbol={rewardInfo.token.symbol}
                          url={rewardInfo.token.logoURI}
                          width={24}
                          mobileWidth={24}
                          className="image-logo"
                        />
                        <div>{rewardInfo.token.symbol}</div>
                      </div>
                      <div className="value">{formatNumberToLocaleString(rewardInfo.amount)}</div>
                    </div>
                    <div className="sub-value">{rewardInfo.amountUSD}</div>
                  </div>
                ))}
                <div className="protocal-wrapper">
                  <Divider />
                  <div className="protocol">
                    <div>
                      <span className="">Protocol Fee</span>
                      <Tooltip placement="top" FloatingContent={<ToolTipContentWrapper width="251px">The amount of fees charged on each claim that goes to the protocol.</ToolTipContentWrapper>}>
                        <IconInfo />
                      </Tooltip>
                    </div>
                    <span className="white-text">0%</span>
                  </div>
                </div>

              </div>

            </div>
            <Divider />
            <div className="box-item">
              <div className="item-content">
                <div>
                  <div className="label-large">
                    Total Amount
                  </div>
                  <div className="value-large">{totalLiquidityUSD}</div>
                </div>
              </div>
            </div>
            <WarningCard
              title={"Important Note"}
              icon={<IconCircleExclamationMark />}
              content={<RemoveWarningContentWrapper>
                You will stop earning swap fee rewards of <span className="remove-percent">{warningPercent} APR</span>
              </RemoveWarningContentWrapper>}
            />
            <div className="button-wrapper">
              <Button
                text="Confirm Remove Position"
                style={{
                  hierarchy: ButtonHierarchy.Primary,
                  fullWidth: true,
                }}
                className="button-confirm"
                onClick={onSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </RemovePositionModalWrapper>
  );
};

export default RemovePositionModal;
