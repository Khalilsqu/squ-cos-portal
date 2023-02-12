import { useContext } from "react";
import { Layout, Button, Tooltip, Col, Row } from "antd";
import Link from "next/link";
import Image from "next/image";

import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

import { LayoutContext } from "@/components/layout/pageLayout";

const { Header } = Layout;

const additionalStyles = {
  position: "sticky",
  top: 0,
  height: "64px",
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "25px 25px 25px 25px",
};

export default function HeaderComponent(props) {
  const { collapsed, handleBreakPoint, isBreakPoint, handleThemeChange } =
    props;
  const { themeColor } = useContext(LayoutContext);

  return (
    <Header
      style={
        themeColor === "light"
          ? { backgroundColor: "#fff", ...additionalStyles }
          : { backgroundColor: "#001529", ...additionalStyles }
      }
      // className={"flex justify-between items-center fixed w-full h-24 bg-slate-400"}
    >
      {/* <Link
        href="https://www.squ.edu.om/"
        rel="noopener noreferrer"
        target="_blank"
      >
        <Image src="/squ-2.png" alt="Logo" fill />
      </Link> */}
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
