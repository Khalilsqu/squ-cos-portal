// import { useRef } from "react";
// import HotTable from "@/components/hotTable";
import ExcelUpload from "@/components/excelUpload";

import { Space } from "antd";

function Home(props) {
  // const hotRef = useRef(null);

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
