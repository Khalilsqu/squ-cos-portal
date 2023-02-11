import { Layout } from "antd";
import Image from "next/image";
import Link from "next/link";

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
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        marginTop: "64px",
      }}
    >
      <Link
        href="https://www.squ.edu.om/"
        rel="noopener noreferrer"
        target="_blank"
      >
        <Image src="/squ.png" alt="Logo" width={50} height={100} />
      </Link>
    </Sider>
  );
}
