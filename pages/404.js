import { Typography } from "antd";
import { Player, Controls } from "@lottiefiles/react-lottie-player";

export default function Custom404() {
  return (
    <div className="flex flex-col w-full justify-center items-center">
      <Typography.Title level={3} className="text-center">
        This page could not exist
      </Typography.Title>
      <Player
        autoplay
        loop
        src="/lottie/error-404.json"
        className="flex justify-center items-center"
      >
        <Controls
          visible={false}
          buttons={["play", "repeat", "frame", "debug"]}
        />
      </Player>
    </div>
  );
}
