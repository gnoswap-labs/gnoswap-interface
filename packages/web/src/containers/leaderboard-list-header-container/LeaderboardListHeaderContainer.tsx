import { useWindowSize } from "@hooks/common/use-window-size";
import { useConnection } from "@hooks/connection/use-connection";
import ConnectYourWallet from "../../components/leaderboard/connect-your-wallet/ConnectYourWallet";
import NextUpdate from "../../components/leaderboard/next-update/NextUpdate";
import { ListHeaderWrapper } from "./LeaderboardListHeaderContainer.styles";

const LeaderboardListHeaderContainer = () => {
  const { connected } = useConnection();
  const { isMobile } = useWindowSize();

  return (
    <ListHeaderWrapper>
      <ConnectYourWallet connected={connected} isMobile={isMobile} />

      <NextUpdate />
    </ListHeaderWrapper>
  );
};

export default LeaderboardListHeaderContainer;
