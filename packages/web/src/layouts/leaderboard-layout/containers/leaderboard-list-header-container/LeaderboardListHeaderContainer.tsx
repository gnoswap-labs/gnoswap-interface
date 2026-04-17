import { useEffect, useRef, useState } from "react";

import { useAddress } from "@hooks/common/use-address";
import { useGetLeaderboardByAddress, useUpdateLeaderboardHiddenState } from "@query/leaderboard";
import { DEVICE_TYPE } from "@styles/media";

import IconSearch from "@components/common/icons/IconSearch";
import SearchInput from "@components/common/search-input/SearchInput";
import { Box } from "../../components/common/common.styles";
import ConnectYourWallet from "../../components/connect-your-wallet/ConnectYourWallet";
import NextUpdate from "../../components/next-update/NextUpdate";
import { ListHeaderWrapper } from "./LeaderboardListHeaderContainer.styles";

interface LeaderboardListHeaderContainerProps {
  breakpoint: DEVICE_TYPE;
  page: number;
  keyword: string;
  isViewSearchIcon: boolean;
  searchRef: React.RefObject<HTMLDivElement>;
  onToggleSearch: () => void;
  onChangeKeyword: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OPTIMISTIC_UI_RESET_DELAY_MS = 1000;

const LeaderboardListHeaderContainer = ({
  breakpoint,
  page,
  keyword,
  isViewSearchIcon,
  searchRef,
  onToggleSearch,
  onChangeKeyword,
}: LeaderboardListHeaderContainerProps) => {
  const { address, connected } = useAddress();
  const { data: leaderboardMyInfo, isLoading: isLoadingLeaderboardMyInfo } = useGetLeaderboardByAddress(address || "");

  const isHidden = leaderboardMyInfo?.hiddenYn === "Y";

  const [checked, setChecked] = useState(false);
  const [isOptimisticUpdate, setIsOptimisticUpdate] = useState(false);
  const [isToggleDisabled, setIsToggleDisabled] = useState(false);

  const updateHiddenState = useUpdateLeaderboardHiddenState();

  useEffect(() => {
    if (leaderboardMyInfo && !isOptimisticUpdate) {
      setChecked(isHidden);
    }
  }, [leaderboardMyInfo, isHidden, isOptimisticUpdate]);

  const handleToggleHidden = () => {
    if (!address) return;

    setIsToggleDisabled(true);
    setIsOptimisticUpdate(true);
    setChecked(!checked);

    updateHiddenState.mutate(
      {
        address,
        request: { hidden: !checked },
      },
      {
        onSettled: () => {
          setTimeout(() => {
            setIsOptimisticUpdate(false);
            setIsToggleDisabled(false);
          }, OPTIMISTIC_UI_RESET_DELAY_MS);
        },
        onError: () => {
          setTimeout(() => {
            setChecked(isHidden);
          }, OPTIMISTIC_UI_RESET_DELAY_MS);
        },
      },
    );
  };

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
        {!isLoadingLeaderboardMyInfo && leaderboardMyInfo && (
          <ConnectYourWallet
            connected={connected}
            isMobile={isMobile}
            checked={checked}
            onSwitch={handleToggleHidden}
            disabled={isToggleDisabled || updateHiddenState.isLoading}
          />
        )}
      </Box>

      <Box ref={rightRef}>
        {breakpoint !== DEVICE_TYPE.MOBILE || !isViewSearchIcon ? <NextUpdate page={page} /> : null}

        {breakpoint === DEVICE_TYPE.WEB ? (
          <SearchInput width={300} value={keyword} onChange={onChangeKeyword} />
        ) : isViewSearchIcon ? (
          <div ref={(searchRef as unknown) as React.RefObject<HTMLDivElement>}>
            <SearchInput width={200} height={40} value={keyword} onChange={onChangeKeyword} />
          </div>
        ) : (
          <div onClick={onToggleSearch}>
            <IconSearch className="search-icon" />
          </div>
        )}
      </Box>
    </ListHeaderWrapper>
  );
};

export default LeaderboardListHeaderContainer;
