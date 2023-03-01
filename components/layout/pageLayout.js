import { Layout, theme, ConfigProvider, FloatButton } from "antd";
import { useState, createContext, useEffect } from "react";
import Head from "next/head";
import { setCookie, getCookie } from "cookies-next";
import { create } from "zustand";
import HeaderComponent from "./header";
import FooterComponent from "./footer";
import SiderComponent from "./siderbar";
const { Content } = Layout;
export const LayoutContext = createContext();

export const colorThemeState = create((set) => ({
  themeColor: "light",
  setThemeColorChange: (themeColor) =>
    set((state) => ({
      themeColor: themeColor,
    })),
}));

export default function PageLayout({ children }) {
  let collapsedValue = false;
  let isBreakPointValue = false;
  let showAdminPanelValue = false;

  const [showAdminPanel, setShowAdminPanel] = useState(showAdminPanelValue);
  const [collapsed, setCollapsed] = useState(collapsedValue);
  const [themeColor, setThemeColor] = colorThemeState((state) => [
    state.themeColor,
    state.setThemeColorChange,
  ]);
  const [isBreakPoint, setBreakPoint] = useState(isBreakPointValue);

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

  useEffect(() => {
    setThemeColor(getCookie("themeColor"));
    setCollapsed(getCookie("collapsed"));
    setBreakPoint(getCookie("isBreakPoint"));
    setShowAdminPanel(getCookie("showAdminPanel"));
  }, [themeColor, collapsed, isBreakPoint]);

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
              <Content className="flex justify-center">
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
