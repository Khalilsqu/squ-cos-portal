import { Typography } from "antd";

export default function Home() {
  return (
    <div>
      {Array(100)
        .fill(0)
        .map((_, i) => (
          <p key={i}>
            <Typography.Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quae.
            </Typography.Text>
          </p>
        ))}
    </div>
  );
}
