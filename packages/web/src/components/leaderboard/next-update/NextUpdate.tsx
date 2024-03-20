import { getTimeDiffInSeconds, secondsToTime } from "@common/utils/date-util";
import Tooltip from "@components/common/tooltip/Tooltip";
import { useEffect, useState } from "react";
import { StyledIconInfo } from "../common/styled-icon-info/StyledIconInfo";
import { Text10, TooltipContent, Flex, Hover, Div } from "./NextUpdate.styles";

export default function NextUpdate({
  nextUpdateTime,
}: {
  nextUpdateTime: string | number | Date;
}) {
  const [seconds, setSeconds] = useState(getTimeDiffInSeconds(nextUpdateTime));

  useEffect(() => {
    const second = 1000;
    const interval = setInterval(() => setSeconds(p => p - 1), second);
    return () => clearInterval(interval);
  }, []);

  return (
    <Div>
      <Flex>
        <Tooltip
          placement="top"
          FloatingContent={
            <TooltipContent style={{ width: "314px" }}>
              The leaderboard is updated on an hourly basis.
            </TooltipContent>
          }
        >
          <Hover>
            <Flex>
              <StyledIconInfo />
            </Flex>
          </Hover>
        </Tooltip>
        <Div>
          <Text10>{`Next update in ${secondsToTime(seconds)}`}</Text10>
        </Div>
      </Flex>
    </Div>
  );
}
