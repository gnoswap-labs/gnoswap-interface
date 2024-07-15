import { getDateUtcToLocal } from "@common/utils/date-util";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { Divider } from "@components/common/select-token/SelectToken.styles";
import { PoolStakingModel } from "@models/pool/pool-staking";
import { formatOtherPrice } from "@utils/new-number-utils";
import { capitalize } from "@utils/string-utils";
import * as S from "./IncentivizeTokenDetailTooltipContent.styles";

const TIER_MAP: Record<string, number> = {
  "1": 7776000,
  "2": 15552000,
  "3": 31536000,
};

type Props = {
  poolStakings: PoolStakingModel[];
  latestBlockHeight: string;
};

function IncentivizeTokenDetailTooltipContent({
  poolStakings,
  latestBlockHeight,
}: Props) {
  const getStartBlockHeight = (item: PoolStakingModel) => {
    const now = new Date();
    const tmrDate = new Date();
    tmrDate.setDate(now.getDate() + 1);
    tmrDate.setHours(0);
    tmrDate.setMinutes(0);
    tmrDate.setSeconds(0);
    tmrDate.setMilliseconds(0);

    const secondUntilTmr = tmrDate.getTime() - now.getTime() / 1000;

    const start = Math.floor(Number(latestBlockHeight) + secondUntilTmr / 2);

    return {
      start: Math.floor(Number(latestBlockHeight) + secondUntilTmr / 2),
      end: start + TIER_MAP[item?.tier],
    };
  };

  return (
    <S.IncentivizeTokenDetailTooltipContent>
      {poolStakings.map((item, index) => (
        <>
          <S.TokenItem>
            <S.ItemHeader>
              <MissingLogo
                symbol={item.rewardToken.symbol}
                url={item.rewardToken.logoURI}
                width={18}
              />
              <S.ItemHeaderSymbol>{item.rewardToken.symbol}</S.ItemHeaderSymbol>
              <S.ItemHeaderTag>
                {capitalize(item.incentiveType)}
              </S.ItemHeaderTag>
            </S.ItemHeader>
            <S.DataGrid>
              <S.DataGridItem>
                <S.ItemDataGridLabel>Start Date</S.ItemDataGridLabel>
                <S.ItemDataGridValue>
                  {getDateUtcToLocal(new Date(item.startTimestamp)).value}{" "}
                  <S.ItemDataGridValueBlock>
                    {"("}Block #{getStartBlockHeight(item).start}
                    {")"}
                  </S.ItemDataGridValueBlock>
                </S.ItemDataGridValue>
              </S.DataGridItem>
              <S.DataGridItem>
                <S.ItemDataGridLabel>End Date</S.ItemDataGridLabel>
                <S.ItemDataGridValue>
                  {getDateUtcToLocal(new Date(item.endTimestamp)).value}
                  <S.ItemDataGridValueBlock>
                    {"("}Block #{getStartBlockHeight(item).end}
                    {")"}
                  </S.ItemDataGridValueBlock>
                </S.ItemDataGridValue>
              </S.DataGridItem>
              <S.DataGridItem>
                <S.ItemDataGridLabel>Incentivized Amount</S.ItemDataGridLabel>
                <S.ItemDataGridValue>
                  {formatOtherPrice(item.incentivizedAmount, {
                    isKMB: false,
                    usd: false,
                  })}
                </S.ItemDataGridValue>
              </S.DataGridItem>
              <S.DataGridItem>
                <S.ItemDataGridLabel>Remaining Amount</S.ItemDataGridLabel>
                <S.ItemDataGridValue>
                  {formatOtherPrice(item.remainingAmount, {
                    isKMB: false,
                    usd: false,
                  })}
                </S.ItemDataGridValue>
              </S.DataGridItem>
            </S.DataGrid>
          </S.TokenItem>
          {index !== poolStakings.length - 1 && <Divider />}
        </>
      ))}
    </S.IncentivizeTokenDetailTooltipContent>
  );
}

export default IncentivizeTokenDetailTooltipContent;
