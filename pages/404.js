import { Typography } from "antd";
import { Player, Controls } from "@lottiefiles/react-lottie-player";

export default function Custom404() {
  return (
    <div className="flex flex-col justify-center items-center">
      <Typography.Title level={3} className="text-center">
        This page could not be found
      </Typography.Title>
      <Player
        autoplay
        loop
        src="/lottie/error-404.json"
        style={{ height: "300px", width: "300px" }}
      >
        <Controls
          visible={false}
          buttons={["play", "repeat", "frame", "debug"]}
        />
      </Player>
    </div>
  );
}
