import { Menu, Space, Switch } from "antd";
import { useState } from "react";
import { create } from "zustand";

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

export const menuModeState = create((set) => ({
  menuMode: "inline",
  setMenuModeChange: () =>
    set((state) => ({
      menuMode: state.menuMode === "inline" ? "vertical" : "inline",
    })),
}));

export const SideBarContents = (props) => {
  const { themeColor, collapsed } = props;
  const [menuMode, setMenuModeChange] = menuModeState((state) => [
    state.menuMode,
    state.setMenuModeChange,
  ]);

  const changeMode = (value) => {
    setMode(value ? "vertical" : "inline");
  };

  const items = [
    getItem("Staff", "1", <FaUniversity />, [
      getItem(
        "Faculty",
        "1.1",
        <GiTeacher />,
        null,
        (collapsed === false) & (menuMode === "inline") ? "Faculty" : null
      ),
      getItem(
        "Technician",
        "1.2",
        <MdOutlineEngineering />,
        null,
        (collapsed === false) & (menuMode === "inline") ? "Technician" : null
      ),
      getItem(
        "Adminstrator",
        "1.3",
        <RiAdminLine />,
        null,
        (collapsed === false) & (menuMode === "inline") ? "Adminstrator" : null
      ),
    ]),
    getItem("Students", "2", <IoIosSchool />, [
      getItem(
        "Undergraduate",
        "2.1",
        <MdEmojiPeople />,
        null,
        (collapsed === false) & (menuMode === "inline") ? "Undergraduate" : null
      ),
      getItem(
        "Postgraduate",
        "2.2",
        <FaUserGraduate />,
        null,
        (collapsed === false) & (menuMode === "inline") ? "Postgraduate" : null
      ),
    ]),
    getItem(
      "Adminstrative",
      "3",
      <MdOutlineAdminPanelSettings />,
      null,
      (collapsed === false) & (menuMode === "inline") ? "Adminstrative" : null
    ),
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Menu
        theme={themeColor}
        mode={menuMode}
        defaultSelectedKeys={["1"]}
        items={items}
        style={{
          borderRight: 20,
          padding: 12,
          borderRadius: 20,
          justifyContent: "left",
        }}
      />
    </Space>
  );
};

export default SideBarContents;
