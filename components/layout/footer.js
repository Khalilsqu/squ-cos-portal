import { Layout, Divider, Typography, Space } from "antd";
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
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Divider />
      <Footer
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography.Text className="invisible md:visible w-1/6 text-start">
          © {year} College of Sciences, Sultan Qaboos University | All Rights
        </Typography.Text>

        <Typography.Link
          href="https://www.squ.edu.om/science/"
          target={"_blank"}
        >
          SQU College of Sciences
        </Typography.Link>
        <Typography.Text className="invisible md:visible w-1/6 text-end">
          This site is not affiliated with Sultan Qaboos University, but
          Developed by DataBase Team in College of Sciences
        </Typography.Text>
      </Footer>
    </div>
  );
}
