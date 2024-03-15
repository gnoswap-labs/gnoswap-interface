import { StyledIconInfo } from "../common/styled-icon-info/StyledIconInfo";
import { Flex, Hover } from "./HideMe.styles";

const HideMe = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <Hover>
      <Flex>
        <StyledIconInfo />
        {isMobile ? <p>Hide me</p> : <p>Hide my address or username</p>}
      </Flex>
    </Hover>
  );
};

export default HideMe;
