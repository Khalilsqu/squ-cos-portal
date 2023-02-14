import { useContext, useState, useEffect } from "react";
import { Layout, Col, Row, Switch, Space } from "antd";
import Link from "next/link";
import Authentication from "../authentication/auth";
import { MdOutlineDarkMode, MdOutlineWbSunny } from "react-icons/md";
import CustomTooltip from "../tooltip/customtooltip";

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
  zIndex: 100,
};

export default function HeaderComponent(props) {
  const { collapsed, handleBreakPoint, isBreakPoint, handleThemeChange } =
    props;
  const { themeColor } = useContext(LayoutContext);

  const [spaceGap, setSpaceGap] = useState(10);

  useEffect(() => {
    setSpaceGap(30);
  }, [isBreakPoint, collapsed]);

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
          <Space
            style={{
              display: "flex",
              justifyContent: "flex-start",
              gap: spaceGap,
            }}
          >
            {isBreakPoint ? (
              <CustomTooltip
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
              </CustomTooltip>
            ) : collapsed ? (
              <CustomTooltip
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
              </CustomTooltip>
            ) : null}
            <Link href="/">
              <CustomTooltip title="Go to Home" placement="right">
                <HomeOutlined
                  style={{
                    fontSize: "28px",
                    color: themeColor === "light" ? "#001529" : "#fff",
                  }}
                />
              </CustomTooltip>
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
            <CustomTooltip
              title={
                themeColor === "light"
                  ? "Switch to Dark Mode"
                  : " Switch to Light Mode"
              }
              placement="left"
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
            </CustomTooltip>
          </Space>
        </Col>
      </Row>
    </Header>
  );
}
