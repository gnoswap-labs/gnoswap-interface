import { Box } from "@components/leaderboard/common/common.styles";
import { useConnection } from "@hooks/connection/use-connection";
import { useEffect, useRef, useState } from "react";
import ConnectYourWallet from "../../components/leaderboard/connect-your-wallet/ConnectYourWallet";
import NextUpdate from "../../components/leaderboard/next-update/NextUpdate";
import { ListHeaderWrapper } from "./LeaderboardListHeaderContainer.styles";

const LeaderboardListHeaderContainer = () => {
  const { connected } = useConnection();
  const [checked, setChecked] = useState(true);
  const onSwitch = () => setChecked(v => !v);

  const divRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let collapsePoint = 0;

    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        const { width } = entry.contentRect;
        const left = leftRef.current?.offsetWidth || 0;
        const right = rightRef.current?.offsetWidth || 0;
        const gap = width - left - right;

        const collapse = 16;

        if (gap > collapse && width > collapsePoint) {
          return setIsMobile(false);
        }

        setIsMobile(v => {
          if (!v) collapsePoint = width;
          return true;
        });
      });
    });

    if (divRef.current) {
      resizeObserver.observe(divRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [divRef]);

  return (
    <ListHeaderWrapper ref={divRef}>
      <Box ref={leftRef}>
        <ConnectYourWallet
          connected={connected}
          isMobile={isMobile}
          checked={checked}
          onSwitch={onSwitch}
        />
      </Box>

      <Box ref={rightRef}>
        <NextUpdate />
      </Box>
    </ListHeaderWrapper>
  );
};

export default LeaderboardListHeaderContainer;
