import { getDateUtcToLocal } from "@common/utils/date-util";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { INCENTIVE_TYPE } from "@constants/option.constant";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { PoolStakingModel } from "@models/pool/pool-staking";
import { formatPoolPairAmount } from "@utils/new-number-utils";
import { capitalize } from "@utils/string-utils";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import * as S from "./IncentivizeTokenDetailTooltipContent.styles";

type Props = {
  poolStakings: PoolStakingModel[];
  latestBlockHeight: string;
};

function IncentivizeTokenDetailTooltipContent({ poolStakings }: Props) {
  const { getGnotPath } = useGnotToGnot();
  const { t } = useTranslation();

  const displayRemainingAmount = useCallback((staking: PoolStakingModel) => {
    return staking.incentiveType !== "INTERNAL";
  }, []);

  const incentiveTypeText = useCallback((type: INCENTIVE_TYPE) => {
    return capitalize(type);
  }, []);

  return (
    <S.IncentivizeTokenDetailTooltipContent key={JSON.stringify(poolStakings)}>
      {[...poolStakings]
        .sort((a, b) => b.incentiveType.localeCompare(a.incentiveType))
        .map((item, index) => {
          const tokenData = getGnotPath(item.rewardToken);

          return (
            <>
              <S.TokenItem key={item.startTimestamp + item.incentivizedAmount}>
                <S.ItemHeader>
                  <MissingLogo
                    symbol={tokenData.symbol}
                    url={tokenData.logoURI}
                    width={18}
                  />
                  <S.ItemHeaderSymbol>{tokenData.symbol}</S.ItemHeaderSymbol>
                  <S.ItemHeaderTag>
                    {incentiveTypeText(item.incentiveType)}
                  </S.ItemHeaderTag>
                </S.ItemHeader>
                <S.DataGrid>
                  <S.DataGridItem>
                    <S.ItemDataGridLabel>
                      {t("Pool:staking.tooltip.rewardInfo.startDate")}
                    </S.ItemDataGridLabel>
                    <S.ItemDataGridValue>
                      {getDateUtcToLocal(item.startTimestamp).value}{" "}
                    </S.ItemDataGridValue>
                  </S.DataGridItem>
                  <S.DataGridItem>
                    <S.ItemDataGridLabel>
                      {t("Pool:staking.tooltip.rewardInfo.endDate")}
                    </S.ItemDataGridLabel>
                    <S.ItemDataGridValue>
                      {getDateUtcToLocal(item.endTimestamp).value}{" "}
                    </S.ItemDataGridValue>
                  </S.DataGridItem>
                  <S.DataGridItem>
                    <S.ItemDataGridLabel>
                      {t("Pool:staking.tooltip.rewardInfo.incentAmt")}
                    </S.ItemDataGridLabel>
                    <S.ItemDataGridValue>
                      {formatPoolPairAmount(item.incentivizedAmount, {
                        isKMB: false,
                        decimals: item.rewardToken.decimals,
                      })}
                    </S.ItemDataGridValue>
                  </S.DataGridItem>
                  {displayRemainingAmount(item) && (
                    <S.DataGridItem>
                      <S.ItemDataGridLabel>
                        {t("Pool:staking.tooltip.rewardInfo.remainingAmt")}
                      </S.ItemDataGridLabel>
                      <S.ItemDataGridValue>
                        {formatPoolPairAmount(item.remainingAmount, {
                          isKMB: false,
                          decimals: item.rewardToken.decimals,
                        })}
                      </S.ItemDataGridValue>
                    </S.DataGridItem>
                  )}
                </S.DataGrid>
              </S.TokenItem>
              {index !== poolStakings.length - 1 && (
                <S.Divider key={`div-${index}`} />
              )}
            </>
          );
        })}
    </S.IncentivizeTokenDetailTooltipContent>
  );
}

export default IncentivizeTokenDetailTooltipContent;
