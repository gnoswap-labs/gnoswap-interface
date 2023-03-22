import { SelectButton, SelectTabWrapper } from "./SelectTab.styles";

interface SelectTabProps {
  selectIdx: number;
  list: string[];
  onClick: (idx: number) => void;
}

const SelectTab: React.FC<SelectTabProps> = ({
  selectIdx = 0,
  list,
  onClick,
}) => {
  return (
    <SelectTabWrapper>
      {list?.map((item, idx) => (
        <SelectButton
          key={idx}
          className={idx === selectIdx ? "selected" : ""}
          onClick={() => onClick(idx)}
        >
          {item}
        </SelectButton>
      ))}
    </SelectTabWrapper>
  );
};

export default SelectTab;
