import IconStrokeArrowDown from "../icons/IconStrokeArrowDown";
import { wrapper } from "./LoadMoreButton.styles";

interface LoadMoreProps {
  onClick: () => void;
}

const LoadMoreButton: React.FC<LoadMoreProps> = ({ onClick }) => {
  return (
    <button type="button" onClick={onClick} css={wrapper}>
      <span>Load more</span>
      <IconStrokeArrowDown className="icon-load" />
    </button>
  );
};

export default LoadMoreButton;
