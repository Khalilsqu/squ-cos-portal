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
      // className={
      //   "transition-all duration-500 px-6 flex flex-col " +
      //   (isBreakPoint ? "ml-0" : collapsed ? "ml-20" : "ml-50")
      // }
    >
      <Divider />
      <Footer className="w-full flex flex-row justify-center items-center md:justify-between">
        <Typography.Text className="hidden md:flex w-1/6 text-start">
          © {year} College of Sciences, Sultan Qaboos University | All Rights
        </Typography.Text>

        <Typography.Link
          className="text-center"
          href="https://www.squ.edu.om/science/"
          target={"_blank"}
        >
          SQU College of Science
        </Typography.Link>
        <Typography.Text className="hidden md:flex w-1/6 text-end">
          This site is not affiliated with Sultan Qaboos University, but
          Developed by DataBase Team in College of Sciences
        </Typography.Text>
      </Footer>
    </div>
  );
}
