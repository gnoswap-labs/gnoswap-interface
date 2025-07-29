import { Trans, useTranslation } from "react-i18next";

import { TableHeadItem } from "@layouts/leaderboard-layout/leaderboard-list/LeaderboardList";
import { ListHead, TableHeader, TableHeaderTooltipContent } from "./LeaderboardTableHeader.styles";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";

const LeaderboardTableHeader = ({ heads, headWidths }: { heads: TableHeadItem[]; headWidths: number[] }) => {
  const { t } = useTranslation();

  return (
    <ListHead>
      {heads.map((head, index) => (
        <TableHeader key={index} tdWidth={headWidths[index]}>
          <span>{t(head.label)}</span>
          {head.tooltip && (
            <Tooltip
              placement="top"
              FloatingContent={
                <TableHeaderTooltipContent>
                  <Trans
                    i18nKey={head.tooltip}
                    components={{ ul: <ul style={{ margin: 0, paddingLeft: "16px" }} />, li: <li /> }}
                  />
                </TableHeaderTooltipContent>
              }
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
