import { getTimeDiffInSeconds, secondsToTime } from "@common/utils/date-util";
import Tooltip from "@components/common/tooltip/Tooltip";
import { useNextUpdateTime } from "@query/leaderboard";
import { useEffect, useState } from "react";
import { FontSize } from "../common/common.styles";
import { StyledIconInfo } from "../common/styled-icon-info/StyledIconInfo";
import {
  Text10,
  TooltipContent,
  Flex,
  Hover,
  Height24,
  TextWrapper,
} from "./NextUpdate.styles";

export default function NextUpdate() {
  const { data, error } = useNextUpdateTime();
  if (error) throw error;

  const [seconds, setSeconds] = useState<number>();

  useEffect(() => {
    if (!data) return;
    const gap = 1;
    setSeconds(() => getTimeDiffInSeconds(data.nextUpdateTime) + gap);
  }, [data]);

  useEffect(() => {
    const second = 1000;
    const interval = setInterval(() => setSeconds(p => (p || -1) - 1), second);

    return () => clearInterval(interval);
  }, []);

  return (
    <Height24>
      <Flex>
        <Tooltip
          placement="top"
          FloatingContent={
            <TooltipContent>
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
        <TextWrapper>
          <FontSize>
            <Text10>{`Next update in ${secondsToTime(seconds!)}`}</Text10>
          </FontSize>
        </TextWrapper>
      </Flex>
    </Height24>
  );
}
