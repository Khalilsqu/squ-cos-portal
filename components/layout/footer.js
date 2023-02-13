import { Layout, Divider, Typography } from "antd";
import { useState, useEffect } from "react";

const { Footer } = Layout;

export default function FooterComponent(props) {
  const { collapsed, isBreakPoint } = props;
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setInterval(() => {
      setYear(new Date().getFullYear());
    }, 24 * 60 * 60 * 1000);
  }, []);

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
      <Footer style={{ textAlign: "center", opacity: 0.5 }}>
        <Typography.Text>
          © {year} College of Sciences, Sultan Qaboos University | All Rights
        </Typography.Text>
      </Footer>
      {/* add visitor counter */}
    </div>
  );
}
