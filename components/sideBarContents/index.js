import { Menu, Space } from "antd";
import { create } from "zustand";

import { FaUniversity } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { MdOutlineEngineering } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import { FaUserGraduate } from "react-icons/fa";
import { IoIosSchool } from "react-icons/io";
import { MdEmojiPeople } from "react-icons/md";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import Image from "next/image";

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
  const { themeColor, collapsed, isBreakPoint } = props;
  const [menuMode, setMenuModeChange] = menuModeState((state) => [
    state.menuMode,
    state.setMenuModeChange,
  ]);

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
    <Space
      direction="vertical"
      className="
      w-full
    "
    >
      <Space className="w-full justify-center">
        <Image
          src="/squ.png"
          width={60}
          height={80}
          alt="SQU Logo"
          // hide the image from screen readers when collapsed or isBreakPoint
          className={
            (isBreakPoint
              ? "hidden"
              : collapsed
              ? "w-5 h-7 rotate-[360deg]"
              : "flex") + " mt-4 transition-all duration-1000"
          }
        />
      </Space>
      <Menu
        theme={themeColor}
        mode={menuMode}
        defaultSelectedKeys={["1"]}
        items={items}
        className="w-full"
      />
    </Space>
  );
};

export default SideBarContents;
