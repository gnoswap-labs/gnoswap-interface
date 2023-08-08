import {
  SearchInputWrapper,
  InputStyle,
  SearchInputStyleProps,
} from "./SearchInput.styles";
import IconSearch from "@components/common/icons/IconSearch";
import { cx } from "@emotion/css";
interface SearchInputProps extends SearchInputStyleProps {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  className,
  fullWidth = false,
  width,
  height = "48px",
  placeholder = "Search",
  value,
  onChange,
}: SearchInputProps) => {
  return (
    <SearchInputWrapper
      fullWidth={fullWidth}
      width={width}
      height={height}
      className={cx(className, { "empty-status": value === "" })}
    >
      <InputStyle placeholder={placeholder} value={value} onChange={onChange} />
      <div className="icon-wrapper">
        <IconSearch className="search-icon" />
      </div>
    </SearchInputWrapper>
  );
};

export default SearchInput;
