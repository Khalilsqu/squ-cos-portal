import { useContext, forwardRef } from "react";
import { useRouter } from "next/router";
import { Button, Layout, Space, Spin } from "antd";
import Icon from "@ant-design/icons";
import Authentication from "../authentication/auth";
import CustomTooltip from "../tooltip/customtooltip";
import SettingGear from "../setting";

import useSWR from "swr";
import { fetcher } from "@/components/utils/useSwrFetcher";
import Image from "next/image";

import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { useSession } from "next-auth/react";
import { useWindowSize } from "../utils/windowSize";

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

const MenuFoldOutlinedIcon = forwardRef((props, ref) => (
  <Icon component={MenuFoldOutlined} ref={ref} {...props} />
));

const MenuUnfoldOutlinedIcon = forwardRef((props, ref) => (
  <Icon component={MenuUnfoldOutlined} ref={ref} {...props} />
));

export default function HeaderComponent(props) {
  const {
    handleBreakPoint,
    isBreakPoint,
    handleThemeChange,
    handleShowAdminPanel,
  } = props;
  const { themeColor } = useContext(LayoutContext);
  const { data: session } = useSession();

  const { data: adminUsers, isLoading } = useSWR(
    "/api/dashboard/admins",
    fetcher,
    {
      refreshInterval: 0,
    }
  );

  const adminEmails = adminUsers?.map((user) => user.email);

  const isAdmin = adminEmails?.includes(session?.user?.email);

  const router = useRouter();

  const { width } = useWindowSize();

  return (
    <Header
      style={
        themeColor === "light"
          ? { backgroundColor: "#fff", ...additionalStyles }
          : { backgroundColor: "#001529", ...additionalStyles }
      }
    >
      <Space className="flex justify-between">
        <Space className="flex justify-start items-center gap-5">
          {width > 576 ? (
            isBreakPoint ? (
              <CustomTooltip
                title="Open Sidebar"
                mouseLeaveDelay={0}
                placement="right"
              >
                <MenuUnfoldOutlinedIcon
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
                <MenuFoldOutlinedIcon
                  onClick={handleBreakPoint}
                  style={{
                    fontSize: "24px",
                    color: themeColor === "light" ? "#001529" : "#fff",
                  }}
                />
              </CustomTooltip>
            )
          ) : (
            <CustomTooltip title="Home" placement="right">
              <Image
                src="/squ.png"
                width={35}
                height={45}
                alt="SQU Logo"
                onClick={() => {
                  router.push("/");
                  handleShowAdminPanel(false);
                }}
                className="cursor-pointer flex items-center justify-center"
              />
            </CustomTooltip>
          )}
        </Space>
        <Space
          style={{
            rowGap: 20,
          }}
        >
          {isAdmin &&
            (isLoading ? (
              <Spin className="flex items-center justify-center" />
            ) : (
              <CustomTooltip title="Admin Dashboard" placement="left">
                <Button
                  onClick={() => {
                    handleShowAdminPanel(true);
                    router.push("/admin-dashboard");
                  }}
                  type="text"
                  icon={<MdOutlineDashboardCustomize />}
                  className="text-2xl flex items-center justify-center"
                />
              </CustomTooltip>
            ))}
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
