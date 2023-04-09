import { Layout, Divider } from "antd";
import { useState, useEffect } from "react";
import CopyRight from "../footerContents/copyRight";
import { useWindowSize } from "../utils/windowSize";

const { Footer } = Layout;

export default function FooterComponent(props) {
  const [year, setYear] = useState(new Date().getFullYear());
  const { width } = useWindowSize();

  useEffect(() => {
    setInterval(() => {
      setYear(new Date().getFullYear());
    }, 24 * 60 * 60 * 1000);
  }, []);

  return (
    <div>
      <Divider />
      <Footer className="flex flex-col">
        <CopyRight year={year} />
      </Footer>
    </div>
  );
}
