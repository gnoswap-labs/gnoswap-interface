import { useMemo } from "react";

import * as S from "./IncentivizeBlockTooltipContent.styles";

type Props = {
  latestBlockHeight?: string;
  period: number;
};

const SECONDS_ONE_DAY = 60 * 60 * 24;

const SECOND_PER_BLOCK = 2;

const MILLISEC_PER_SEC = 1000;

function IncentivizeBlockTooltipContent({ latestBlockHeight, period }: Props) {
  const periodBlockGap = useMemo(() => {
    return (period * SECONDS_ONE_DAY) / SECOND_PER_BLOCK;
  }, [period]);

  const getStartBlockHeight = () => {
    const now = new Date();
    const tmrDate = new Date();
    tmrDate.setDate(now.getDate() + 1);
    tmrDate.setHours(0);
    tmrDate.setMinutes(0);
    tmrDate.setSeconds(0);
    tmrDate.setMilliseconds(0);

    const secondUntilTmr =
      (tmrDate.getTime() - now.getTime()) / MILLISEC_PER_SEC;

    const start = Math.floor(
      Number(latestBlockHeight) + secondUntilTmr / SECOND_PER_BLOCK,
    );

    return {
      start: start,
      end: start + periodBlockGap,
    };
  };

  return (
    <S.IncentivizeBlockTooltipContentWrapper>
      <S.Content>
        The distribution starts at Block #{getStartBlockHeight().start} <br />
        and ends at Block #{getStartBlockHeight().end}.
      </S.Content>
      <S.SubContent>
        * The block heights may fluctuate due
        <br /> to the network conditions.
      </S.SubContent>
    </S.IncentivizeBlockTooltipContentWrapper>
  );
}

export default IncentivizeBlockTooltipContent;
