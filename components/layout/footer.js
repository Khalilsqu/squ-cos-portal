import { Layout, Divider } from "antd";

const { Footer } = Layout;

export default function FooterComponent(props) {
  const { collapsed, isBreakPoint } = props;

  return (
    <div
      style={{
        marginLeft: isBreakPoint ? "0px" : collapsed ? "80px" : "200px",
        transition: "all 0.5s",
        paddingLeft: "24px",
        paddingRight: "24px",
      }}
    >
      <Divider />
      <Footer className="text-center">
        Ant Design ©2018 Created by Ant UED
      </Footer>
      {/* add visitor counter */}
    </div>
  );
}
