import { Typography } from "antd";

export default function Testing(props) {
  return <Typography.Text strong>{props.name}</Typography.Text>;
}

export async function getServerSideProps(context) {
  return {
    props: {
      name: "test",
    },
  };
}
