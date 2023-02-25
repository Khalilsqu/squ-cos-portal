import { Player, Controls } from "@lottiefiles/react-lottie-player";
import { Space, Typography } from "antd";

export default function LottiePlayer() {
  return (
    <Space direction="vertical" className="flex gap-2">
      <Player
        autoplay
        loop
        src="/lottie/underConstruction.json"
        style={{ height: "300px", width: "300px" }}
      >
        <Controls
          visible={false}
          buttons={["play", "repeat", "frame", "debug"]}
        />
      </Player>
      <Typography.Title
        className="flex first-letter:uppercase
        text-center align-middle content-center items-center"
      >
        This page is under construction
      </Typography.Title>
    </Space>
  );
}
