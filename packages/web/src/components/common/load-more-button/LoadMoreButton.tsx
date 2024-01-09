import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import IconStrokeArrowUp from "@components/common/icons/IconStrokeArrowUp";
import { ValuesType } from "utility-types";
import { wrapper } from "./LoadMoreButton.styles";

interface LoadMoreProps {
  show: boolean;
  onClick: () => void;
  text?: TEXT_TYPE;
}

export const TEXT_TYPE = {
  LOAD: ["View more", "View less"],
  SHOW: ["View more", "View less"],
} as const;

export type TEXT_TYPE = ValuesType<typeof TEXT_TYPE>;

const LoadMoreButton: React.FC<LoadMoreProps> = ({
  show,
  onClick,
  text = TEXT_TYPE.LOAD,
}) => (
  <button type="button" onClick={onClick} css={wrapper}>
    <span>{show ? text[0] : text[1]}</span>
    {show ? (
      <IconStrokeArrowDown className="icon-load" />
    ) : (
      <IconStrokeArrowUp className="icon-load" />
    )}
  </button>
);

export default LoadMoreButton;
