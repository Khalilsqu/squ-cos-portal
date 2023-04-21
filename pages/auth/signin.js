import { signIn, getProviders } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Button, Typography, Space } from "antd";
import Head from "next/head";
// import { Player, Controls } from "@lottiefiles/react-lottie-player";
import Lottie from "lottie-react";
import animationData from "@/public/lottie/google_signin.json";

import { FcGoogle } from "react-icons/fc";
import { FcHome } from "react-icons/fc";
import { useRouter } from "next/router";

import { getCookie, hasCookie } from "cookies-next";

export default function Signin({ providers }) {
  if (hasCookie("themeColor")) {
    var themeColor = getCookie("themeColor");
  } else {
    var themeColor = "light";
  }

  const router = useRouter();

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
      <Lottie
        animationData={animationData}
        style={{ height: "300px", width: "300px" }}
        loop={true}
      />
      <Typography.Text
        className={
          (themeColor === "light" ? "text-black" : "text-white") +
          " flex first-letter:uppercase text-center align-middle content-center items-center"
        }
      >
        You will be redirected to Google Account to sign in. Acess is restricted
        to SQU accounts.
      </Typography.Text>
      <Button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="flex text-center align-middle content-center items-center rounded-md gap-3"
        size="large"
        icon={<FcGoogle className="text-xl" />}
      >
        Click to sign in with Google
      </Button>
      <Typography.Text
        className={
          (themeColor === "light" ? "text-black" : "text-white") +
          " flex first-letter:uppercase text-center align-middle content-center items-center mt-6"
        }
      >
        If you are not a SQU student or staff, explore the portal as a guest.
      </Typography.Text>
      <Button
        onClick={() => router.push("/")}
        className="flex text-center align-middle content-center items-center rounded-md gap-3"
        size="large"
        icon={<FcHome className="text-xl" />}
      >
        Go to Home Page
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
