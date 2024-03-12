import TableSkeleton from "@components/common/table-skeleton/TableSkeleton";
import {
  TableHeader,
  TableWrapper,
  ListBody,
  ListHead,
  ScrollWrapper,
} from "./LeaderboardListTable.styles";
import {
  LEADERBOARD_TD_WIDTH,
  LEADER_INFO,
  MOBILE_LEADERBOARD_TD_WIDTH,
  MOBILE_LEADER_INFO,
} from "@constants/skeleton.constant";
import { DEVICE_TYPE } from "@styles/media";
import {
  Leader,
  TABLE_HEAD,
  TABLE_HEAD_MOBILE,
} from "@containers/leaderboard-list-container/LeaderboardListContainer";
import LeaderboardInfo from "../leaderboard-info/LeaderboardInfo";
import LeaderboardInfoMobile from "../leaderboard-info-mobile/LeaderboardInfo";

const WEB_DEVICE_TYPES: DEVICE_TYPE[] = [
  DEVICE_TYPE.MEDIUM_WEB,
  DEVICE_TYPE.WEB,
];

const LeaderboardListTable = ({
  leaders,
  isFetched,
  breakpoint,
}: {
  leaders: Leader[];
  isFetched: boolean;
  breakpoint: DEVICE_TYPE;
}) => {
  return (
    <TableWrapper>
      <ScrollWrapper>
        <ListHead>
          {WEB_DEVICE_TYPES.includes(breakpoint) ? (
            <>
              {Object.values(TABLE_HEAD).map((head, index) => (
                <TableHeader key={index} tdWidth={LEADERBOARD_TD_WIDTH[index]}>
                  <span>{head}</span>
                </TableHeader>
              ))}
            </>
          ) : (
            <>
              {Object.values(TABLE_HEAD_MOBILE).map((head, index) => (
                <TableHeader
                  key={index}
                  tdWidth={MOBILE_LEADERBOARD_TD_WIDTH[index]}
                >
                  <span>{head}</span>
                </TableHeader>
              ))}
            </>
          )}
        </ListHead>
        <ListBody>
          {isFetched &&
            leaders.map((item, index) => (
              <>
                {WEB_DEVICE_TYPES.includes(breakpoint) ? (
                  <LeaderboardInfo key={index} item={item} />
                ) : (
                  <LeaderboardInfoMobile key={index} item={item} />
                )}
              </>
            ))}
          {!isFetched && (
            <TableSkeleton
              info={
                WEB_DEVICE_TYPES.includes(breakpoint)
                  ? LEADER_INFO
                  : MOBILE_LEADER_INFO
              }
            />
          )}
        </ListBody>
      </ScrollWrapper>
    </TableWrapper>
  );
};

export default LeaderboardListTable;

//className={leaders.length === 0 ? "hidden-scroll" : ""}
