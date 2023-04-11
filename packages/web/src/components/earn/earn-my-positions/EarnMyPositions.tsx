import { wrapper } from "./EarnMyPositions.styles";

interface EarnMyPositionsProps {
  header: React.ReactNode;
  content: React.ReactNode;
}

const EarnMyPositions: React.FC<EarnMyPositionsProps> = ({
  header,
  content,
}) => (
  <div css={wrapper}>
    {header}
    {content}
  </div>
);

export default EarnMyPositions;
