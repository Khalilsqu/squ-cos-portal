import { SettingOutlined } from "@ant-design/icons";
import { Dropdown, Space, Switch } from "antd";
import ThemeSwitch from "../themeSwitch";
// import CustomTooltip from "../tooltip/customtooltip";

const SettingGear = (props) => {
  const { themeColor, handleThemeChange } = props;

  const items = [
    {
      key: "0",
      icon: (
        <ThemeSwitch
          themeColor={themeColor}
          handleThemeChange={handleThemeChange}
        />
      ),
    },
  ];

  return (
    // <CustomTooltip title="Settings" placement="right">
    <Dropdown
      menu={{
        items,
      }}
      trigger={["click"]}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        rowGap: "10px",
      }}
    >
      <SettingOutlined
        style={{
          fontSize: "25px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      />
    </Dropdown>
    // </CustomTooltip>
  );
};

export default SettingGear;
