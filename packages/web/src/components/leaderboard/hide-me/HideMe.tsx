import Tooltip from "@components/common/tooltip/Tooltip";
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

      {isMobile ? <p>Hide me</p> : <p>Hide my address or username</p>}
    </Flex>
  );
};

export default HideMe;
