import { MdOutlineDarkMode, MdOutlineWbSunny } from "react-icons/md";
import { Switch } from "antd";

export default function ThemeSwitch(props) {
  const { handleThemeChange } = props;
  return (
    <Switch
      checkedChildren={
        <MdOutlineWbSunny
          style={{
            fontSize: "18px",
            top: "2px",
          }}
        />
      }
      unCheckedChildren={
        <MdOutlineDarkMode
          style={{
            fontSize: "18px",
          }}
        />
      }
      defaultChecked
      onChange={handleThemeChange}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );
}
