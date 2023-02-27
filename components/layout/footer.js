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
      <Footer className="flex flex-col">
        <div className="flex flex-col border-solid border border-blue-200 p-4 gap-4 md:flex-row md:items-center">
          <Typography.Text className="flex text-start md:w-1/5">
            © {year} College of Sciences, Sultan Qaboos University | All Rights
          </Typography.Text>

          <Typography.Link
            className="text-start md:text-center md:w-3/5"
            href="https://www.squ.edu.om/science/"
            target={"_blank"}
          >
            SQU College of Science
          </Typography.Link>
          <Typography.Text className="flex text-start md:w-1/5 md:text-end">
            This site is not affiliated with Sultan Qaboos University, but
            Developed by DataBase Team in College of Sciences
          </Typography.Text>
        </div>
      </Footer>
    </div>
  );
}
