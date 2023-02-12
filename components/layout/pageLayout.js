import { Layout, theme, ConfigProvider } from "antd";
import { useState, createContext } from "react";

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
                // className="flex flex-col justify-center items-center"
                style={{
                  // marginTop: "64px",
                  height: "100vh",
                  // marginLeft: isBreakPoint
                  //   ? "0px"
                  //   : collapsed
                  //   ? "80px"
                  //   : "200px",
                  transition: "all 0.5s",
                  // paddingLeft: "24px",
                  // paddingRight: "24px",
                }}
              >
                {children}
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
