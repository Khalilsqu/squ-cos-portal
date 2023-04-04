import {
  Layout,
  theme,
  ConfigProvider,
  FloatButton,
  Cascader,
  Space,
  Typography,
  Button,
} from "antd";
import { useState, createContext, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { setCookie, getCookie } from "cookies-next";
import { create } from "zustand";
import HeaderComponent from "./header";
import FooterComponent from "./footer";
import SiderComponent from "./siderbar";
import { useWindowSize } from "../utils/windowSize";

import { AiOutlineUsergroupAdd } from "react-icons/ai";

const { Content } = Layout;
export const LayoutContext = createContext();

import { useSession } from "next-auth/react";

export const colorThemeState = create((set) => ({
  themeColor: "light",
  setThemeColorChange: (themeColor) =>
    set((state) => ({
      themeColor: themeColor,
    })),
}));

export const collapsedState = create((set) => ({
  collapsed: false,
  setCollapsedChange: (collapsed) =>
    set((state) => ({
      collapsed: collapsed,
    })),
}));

export const isBreakPointState = create((set) => ({
  isBreakPoint: false,
  setIsBreakPointChange: (isBreakPoint) =>
    set((state) => ({
      isBreakPoint: isBreakPoint,
    })),
}));

export default function PageLayout({ children }) {
  const router = useRouter();

  const { width } = useWindowSize();

  const { data: session, status } = useSession();
  let showAdminPanelValue = false;

  const [showAdminPanel, setShowAdminPanel] = useState(showAdminPanelValue);
  const [collapsed, setCollapsed] = collapsedState((state) => [
    state.collapsed,
    state.setCollapsedChange,
  ]);

  const [themeColor, setThemeColor] = colorThemeState((state) => [
    state.themeColor,
    state.setThemeColorChange,
  ]);
  const [isBreakPoint, setBreakPoint] = isBreakPointState((state) => [
    state.isBreakPoint,
    state.setIsBreakPointChange,
  ]);

  const handleThemeChange = () => {
    setThemeColor((prev) => (prev === "light" ? "dark" : "light"));
    setCookie("themeColor", themeColor === "light" ? "dark" : "light", {
      maxAge: 60 * 60 * 24 * 90,
    }); // 90 days
  };

  const handleCollapse = () => {
    setCollapsed((prev) => !prev);
    setCookie("collapsed", collapsed ? "false" : "true", {
      maxAge: 60 * 60 * 24 * 90,
    }); // 90 days
  };

  const handleBreakPoint = () => {
    setBreakPoint((prev) => !prev);
    setCookie("isBreakPoint", isBreakPoint ? "false" : "true", {
      maxAge: 60 * 60 * 24 * 90,
    }); // 90 days
  };

  const handleShowAdminPanel = (value) => {
    setShowAdminPanel(value);
    setCookie("showAdminPanel", value ? "true" : "false", {
      maxAge: 60 * 60 * 24 * 1,
    }); // 1 day
  };

  const [cascaderOpen, setCascaderOpen] = useState(false);
  const [cascaderValue, setCascaderValue] = useState([]);

  useEffect(() => {
    setThemeColor(getCookie("themeColor"));
    setCollapsed(getCookie("collapsed"));
    setBreakPoint(getCookie("isBreakPoint"));
    if (status !== "authenticated") {
      setCookie("showAdminPanel", "false", {
        maxAge: 60 * 60 * 24,
      }); // 1 day
      router.push("/");
    }
    setShowAdminPanel(getCookie("showAdminPanel"));

    // for smartphone view only set breakpoint to true
    if (width < 576) {
      setBreakPoint(true);
      setCascaderValue([]);
      setCascaderOpen(false);

      setCookie("isBreakPoint", "true", {
        maxAge: 60 * 60 * 24 * 90,
      }); // 90 days
    } else {
      setBreakPoint(false);
      setCookie("isBreakPoint", "false", {
        maxAge: 60 * 60 * 24 * 90,
      }); // 90 days
    }
  }, [themeColor, collapsed, isBreakPoint, showAdminPanel, status, width]);

  const items = [
    {
      value: "staff",
      label: (
        <Space className="flex justify-between">
          <Typography.Text>Staff</Typography.Text>
          <Button
            icon={<AiOutlineUsergroupAdd />}
            size="small"
            onClick={() => {
              router.push("/staff");
              setCascaderOpen(false);
              setCascaderValue(["staff"]);
            }}
          />
        </Space>
      ),
      children: [
        {
          value: "faculty",
          label: "Faculty",
        },
        {
          value: "technician",
          label: "Technician",
        },
        {
          value: "adminstrator",
          label: "Adminstrator",
        },
      ],
    },
    {
      value: "students",
      label: (
        <Space className="flex justify-between">
          <Typography.Text>Students</Typography.Text>
          <Button
            icon={<AiOutlineUsergroupAdd />}
            size="small"
            onClick={() => {
              router.push("/students");
              setCascaderOpen(false);
              setCascaderValue(["students"]);
            }}
          />
        </Space>
      ),
      children: [
        {
          value: "undergraduate",
          label: "Undergraduate",
        },
        {
          value: "postgraduate",
          label: "Postgraduate",
        },
      ],
    },
    {
      value: "adminstrative",
      label: "Adminstrative",
    },
  ];

  return (
    <LayoutContext.Provider
      value={{
        themeColor,
        handleThemeChange,
      }}
    >
      <ConfigProvider
        theme={
          themeColor === "light"
            ? { algorithm: theme.defaultAlgorithm }
            : { algorithm: theme.darkAlgorithm }
        }
      >
        <Head>
          <title>College of Sciences Portal</title>
          <meta name="description" content="College of Sciences Portal" />
          <link rel="icon" href="/squ.ico" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        <Layout className="min-h-screen">
          <HeaderComponent
            collapsed={collapsed}
            handleBreakPoint={handleBreakPoint}
            isBreakPoint={isBreakPoint}
            handleThemeChange={handleThemeChange}
            handleShowAdminPanel={handleShowAdminPanel}
          />
          <Layout hasSider>
            <SiderComponent
              collapsed={collapsed}
              handleCollapse={handleCollapse}
              themeColor={themeColor}
              isBreakPoint={isBreakPoint}
              setBreakPoint={setBreakPoint}
              showAdminPanel={showAdminPanel}
              handleShowAdminPanel={handleShowAdminPanel}
            />
            <Layout
              className={
                "transition-all px-2 duration-500 flex flex-col " +
                (isBreakPoint ? "ml-0" : collapsed ? "ml-20" : "ml-50")
              }
            >
              <Content className="flex flex-col">
                {width < 576 && (
                  <Cascader
                    showSearch
                    value={cascaderValue}
                    open={cascaderOpen}
                    options={items}
                    expandTrigger="hover"
                    displayRender={(label) => {
                      if (Array.isArray(label)) {
                        const firstVlaue = label[0];
                        const remainingValues = label.slice(1);

                        if (typeof firstVlaue === "object") {
                          if (remainingValues.length === 0) {
                            return firstVlaue.props.children[0].props.children;
                          } else {
                            return (
                              firstVlaue.props.children[0].props.children +
                              " / " +
                              remainingValues.join(" / ")
                            );
                          }
                        }
                      }
                      return label.join(" / ");
                    }}
                    bordered={false}
                    style={{ margin: "16px 0" }}
                    placeholder="Navigation"
                    onClear={() => {
                      setCascaderValue([]);
                      router.push("/");
                    }}
                    onChange={(value) => {
                      setCascaderValue(value);
                      if (value !== undefined) {
                        router.push("/" + value.join("/"));
                      }
                    }}
                    onPopupVisibleChange={(value) => {
                      setCascaderOpen(value);
                    }}
                    size="middle"
                    className="shadow-md rounded-xl w-full"
                  />
                )}
                {children}
                <FloatButton.BackTop
                  style={{
                    bottom: "20px",
                    right: "20px",
                    zIndex: "1000",
                  }}
                />
              </Content>
              <FooterComponent
                isBreakPoint={isBreakPoint}
                collapsed={collapsed}
              />
            </Layout>
          </Layout>
        </Layout>
      </ConfigProvider>
    </LayoutContext.Provider>
  );
}
