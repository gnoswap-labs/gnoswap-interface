import { useMemo } from "react";
import * as S from "./IncentivizeBlockTooltipContent.styles";

type Props = {
  latestBlockHeight?: string;
  period: number;
};

function IncentivizeBlockTooltipContent({ latestBlockHeight, period }: Props) {
  const tier = useMemo(() => {
    switch (period) {
      case 180:
        return 15552000;
      case 365:
        return 31536000;
      case 90:
      default:
        return 7776000;
    }
  }, [period]);

  const getStartBlockHeight = () => {
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
      end: start + (tier as number),
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
