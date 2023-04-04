import { Button, Menu, Space, Typography } from "antd";
import { useSession } from "next-auth/react";
import { FaUniversity } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { MdOutlineEngineering } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import { FaUserGraduate } from "react-icons/fa";
import { IoIosSchool } from "react-icons/io";
import { MdEmojiPeople } from "react-icons/md";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import CustomTooltip from "../tooltip/customtooltip";
import { AdminMenu } from "./adminOptions";

export function getItem(label, key, icon, children, title) {
  return {
    key,
    icon,
    children,
    label,
    title,
  };
}

export const SideBarContents = (props) => {
  const {
    themeColor,
    collapsed,
    isBreakPoint,
    showAdminPanel,
    handleShowAdminPanel,
  } = props;
  const [selectedKey, setSelectedKey] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);

  const { data: session, status } = useSession();

  const router = useRouter();

  const handleClick = (e) => {
    if (e.keyPath.length === 1) {
      router.push("/" + e.key);
    } else {
      router.push("/" + e.keyPath[1] + "/" + e.key);
    }
  };
  const handleSelectionStaff = () => {
    router.push("/staff");
    setSelectedKey(["staff"]);
  };

  const handleSelectionStudents = () => {
    router.push("/students");
    setSelectedKey(["students"]);
  };

  const handleOpenKeys = (keys) => {
    setOpenKeys(keys);
  };

  const items = [
    getItem(
      <Space className="flex justify-between">
        <Typography.Text
          className={
            (selectedKey[0] === "staff") & (themeColor === "light")
              ? "text-blue-500"
              : (selectedKey[0] === "staff") & (themeColor === "dark") &&
                "text-stone-100 bg-blue-400 rounded-lg px-2"
          }
        >
          Staff
        </Typography.Text>
        <Button
          onClick={handleSelectionStaff}
          shape="circle"
          size="small"
          icon={<AiOutlineUsergroupAdd />}
        />
      </Space>,
      "staff",
      <FaUniversity />,
      [
        getItem(
          "Faculty",
          "faculty",
          <GiTeacher />,
          null,
          collapsed === false ? "Faculty" : null
        ),
        getItem(
          "Technician",
          "technician",
          <MdOutlineEngineering />,
          null,
          collapsed === false ? "Technician" : null
        ),
        getItem(
          "Adminstrator",
          "adminstrator",
          <RiAdminLine />,
          null,
          collapsed === false ? "Adminstrator" : null
        ),
      ],
      collapsed === false ? "Staff" : null
    ),
    getItem(
      <Space className="flex justify-between">
        <Typography.Text
          className={
            (selectedKey[0] === "students") & (themeColor === "light")
              ? "text-blue-500"
              : (selectedKey[0] === "students") & (themeColor === "dark") &&
                "text-stone-100 bg-blue-400 rounded-lg px-2"
          }
        >
          Students
        </Typography.Text>
        <Button
          onClick={handleSelectionStudents}
          shape="circle"
          size="small"
          icon={<AiOutlineUsergroupAdd />}
        />
      </Space>,
      "students",
      <IoIosSchool onClick={(e) => router.push("/students")} />,
      [
        getItem(
          "Undergraduate",
          "undergraduate",
          <MdEmojiPeople />,
          null,
          collapsed === false ? "Undergraduate" : null
        ),
        getItem(
          "Postgraduate",
          "postgraduate",
          <FaUserGraduate />,
          null,
          collapsed === false ? "Postgraduate" : null
        ),
      ]
    ),
    getItem(
      "Adminstrative",
      "adminstrative",
      <MdOutlineAdminPanelSettings />,
      null,
      collapsed === false ? "Adminstrative" : null
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
              handleShowAdminPanel(false);
            }}
          />
        </CustomTooltip>
      </Space>
      {!showAdminPanel ? (
        <Menu
          theme={themeColor}
          mode="inline"
          selectedKeys={selectedKey}
          items={items}
          className="w-full"
          onClick={handleClick}
          onSelect={(e) => {
            setSelectedKey([e.key]);
          }}
          onOpenChange={handleOpenKeys}
          openKeys={openKeys}
        />
      ) : (
        status === "authenticated" && (
          <AdminMenu
            themeColor={themeColor}
            collapsed={collapsed}
            isBreakPoint={isBreakPoint}
          />
        )
      )}
    </Space>
  );
};

export default SideBarContents;
