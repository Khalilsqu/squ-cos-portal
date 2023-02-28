import { signIn, getProviders } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Button, Typography, Space } from "antd";
import Head from "next/head";
import { Player, Controls } from "@lottiefiles/react-lottie-player";

import { FcGoogle } from "react-icons/fc";
import { colorThemeState } from "@/components/layout/pageLayout";
import { useEffect } from "react";
import { getCookie } from "cookies-next";

export default function Signin({ providers }) {
  const [themeColor, setThemeColor] = colorThemeState((state) => [
    state.themeColor,
    state.setThemeColorChange,
  ]);

  useEffect(() => {
    setThemeColor(getCookie("themeColor"));
  }, [themeColor]);

  return (
    <Space
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor:
          themeColor === "light" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)",
        columnGap: "20px",
        padding: "10px",
      }}
    >
      <Head>
        <title>Sign in to CoS Portal </title>
        <meta name="description" content="Sign in to CoS Portal" />
        <link rel="icon" href="/squ.ico" />
      </Head>
      <Typography.Title
        style={{
          color: themeColor === "light" ? "black" : "white",
          fontSize: "30px",
          textAlign: "center",
        }}
      >
        Sign in to College of Science Portal
      </Typography.Title>
      <Player
        autoplay
        loop
        src="/lottie/google_signin.json"
        style={{ height: "300px", width: "300px" }}
      >
        <Controls
          visible={false}
          buttons={["play", "repeat", "frame", "debug"]}
        />
      </Player>
      <Typography.Text
        className={
          (themeColor === "light" ? "text-black" : "text-white") +
          " flex first-letter:uppercase text-center align-middle content-center items-center"
        }
      >
        You will be redirected to Google Account to sign in. Acess is resitrcted
        to SQU accounts.
      </Typography.Text>
      <Button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="flex text-center align-middle content-center items-center rounded-md"
        size="large"
        icon={<FcGoogle className="text-xl" />}
      >
        Click to sign in with Google
      </Button>
    </Space>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }

  const providers = await getProviders(context);

  return {
    props: { providers: providers ?? [] },
  };
}
