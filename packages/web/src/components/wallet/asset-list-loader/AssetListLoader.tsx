import Button from "@components/common/button/Button";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import IconStrokeArrowUp from "@components/common/icons/IconStrokeArrowUp";
import { AssetListLoaderWrapper } from "./AssetListLoader.styles";

interface AssetListLoaderProps {
  extended: boolean;
  toggleExtended: () => void;
}

const AssetListLoader: React.FC<AssetListLoaderProps> = ({
  extended,
  toggleExtended,
}) => (
  <AssetListLoaderWrapper>
    <Button
      style={{
        bgColor: "colorBlack",
        textColor: "gray40",
        fontType: "body12"
      }}
      text={extended ? "Show less" : "Load more"}
      rightIcon={extended ? <IconStrokeArrowUp /> : <IconStrokeArrowDown />}
      onClick={toggleExtended}
    />
  </AssetListLoaderWrapper>
);

export default AssetListLoader;
