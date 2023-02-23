import ExcelUpload from "@/components/excelUpload";

import { Space } from "antd";

function Home(props) {
  return (
    <Space
      direction="vertical"
      style={{
        padding: "20px",
      }}
    >
      <ExcelUpload />
    </Space>
  );
}

export default Home;
