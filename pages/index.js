import { Player, Controls } from "@lottiefiles/react-lottie-player";
import { Space, Typography } from "antd";
import Link from "next/link";

export default function LottiePlayer() {
  return (
    <Space direction="vertical" className="flex gap-2">
      <Player
        autoplay
        loop
        src="/lottie/underConstruction.json"
        className="flex justify-center items-center max-w-2xl"
      >
        <Controls
          visible={false}
          buttons={["play", "repeat", "frame", "debug"]}
        />
      </Player>
      <Typography.Title className="flex justify-center items-center">
        Under Construction
      </Typography.Title>
    </Space>
  );
}
