import React, { useContext } from "react";
import { Layout, Button, Tooltip } from "antd";

import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

import { LayoutContext } from "@/components/layout/pageLayout";

const { Header } = Layout;

export default function HeaderComponent(props) {
  const { collapsed, handleBreakPoint, isBreakPoint, handleThemeChange } =
    props;
  const { themeColor } = useContext(LayoutContext);

  return (
    <Header
      style={
        themeColor === "light"
          ? { backgroundColor: "#fff" }
          : { backgroundColor: "#001529" }
      }
      className="flex justify-between items-center fixed w-full h-24"
    >
      {isBreakPoint ? (
        <Tooltip title="Open Sidebar" mouseLeaveDelay={0} placement="right">
          <MenuUnfoldOutlined onClick={handleBreakPoint} />
        </Tooltip>
      ) : collapsed ? (
        <Tooltip title="Close Sidebar" mouseLeaveDelay={0} placement="right">
          <MenuFoldOutlined onClick={handleBreakPoint} />
        </Tooltip>
      ) : null}
      <Button type="default" onClick={handleThemeChange}>
        Change color
      </Button>
    </Header>
  );
}
