import Tooltip from "@components/common/tooltip/Tooltip";
import {
  Flex,
  FontSize16,
  Hover,
  TooltipContent,
} from "../common/common.styles";
import { StyledIconInfo } from "../common/styled-icon-info/StyledIconInfo";

const HideMe = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <Flex>
      <Hover>
        <Tooltip
          placement="top"
          FloatingContent={
            <TooltipContent>
              Your username or address will be hidden. Other users will not be
              able to see your positions.
            </TooltipContent>
          }
        >
          <StyledIconInfo />
        </Tooltip>
      </Hover>
      <FontSize16>
        {isMobile ? "Hide me" : "Hide my address or username"}
      </FontSize16>
    </Flex>
  );
};

export default HideMe;
