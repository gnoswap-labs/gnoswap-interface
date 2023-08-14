import { EarnMyPositionswrapper } from "./EarnMyPositions.styles";

interface EarnMyPositionsProps {
  header: React.ReactNode;
  content: React.ReactNode;
}

const EarnMyPositions: React.FC<EarnMyPositionsProps> = ({
  header,
  content,
}) => (
  <EarnMyPositionswrapper>
    {header}
    {content}
  </EarnMyPositionswrapper>
);

export default EarnMyPositions;
