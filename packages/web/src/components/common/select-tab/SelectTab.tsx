import { SelectButton, SelectTabWrapper } from "./SelectTab.styles";
import { cx } from "@emotion/css";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  return (
    <SelectTabWrapper className="select-tab-wrapper">
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
          {t(type)}
        </SelectButton>
      ))}
    </SelectTabWrapper>
  );
};

export default SelectTab;
