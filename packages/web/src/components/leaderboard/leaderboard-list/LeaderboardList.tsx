import Pagination from "@components/common/pagination/Pagination";
import { Wrapper } from "./LeaderboardList.styles";
import { DEVICE_TYPE } from "@styles/media";
import { Leader } from "@containers/leaderboard-list-container/LeaderboardListContainer";
import LeaderboardListTable from "../leaderboard-list-table/LeaderboardListTable";
import LeaderboardListHeader from "../leaderboard-list-header/LeaderboardListHeader";

export default function LeaderboardList({
  me,
  leaders,
  isFetched,
  // error,
  currentPage,
  totalPage,
  movePage,
  breakpoint,
}: {
  me: Leader;
  leaders: Leader[];
  isFetched: boolean;
  error: Error | null;
  currentPage: number;
  totalPage: number;
  movePage: (page: number) => void;
  breakpoint: DEVICE_TYPE;
}) {
  return (
    <Wrapper>
      <LeaderboardListHeader />
      <LeaderboardListTable me={me} leaders={leaders} isFetched={isFetched} />
      {totalPage > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPage={totalPage}
          onPageChange={movePage}
          siblingCount={breakpoint !== DEVICE_TYPE.MOBILE ? 2 : 1}
        />
      )}
    </Wrapper>
  );
}
