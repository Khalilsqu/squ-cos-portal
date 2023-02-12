import { useContext } from "react";
import { Layout, Button, Tooltip, Col, Row, Switch } from "antd";
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
  padding: "0 10px",
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
    >
      <Row align={"middle"} justify={"start"}>
        <Col>
          <Link href="/">
            <Image src="/squ.png" alt="Logo" fill loading="lazy" />
          </Link>
          {isBreakPoint ? (
            <Tooltip title="Open Sidebar" mouseLeaveDelay={0} placement="right">
              <MenuUnfoldOutlined onClick={handleBreakPoint} />
            </Tooltip>
          ) : collapsed ? (
            <Tooltip
              title="Close Sidebar"
              mouseLeaveDelay={0}
              placement="right"
            >
              <MenuFoldOutlined onClick={handleBreakPoint} />
            </Tooltip>
          ) : null}
        </Col>
        <Switch
          checkedChildren="Light"
          unCheckedChildren="Dark"
          defaultChecked
          onChange={handleThemeChange}
        />
      </Row>
    </Header>
  );
}
