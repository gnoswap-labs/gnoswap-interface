import { SelectButton, SelectTabWrapper } from "./SelectTab.styles";
import { cx } from "@emotion/css";
interface SelectTabProps {
  selectType: string;
  list: string[];
  onClick: (type: string) => void;
}

const SelectTab: React.FC<SelectTabProps> = ({ selectType, list, onClick }) => {
  return (
    <SelectTabWrapper>
      {list.map((type, idx) => (
        <SelectButton
          key={idx}
          className={cx({ selected: type === selectType })}
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
