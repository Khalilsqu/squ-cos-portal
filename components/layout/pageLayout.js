import { Layout, theme, ConfigProvider, FloatButton } from "antd";
import { useState, createContext } from "react";
import Head from "next/head";

import HeaderComponent from "./header";
import FooterComponent from "./footer";
import SiderComponent from "./siderbar";

const { Content } = Layout;

export const LayoutContext = createContext();

export default function PageLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [themeColor, setThemeColor] = useState("dark");
  const [isBreakPoint, setBreakPoint] = useState(false);

  const handleThemeChange = () => {
    setThemeColor((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  const handleBreakPoint = () => {
    setBreakPoint((prev) => !prev);
  };

  return (
    <LayoutContext.Provider
      value={{
        themeColor,
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
          />
          <Layout hasSider>
            <SiderComponent
              collapsed={collapsed}
              handleCollapse={handleCollapse}
              themeColor={themeColor}
              isBreakPoint={isBreakPoint}
              setBreakPoint={setBreakPoint}
            />
            <Layout>
              <Content
                style={{
                  display: "flex",
                  marginLeft: isBreakPoint
                    ? "0px"
                    : collapsed
                    ? "80px"
                    : "200px",
                  transition: "all 0.5s",
                  paddingLeft: "24px",
                  paddingRight: "24px",
                  alignContent: "center",
                  justifyContent: "center",
                  minHeight: "100vh",
                }}
              >
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
