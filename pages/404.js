import { Typography } from "antd";
import Lottie from "lottie-react";
import animationData from "@/public/lottie/error-404.json";
export default function Custom404() {
  return (
    <div className="flex flex-col w-full justify-center items-center">
      <Typography.Title level={3} className="text-center">
        This page could not exist
      </Typography.Title>
      <Lottie
        animationData={animationData}
        className="flex justify-center items-center"
        loop={true}
      />
    </div>
  );
}
