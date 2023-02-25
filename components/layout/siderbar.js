import { Layout } from "antd";
import SideBarContents from "../sideBarContents";

const { Sider } = Layout;

export default function SiderComponent(props) {
  const { collapsed, handleCollapse, themeColor, isBreakPoint, setBreakPoint } =
    props;

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={handleCollapse}
      theme={themeColor}
      breakpoint="lg"
      onBreakpoint={(broken) => {
        setBreakPoint(broken);
      }}
      hidden={isBreakPoint ? true : false}
      style={{
        position: "fixed",
        overflow: "auto",
        height: "100vh",
        top: "64px",
      }}
    >
      <SideBarContents
        themeColor={themeColor}
        collapsed={collapsed}
        isBreakPoint={isBreakPoint}
      />
    </Sider>
  );
}
