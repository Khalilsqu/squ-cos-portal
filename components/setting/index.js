import { SettingOutlined } from "@ant-design/icons";
import { Dropdown, Space, Switch } from "antd";
import ThemeSwitch from "../themeSwitch";
import CustomTooltip from "../tooltip/customtooltip";
// import { menuModeState } from "@/components/sideBarContents";

const SettingGear = (props) => {
  const { themeColor, handleThemeChange } = props;
  // const [menuMode, setMenuModeChange] = menuModeState((state) => [
  //   state.menuMode,
  //   state.setMenuModeChange,
  // ]);

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
    // {
    //   key: "1",
    //   icon: (
    //     <CustomTooltip
    //       title={
    //         menuMode === "inline"
    //           ? "Change sidebar menu mode to vertical"
    //           : "Change sidebar menu mode to inline"
    //       }
    //       placement="right"
    //     >
    //       <Switch
    //         checkedChildren="inline"
    //         unCheckedChildren="vertical"
    //         defaultChecked
    //         onChange={setMenuModeChange}
    //       />
    //     </CustomTooltip>
    //   ),
    // },
  ];

  return (
    <CustomTooltip title="Settings" placement="right">
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
    </CustomTooltip>
  );
};

export default SettingGear;
