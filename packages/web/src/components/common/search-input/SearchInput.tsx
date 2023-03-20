import {
  SearchInputWrapper,
  inputStyle,
  SearchInputStyleProps,
} from "./SearchInput.styles";
import IconSearch from "../icons/IconSearch";
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
      className={value === "" ? "empty-status" : className}
    >
      <input
        css={inputStyle}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <IconSearch className="search-icon" />
    </SearchInputWrapper>
  );
};

export default SearchInput;
