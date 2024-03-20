import Tooltip from "@components/common/tooltip/Tooltip";
import { FontSize } from "../common/common.styles";
import { StyledIconInfo } from "../common/styled-icon-info/StyledIconInfo";
import { Flex, Hover, TooltipContent } from "./HideMe.styles";

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
      <FontSize>
        {isMobile ? "Hide me" : "Hide my address or username"}
      </FontSize>
    </Flex>
  );
};

export default HideMe;
