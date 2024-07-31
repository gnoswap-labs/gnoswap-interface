import { SelectButton, SelectTabWrapper } from "./SelectTabV2.styles";
import { cx } from "@emotion/css";
import { useTranslation } from "react-i18next";
interface SelectTabProps {
  selectType: string;
  list: { display: string; key: string }[];
  onClick: ({ display, key }: { display: string; key: string }) => void;
  buttonClassName?: string;
}

const SelectTabV2: React.FC<SelectTabProps> = ({
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
            selected: type.key === selectType,
            [`${buttonClassName}`]: buttonClassName !== undefined,
          })}
          onClick={() => onClick(type)}
          disabled={type.key === selectType}
        >
          {t(type.display)}
        </SelectButton>
      ))}
    </SelectTabWrapper>
  );
};

export default SelectTabV2;
