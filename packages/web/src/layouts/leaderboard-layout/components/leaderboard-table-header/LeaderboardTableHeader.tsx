import { TableHeadItem } from "@layouts/leaderboard-layout/leaderboard-list/LeaderboardList";
import { ListHead, TableHeader, TableHeaderTooltipContent } from "./LeaderboardTableHeader.styles";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";

const LeaderboardTableHeader = ({ heads, headWidths }: { heads: TableHeadItem[]; headWidths: number[] }) => {
  return (
    <ListHead>
      {heads.map((head, index) => (
        <TableHeader key={index} tdWidth={headWidths[index]}>
          <span>{head.label}</span>
          {head.tooltip && (
            <Tooltip
              placement="top"
              FloatingContent={<TableHeaderTooltipContent>{head.tooltip}</TableHeaderTooltipContent>}
            >
              <IconInfo size={16} />
            </Tooltip>
          )}
        </TableHeader>
      ))}
    </ListHead>
  );
};

export default LeaderboardTableHeader;
