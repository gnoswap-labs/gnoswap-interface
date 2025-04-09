import React from "react";

import { useGetLeaderboard, useGetLeaderboardByAddress, useNextUpdateTime } from "@query/leaderboard";
import { getTimeDiffInMilliseconds, getTimeDiffInSeconds } from "@common/utils/date-util";
import { secondsToTime } from "@common/utils/date-util";
import { useAddress } from "@hooks/common/use-address";

import { Flex, FontSize16, Hover, P, TooltipContent } from "../common/common.styles";
import { StyledIconInfo } from "../common/styled-icon-info/StyledIconInfo";
import { Height24, TextWrapper } from "./NextUpdate.styles";
import Tooltip from "@components/common/tooltip/Tooltip";

export default function NextUpdate({ page }: { page: number }) {
  const { address } = useAddress();
  const { data, refetch: refetchNextUpdateTime } = useNextUpdateTime();
  const [seconds, setSeconds] = React.useState<number | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const { refetch: refetchLeaderboard } = useGetLeaderboard({ limit: 100, page });
  const { refetch: refetchLeaderboardByAddress } = useGetLeaderboardByAddress(address || "");

  // Functions to run when it's time to update
  const handleUpdate = () => {
    // Refetch leaderboard data
    refetchLeaderboard();

    // If an address exists, refetch the leaderboard data for that address too
    if (address) {
      refetchLeaderboardByAddress();
    }

    // Refetch next update time information
    refetchNextUpdateTime();
  };

  // Set a timer for the next update
  React.useEffect(() => {
    if (!data) return;

    // Remove the old timer if it exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Calculate remaining time (in seconds)
    const remainingSeconds = getTimeDiffInSeconds(data.nextUpdateTime);
    setSeconds(remainingSeconds);

    // Calculate remaining time (in Milliseconds)
    const remainingMilliseconds = getTimeDiffInMilliseconds(data.nextUpdateTime);

    // Run the update function when it's time to update
    timeoutRef.current = setTimeout(() => {
      handleUpdate();
    }, remainingMilliseconds);

    // Clean up timers when unmounting components
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, address]);

  // Update remaining time every 1 second
  React.useEffect(() => {
    if (seconds === null) return;

    const intervalId = setInterval(() => {
      setSeconds(prev => {
        if (prev === null || prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [seconds]);

  return (
    <Height24>
      <Flex>
        <Tooltip
          placement="top"
          FloatingContent={<TooltipContent>The leaderboard is updated on an hourly basis.</TooltipContent>}
        >
          <Hover>
            <Flex>
              <StyledIconInfo />
            </Flex>
          </Hover>
        </Tooltip>
        <TextWrapper>
          <FontSize16>
            <P>{`Next update in ${secondsToTime(seconds!)}`}</P>
          </FontSize16>
        </TextWrapper>
      </Flex>
    </Height24>
  );
}
