import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { Layout, Space } from "antd";
import Authentication from "../authentication/auth";
import CustomTooltip from "../tooltip/customtooltip";
import SettingGear from "../setting";

import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { useSession } from "next-auth/react";

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
  const {
    handleBreakPoint,
    isBreakPoint,
    handleThemeChange,
    handleShowAdminPanel,
  } = props;
  const { themeColor } = useContext(LayoutContext);
  const { data: session, status } = useSession();

  const router = useRouter();

  // const [spaceGap, setSpaceGap] = useState(10);

  // useEffect(() => {
  //   setSpaceGap(20);
  // }, [isBreakPoint, collapsed]);

  return (
    <Header
      style={
        themeColor === "light"
          ? { backgroundColor: "#fff", ...additionalStyles }
          : { backgroundColor: "#001529", ...additionalStyles }
      }
    >
      <Space className="flex justify-between">
        <Space
          style={{
            display: "flex",
            justifyContent: "flex-start",
            rowGap: 20,
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
          ) : (
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
          )}
          {/* <Link href="/">
            <CustomTooltip title="Go to Home" placement="right">
              <HomeOutlined
                style={{
                  fontSize: "28px",
                  color: themeColor === "light" ? "#001529" : "#fff",
                }}
              />
            </CustomTooltip>
          </Link> */}
        </Space>
        <Space
          style={{
            rowGap: 20,
          }}
        >
          {status === "authenticated" && (
            <CustomTooltip title="Admin Dashboard" placement="left">
              <MdOutlineDashboardCustomize
                onClick={() => {
                  handleShowAdminPanel(true);
                  router.push("/admin-dashboard");
                }}
                className="flex cursor-pointer text-2xl"
              />
            </CustomTooltip>
          )}
          <Authentication
            themeColor={themeColor}
            handleShowAdminPanel={handleShowAdminPanel}
          />
          <SettingGear
            themeColor={themeColor}
            handleThemeChange={handleThemeChange}
          />
        </Space>
      </Space>
    </Header>
  );
}
