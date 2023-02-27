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
import { useRouter } from "next/router";
import CustomTooltip from "../tooltip/customtooltip";

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

  const router = useRouter();

  const handleClick = (e) => {
    if (e.keyPath.length === 1) {
      router.push("/" + e.key);
    } else {
      router.push("/" + e.keyPath[1] + "/" + e.key);
    }
  };

  const items = [
    getItem(
      <Space
        onClick={(e) => {
          router.push("/staff");
        }}
      >
        Staff
      </Space>,
      "staff",
      <FaUniversity
        onClick={(e) => {
          router.push("/staff");
        }}
      />,
      [
        getItem(
          "Faculty",
          "faculty",
          <GiTeacher />,
          null,
          (collapsed === false) & (menuMode === "inline") ? "Faculty" : null
        ),
        getItem(
          "Technician",
          "technician",
          <MdOutlineEngineering />,
          null,
          (collapsed === false) & (menuMode === "inline") ? "Technician" : null
        ),
        getItem(
          "Adminstrator",
          "adminstrator",
          <RiAdminLine />,
          null,
          (collapsed === false) & (menuMode === "inline")
            ? "Adminstrator"
            : null
        ),
      ],
      (collapsed === false) & (menuMode === "inline") ? "Staff" : null
    ),
    getItem(
      <Space onClick={(e) => router.push("/students")}>Students</Space>,
      "students",
      <IoIosSchool onClick={(e) => router.push("/students")} />,
      [
        getItem(
          "Undergraduate",
          "undergraduate",
          <MdEmojiPeople />,
          null,
          (collapsed === false) & (menuMode === "inline")
            ? "Undergraduate"
            : null
        ),
        getItem(
          "Postgraduate",
          "postgraduate",
          <FaUserGraduate />,
          null,
          (collapsed === false) & (menuMode === "inline")
            ? "Postgraduate"
            : null
        ),
      ]
    ),
    getItem(
      "Adminstrative",
      "adminstrative",
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
        <CustomTooltip title="Home " placement="right">
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
                ? "w-5 h-7 rotate-[360deg] hover:cursor-pointer"
                : "flex") +
              " mt-4 transition-all duration-1000 hover:cursor-pointer"
            }
            onClick={() => {
              router.push("/");
            }}
          />
        </CustomTooltip>
      </Space>
      <Menu
        theme={themeColor}
        mode={menuMode}
        defaultSelectedKeys={["1"]}
        items={items}
        className="w-full"
        onClick={handleClick}
      />
    </Space>
  );
};

export default SideBarContents;
