import { Info } from "../leaderboard-list-header/LeaderboardListTable.styles";
import { Flex, Hover } from "./HideMe.styles";

const HideMe = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <Hover>
      <Flex>
        <Info />
        {isMobile ? <p>Hide me</p> : <p>Hide my address or username</p>}
      </Flex>
    </Hover>
  );
};

export default HideMe;
