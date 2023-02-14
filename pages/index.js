import { Typography } from "antd";

export default function Home() {
  return (
    <div>
      <Typography.Title>Home</Typography.Title>
      {Array(2)
        .fill(0)
        .map((_, i) => (
          <p key={i}>
            <Typography.Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quae Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Quisquam.
            </Typography.Text>
          </p>
        ))}
    </div>
  );
}
