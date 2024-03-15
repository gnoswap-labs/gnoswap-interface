import Tooltip from "@components/common/tooltip/Tooltip";
import { StyledIconInfo } from "../common/styled-icon-info/StyledIconInfo";
import { Text10, TooltipContent, Flex, Hover } from "./NextUpdate.styles";

export default function NextUpdate() {
  return (
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
          <Text10>Next update in 01:42:31</Text10>
        </Flex>
      </Hover>
    </Tooltip>
  );
}
