import { Button, Upload, Space, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";

const ExcelUpload = (props) => {
  const [file, setFile] = useState(null);

  return (
    <Space direction="vertical">
      <Upload.Dragger
        action={"http://localhost:3000/"}
        multiple={false}
        listType="picture"
        accept=".xlsx, .xls, .csv"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingInline: "20px",
          gap: "20px",
        }}
      >
        <Typography.Title level={4}>Upload an Excel File</Typography.Title>
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload.Dragger>
    </Space>
  );
};

export default ExcelUpload;
