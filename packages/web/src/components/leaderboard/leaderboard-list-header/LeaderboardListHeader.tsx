import { useWindowSize } from "@hooks/common/use-window-size";
import { useConnection } from "@hooks/connection/use-connection";
import ConnectYourWallet from "../connect-your-wallet/ConnectYourWallet";
import NextUpdate from "../next-update/NextUpdate";
import { ListHeaderWrapper } from "./LeaderboardListTable.styles";

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
