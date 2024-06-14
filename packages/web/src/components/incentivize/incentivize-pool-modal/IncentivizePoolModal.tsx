
import { getDateUtcToLocal } from "@common/utils/date-util";
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import DateTimeTooltip from "@components/common/date-time-tooltip/DateTimeTooltip";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconClose from "@components/common/icons/IconCancel";
import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import { PoolModel } from "@models/pool/pool-model";
import dayjs from "dayjs";
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
  const utcDate = dayjs(Date.parse(`${myDate?.year}-${myDate?.month}-${(myDate?.date || 0)}`)).add(days || 0, "day");
  const formattedDate = getDateUtcToLocal(utcDate.toDate());
  return formattedDate.value;
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
                  <Badge type={BADGE_TYPE.DARK_DEFAULT} text={`${Number(pool?.fee) / 10000}%`} />
                </div>
              </div>
              <div>
                <div className="label">Total Amount</div>
                <div className="value-content">
                  <img className="image-logo" src={data?.token?.logoURI || ""} alt="logo" />
                  <div className="value">{Number(data?.amount).toLocaleString()} {data?.token?.symbol}</div>
                </div>
              </div>
              <div>
                <div className="label">Period</div>
                <div className="value-content value-content-column">
                  <DateTimeTooltip>
                    <div className="value">{formatDate(date, 0)} <br />
                      - {formatDate(date, period)}</div>
                  </DateTimeTooltip>
                  <div className="sub-value">{Number((Number(data?.amount || 0) / period).toFixed(2)).toLocaleString()} {data?.token?.symbol} will be distributed daily</div>
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
