import { Menu, Space, Switch } from "antd";
import { useState } from "react";

import { FaUniversity } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { MdOutlineEngineering } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import { FaUserGraduate } from "react-icons/fa";
import { IoIosSchool } from "react-icons/io";
import { MdEmojiPeople } from "react-icons/md";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

function getItem(label, key, icon, children, title) {
  return {
    key,
    icon,
    children,
    label,
    title,
  };
}

const SideBarContents = (props) => {
  const { themeColor, collapsed } = props;
  const [mode, setMode] = useState("inline");

  const style = {
    backgroundColor: themeColor === "light" ? "#fff" : "#001529",
    color: themeColor === "light" ? "#001529" : "#fff",
  };

  const items = [
    getItem("Staff", "1", <FaUniversity />, [
      getItem(
        "Faculty",
        "1.1",
        <GiTeacher />,
        null,
        collapsed === false ? "Faculty" : null
      ),
      getItem(
        "Technician",
        "1.2",
        <MdOutlineEngineering />,
        null,
        collapsed === false ? "Technician" : null
      ),
      getItem(
        "Adminstrator",
        "1.3",
        <RiAdminLine />,
        null,
        collapsed === false ? "Adminstrator" : null
      ),
    ]),
    getItem("Students", "2", <IoIosSchool />, [
      getItem(
        "Undergraduate",
        "2.1",
        <MdEmojiPeople />,
        null,
        collapsed === false ? "Undergraduate" : null
      ),
      getItem(
        "Postgraduate",
        "2.2",
        <FaUserGraduate />,
        null,
        collapsed === false ? "Postgraduate" : null
      ),
    ]),
    getItem(
      "Adminstrative",
      "3",
      <MdOutlineAdminPanelSettings />,
      null,
      collapsed === false ? "Adminstrative" : null
    ),
  ];

  const changeMode = (value) => {
    setMode(value ? "vertical" : "inline");
  };
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Switch onChange={changeMode} />
      <Menu
        theme={themeColor}
        mode={mode}
        defaultSelectedKeys={["1"]}
        items={items}
        style={{
          height: "100%",
          borderRight: 20,
          padding: 12,
          borderRadius: 20,
        }}
      />
    </Space>
  );
};

export default SideBarContents;
