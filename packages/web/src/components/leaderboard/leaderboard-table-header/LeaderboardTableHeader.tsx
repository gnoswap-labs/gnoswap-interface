import { ListHead, TableHeader } from "./LeaderboardTableHeader.styles";

export default function LeaderboardTableHeader({
  heads,
  headWidths,
}: {
  heads: string[];
  headWidths: number[];
}) {
  return (
    <ListHead>
      {heads.map((head, index) => (
        <TableHeader key={index} tdWidth={headWidths[index]}>
          <span>{head}</span>
        </TableHeader>
      ))}
    </ListHead>
  );
}
