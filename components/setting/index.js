import { SettingOutlined } from "@ant-design/icons";

const Setting = (props) => {
  const { themeColor } = props;
  return (
    <SettingOutlined
      style={{
        fontSize: "28px",
        cursor: "pointer",
        color: themeColor === "light" ? "#001529" : "#fff",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );
};

export default Setting;
