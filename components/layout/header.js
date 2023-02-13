import { useContext } from "react";
import { Layout, Button, Tooltip, Col, Row, Switch } from "antd";
import Link from "next/link";
import Image from "next/image";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
} from "@ant-design/icons";

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
      <Row align={"middle"}>
        <Col
          flex={1}
          style={{
            justifyContent: "flex-start",
            display: "flex",
            gap: "1rem",
          }}
        >
          {isBreakPoint ? (
            <Tooltip title="Open Sidebar" mouseLeaveDelay={0} placement="right">
              <MenuUnfoldOutlined
                onClick={handleBreakPoint}
                style={{
                  fontSize: "28px",
                  color: themeColor === "light" ? "#001529" : "#fff",
                }}
              />
            </Tooltip>
          ) : collapsed ? (
            <Tooltip
              title="Close Sidebar"
              mouseLeaveDelay={0}
              placement="right"
            >
              <MenuFoldOutlined
                onClick={handleBreakPoint}
                style={{
                  fontSize: "28px",
                  color: themeColor === "light" ? "#001529" : "#fff",
                }}
              />
            </Tooltip>
          ) : null}
          <Link href="/">
            <HomeOutlined
              style={{
                fontSize: "28px",
                color: themeColor === "light" ? "#001529" : "#fff",
              }}
            />
          </Link>
        </Col>
        <Col
          flex={4}
          style={{
            justifyContent: "center",
            display: "flex",
          }}
        >
          PASS
        </Col>
        <Col
          flex={1}
          style={{
            justifyContent: "flex-end",
            display: "flex",
          }}
        >
          <Switch
            checkedChildren="Light"
            unCheckedChildren="Dark"
            defaultChecked
            onChange={handleThemeChange}
          />
        </Col>
      </Row>
    </Header>
  );
}
