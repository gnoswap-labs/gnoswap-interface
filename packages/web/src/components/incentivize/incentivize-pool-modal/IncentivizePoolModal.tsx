import { getDateUtcToLocal } from "@common/utils/date-util";
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import DateTimeTooltip from "@components/common/date-time-tooltip/DateTimeTooltip";
import IconClose from "@components/common/icons/IconCancel";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import OverlapTokenLogo from "@components/common/overlap-token-logo/OverlapTokenLogo";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import { PoolModel } from "@models/pool/pool-model";
import { TokenModel } from "@models/token/token-model";
import dayjs from "dayjs";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
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
  const utcDate = dayjs(
    Date.parse(`${myDate?.year}-${myDate?.month}-${myDate?.date || 0}`),
  ).add(days || 0, "day");
  const formattedDate = getDateUtcToLocal(utcDate.toDate());
  return formattedDate.value;
}

const IncentivizePoolModal: React.FC<Props> = ({
  close,
  onSubmit,
  date,
  period,
  data,
  pool,
}) => {
  const { t } = useTranslation();
  const { getGnotPath } = useGnotToGnot();

  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  return (
    <IncentivizePoolModalWrapper>
      <div className="modal-body">
        <div className="header">
          <h6>{t("IncentivizePool:confirmModal.title")}</h6>
          <div className="close-wrap" onClick={onClickClose}>
            <IconClose className="close-icon" />
          </div>
        </div>
        <div className="content">
          <div className="box-item">
            <h4>{t("IncentivizePool:confirmModal.row.title")}</h4>
            <div className="item-content">
              <div>
                <div className="label">
                  {t("IncentivizePool:confirmModal.row.label.pool")}
                </div>
                <div className="value-content">
                  <OverlapTokenLogo
                    tokens={
                      [
                        { ...pool?.tokenA, ...getGnotPath(pool?.tokenA) },
                        { ...pool?.tokenB, ...getGnotPath(pool?.tokenB) },
                      ] as TokenModel[]
                    }
                    size={24}
                  />
                  <div className="value">
                    {pool ? pool?.tokenA.symbol : ""}/
                    {pool ? pool?.tokenB.symbol : ""}
                  </div>
                  <Badge
                    type={BADGE_TYPE.DARK_DEFAULT}
                    text={`${Number(pool?.fee) / 10000}%`}
                  />
                </div>
              </div>
              <div>
                <div className="label">
                  {t("IncentivizePool:confirmModal.row.label.totalAmt")}
                </div>
                <div className="value-content">
                  <MissingLogo
                    symbol={getGnotPath(data?.token)?.symbol}
                    width={24}
                    url={getGnotPath(data?.token)?.logoURI || ""}
                  />
                  <div className="value">
                    {Number(data?.amount).toLocaleString()}{" "}
                    {data?.token?.symbol}
                  </div>
                </div>
              </div>
              <div>
                <div className="label">
                  {t("IncentivizePool:confirmModal.row.label.period")}
                </div>
                <div className="value-content value-content-column">
                  <DateTimeTooltip>
                    <div className="value">
                      {formatDate(date, 0)} <br />- {formatDate(date, period)}
                    </div>
                  </DateTimeTooltip>
                  <div className="sub-value">
                    {t("IncentivizePool:confirmModal.row.value.period.desc", {
                      amount: Number(
                        (Number(data?.amount || 0) / period).toFixed(2),
                      ).toLocaleString(),
                      symbol: data?.token?.symbol,
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Button
              text={t("IncentivizePool:confirmModal.btn")}
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
