import { SelectButton, SelectTabWrapper } from "./SelectTab.styles";
import { cx } from "@emotion/css";
interface SelectTabProps {
  selectType: string;
  list: string[];
  onClick: (type: string) => void;
  buttonClassName?: string;
}

const SelectTab: React.FC<SelectTabProps> = ({
  selectType,
  list,
  onClick,
  buttonClassName,
}) => {
  return (
    <SelectTabWrapper>
      {list.map((type, idx) => (
        <SelectButton
          key={idx}
          className={cx({
            selected: type === selectType,
            [`${buttonClassName}`]: buttonClassName !== undefined,
          })}
          onClick={() => onClick(type)}
          disabled={type === selectType}
        >
          {type}
        </SelectButton>
      ))}
    </SelectTabWrapper>
  );
};

export default SelectTab;
