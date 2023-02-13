import { useContext, useRef, useEffect } from "react";
import { Layout, Tooltip, Col, Row, Switch, Space } from "antd";
import Link from "next/link";
import Authentication from "../authentication/auth";
import { MdOutlineDarkMode, MdOutlineWbSunny } from "react-icons/md";

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

  const switchRef = useRef();

  useEffect(() => {
    setInterval(() => {
      switchRef.current.props.visible && switchRef.current.close();
    }, 2000);
  }, []);

  return (
    <Header
      style={
        themeColor === "light"
          ? { backgroundColor: "#fff", ...additionalStyles }
          : { backgroundColor: "#001529", ...additionalStyles }
      }
    >
      <Row align={"middle"}>
        <Col flex={1}>
          <Space>
            {isBreakPoint ? (
              <Tooltip
                title="Open Sidebar"
                mouseLeaveDelay={0}
                placement="right"
              >
                <MenuUnfoldOutlined
                  onClick={handleBreakPoint}
                  style={{
                    fontSize: "24px",
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
                    fontSize: "24px",
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
          </Space>
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
          <Space>
            <Authentication />
            <Tooltip
              title={
                themeColor === "light"
                  ? "Switch to Dark Mode"
                  : " Switch to Light Mode"
              }
              mouseLeaveDelay={0}
              placement="left"
              ref={switchRef}
            >
              <Switch
                checkedChildren={
                  <MdOutlineWbSunny
                    style={{
                      fontSize: "18px",
                      top: "2px",
                    }}
                  />
                }
                unCheckedChildren={
                  <MdOutlineDarkMode
                    style={{
                      fontSize: "18px",
                    }}
                  />
                }
                defaultChecked
                onChange={handleThemeChange}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </Tooltip>
          </Space>
        </Col>
      </Row>
    </Header>
  );
}
