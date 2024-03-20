import Pagination from "@components/common/pagination/Pagination";
import LeaderboardTableWrapper from "@components/leaderboard/leaderboard-table-wrapper/LeaderboardTableWrapper";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useLeaders } from "@query/leaderboard";
import MobileLeaderboardTable from "@components/leaderboard/leaderboard-table/mobile-leaderboard-table/MobileLeaderboardTable";
import TabletLeaderboardTable from "@components/leaderboard/leaderboard-table/tablet-leaderboard-table/TabletLeaderboardTable";
import WebLeaderboardTable from "@components/leaderboard/leaderboard-table/web-leaderboard-table/WebLeaderboardTable";

export default function LeaderboardTableContainer() {
  const { isMobile, isTablet, isWeb } = useWindowSize();
  const [leadersQuery, meQuery] = useLeaders();

  // const [page, setPage] = useState(0);
  // const movePage = (page: number) => setPage(page);
  const movePage = () => {};

  return (
    <>
      <LeaderboardTableWrapper>
        {isMobile && (
          <MobileLeaderboardTable
            me={meQuery.data?.leader}
            leaders={leadersQuery.data!.leaders}
            isMobile={isMobile}
          />
        )}
        {isTablet && (
          <TabletLeaderboardTable
            me={meQuery.data?.leader}
            leaders={leadersQuery.data!.leaders}
            isMobile={isMobile}
          />
        )}
        {isWeb && (
          <WebLeaderboardTable
            me={meQuery.data?.leader}
            leaders={leadersQuery.data!.leaders}
            isMobile={isMobile}
          />
        )}
      </LeaderboardTableWrapper>

      <div style={{ marginTop: "4px" }}>
        <Pagination
          currentPage={leadersQuery.data!.currentPage}
          totalPage={leadersQuery.data!.totalPage}
          onPageChange={movePage}
          siblingCount={isMobile ? 1 : 2}
        />
      </div>
    </>
  );
}
