import { MdOutlineDarkMode, MdOutlineWbSunny } from "react-icons/md";
import { Switch } from "antd";
// import CustomTooltip from "../tooltip/customtooltip";

export default function ThemeSwitch(props) {
  const { handleThemeChange } = props;
  const { themeColor } = props;

  return (
    // <CustomTooltip
    //   title={
    //     themeColor === "light" ? "Switch to dark mode" : "Switch to light mode"
    //   }
    //   placement="right"
    // >
    <Switch
      checkedChildren={
        <MdOutlineWbSunny
          style={{
            fontSize: "18px",
            paddingTop: "2px",
          }}
        />
      }
      unCheckedChildren={
        <MdOutlineDarkMode
          style={{
            display: "flex",
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
        textAlign: "center",
        color: themeColor === "light" ? "#001529" : "#fff",
      }}
    />
    // </CustomTooltip>
  );
}
