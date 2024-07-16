import { getDateUtcToLocal } from "@common/utils/date-util";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { Divider } from "@components/common/select-token/SelectToken.styles";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { PoolStakingModel } from "@models/pool/pool-staking";
import { formatPoolPairAmount } from "@utils/new-number-utils";
import { capitalize } from "@utils/string-utils";
import * as S from "./IncentivizeTokenDetailTooltipContent.styles";

type Props = {
  poolStakings: PoolStakingModel[];
  latestBlockHeight: string;
};

function IncentivizeTokenDetailTooltipContent({ poolStakings }: Props) {
  const { getGnotPath } = useGnotToGnot();

  return (
    <S.IncentivizeTokenDetailTooltipContent>
      {poolStakings.map((item, index) => {
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
                  {capitalize(item.incentiveType)}
                </S.ItemHeaderTag>
              </S.ItemHeader>
              <S.DataGrid>
                <S.DataGridItem>
                  <S.ItemDataGridLabel>Start Date</S.ItemDataGridLabel>
                  <S.ItemDataGridValue>
                    {getDateUtcToLocal(item.startTimestamp).value}{" "}
                  </S.ItemDataGridValue>
                </S.DataGridItem>
                <S.DataGridItem>
                  <S.ItemDataGridLabel>End Date</S.ItemDataGridLabel>
                  <S.ItemDataGridValue>
                    {getDateUtcToLocal(item.endTimestamp).value}{" "}
                  </S.ItemDataGridValue>
                </S.DataGridItem>
                <S.DataGridItem>
                  <S.ItemDataGridLabel>Incentivized Amount</S.ItemDataGridLabel>
                  <S.ItemDataGridValue>
                    {formatPoolPairAmount(item.incentivizedAmount, {
                      isKMB: false,
                      decimals: item.rewardToken.decimals,
                    })}
                  </S.ItemDataGridValue>
                </S.DataGridItem>
                <S.DataGridItem>
                  <S.ItemDataGridLabel>Remaining Amount</S.ItemDataGridLabel>
                  <S.ItemDataGridValue>
                    {formatPoolPairAmount(item.remainingAmount, {
                      isKMB: false,
                      decimals: item.rewardToken.decimals,
                    })}
                  </S.ItemDataGridValue>
                </S.DataGridItem>
              </S.DataGrid>
            </S.TokenItem>
            {index !== poolStakings.length - 1 && (
              <Divider key={`div-${index}`} />
            )}
          </>
        );
      })}
    </S.IncentivizeTokenDetailTooltipContent>
  );
}

export default IncentivizeTokenDetailTooltipContent;
