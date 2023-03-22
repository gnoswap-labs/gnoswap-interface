import IconMoon from "@components/common/icons/IconMoon";
import IconSun from "@components/common/icons/IconSun";
import { ThemeModeButtonWrapper, ToggleButton } from "./ThemeModeButton.styles";

interface ThemeModeButtonProps {
  themeKey: string;
  toggleTheme: () => void;
}

const ThemeModeButton: React.FC<ThemeModeButtonProps> = ({
  themeKey,
  toggleTheme,
}) => {
  return (
    <ThemeModeButtonWrapper
      onClick={toggleTheme}
      darkMode={themeKey === "dark"}
    >
      <IconMoon className="dark-icon" />
      <IconSun className="light-icon" />
      <ToggleButton darkMode={themeKey === "dark"} />
    </ThemeModeButtonWrapper>
  );
};

export default ThemeModeButton;
