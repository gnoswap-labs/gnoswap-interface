import { SelectButton, SelectTabWrapper } from "./SelectTab.styles";
import { cx } from "@emotion/css";
import { useTranslation } from "react-i18next";
export interface SelectTabItem {
  display: string;
  key: string;
}

interface SelectTabProps {
  selectType: string;
  list: string[] | SelectTabItem[];
  onClick: (type: string) => void;
  buttonClassName?: string;
}

const SelectTab: React.FC<SelectTabProps> = ({ selectType, list, onClick, buttonClassName }) => {
  const { t } = useTranslation();

  return (
    <SelectTabWrapper className="select-tab-wrapper">
      {list.map((item, idx) => {
        const value = typeof item === "string" ? item : item.key;
        const display = typeof item === "string" ? t(item) : item.display;

        return (
          <SelectButton
            key={idx}
            className={cx({
              selected: value === selectType,
              [`${buttonClassName}`]: buttonClassName !== undefined,
            })}
            onClick={() => onClick(value)}
            disabled={value === selectType}
          >
            {display}
          </SelectButton>
        );
      })}
    </SelectTabWrapper>
  );
};

export default SelectTab;
