import Button from "@components/common/button/Button";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import IconStrokeArrowUp from "@components/common/icons/IconStrokeArrowUp";
import { wrapper } from "./LoadMoreButton.styles";

interface LoadMoreProps {
  show: boolean;
  onClick: () => void;
}

const LoadMoreButton: React.FC<LoadMoreProps> = ({ show, onClick }) => {
  return (
    <button type="button" onClick={onClick} css={wrapper}>
      <span>{show ? "Load more" : "Show less"}</span>
      {show ? (
        <IconStrokeArrowDown className="icon-load" />
      ) : (
        <IconStrokeArrowUp className="icon-load" />
      )}
    </button>
  );
};

export default LoadMoreButton;
