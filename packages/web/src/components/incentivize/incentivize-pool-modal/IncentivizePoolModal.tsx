
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconClose from "@components/common/icons/IconCancel";
import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import { PoolModel } from "@models/pool/pool-model";
import React, { useCallback } from "react";
import { DistributionPeriodDate } from "../pool-incentivize/PoolIncentivize";
import { IncentivizePoolModalWrapper } from "./IncentivizePoolModal.styles";

interface Props {
  close: () => void;
  onSubmit: () => void;
  date: DistributionPeriodDate;
  period: number;
  data: TokenAmountInputModel | null;
  pool: PoolModel | null;

}

function formatDate(myDate?: DistributionPeriodDate, days?: number): string {
  const utcDate: Date = new Date(Date.UTC(myDate?.year || 0, (myDate?.month || 1) - 1, (myDate?.date || 0) + (days || 0), 0, 0, 0));
  const formattedDate: string =
    utcDate.toISOString().replace(/T/, " ").replace(/\..+/, "") + " (UTC)";
  return formattedDate;
}

const IncentivizePoolModal: React.FC<Props> = ({ close, onSubmit, date, period, data, pool }) => {
  const onClickClose = useCallback(() => {
    close();
  }, [close]);
  
  return (
    <IncentivizePoolModalWrapper>
      <div className="modal-body">
        <div className="header">
          <h6>Confirm Incentivize Pool</h6>
          <div className="close-wrap" onClick={onClickClose}>
            <IconClose className="close-icon" />
          </div>
        </div>
        <div className="content">
          <div className="box-item">
            <h4>Rewards</h4>
            <div className="item-content">
              <div>
                <div className="label">Pool</div>
                <div className="value-content">
                  <DoubleLogo
                    left={pool ? pool?.tokenA.logoURI : ""}
                    right={pool ? pool?.tokenB.logoURI : ""}
                    size={24}
                  />
                  <div className="value">{pool ? pool?.tokenA.symbol : ""}/{pool ? pool?.tokenB.symbol : ""}</div>
                  <Badge type={BADGE_TYPE.DARK_DEFAULT} text={"0.3%"} />
                </div>
              </div>
              <div>
                <div className="label">Total Amount</div>
                <div className="value-content">
                  <img className="image-logo" src="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png" alt="logo" />
                  <div className="value">106,208.255 GNS</div>
                </div>
              </div>
              <div>
                <div className="label">Period</div>
                <div className="value-content value-content-column">
                  <div className="value">{formatDate(date, 0)} <br />
                  - {formatDate(date, period)}</div>
                  <div className="sub-value">{(Number(data?.amount || 0) / period).toFixed(2)} GNS will be distributed daily</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Button
              text="Confirm Incentivize Pool"
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
    </IncentivizePoolModalWrapper>
  );
};

export default IncentivizePoolModal;
