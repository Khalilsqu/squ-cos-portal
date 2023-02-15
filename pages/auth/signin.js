import { getProviders, signIn, getSession } from "next-auth/react";
import { Button, Typography } from "antd";
import Head from "next/head";
import { Player, Controls } from "@lottiefiles/react-lottie-player";

import { FcGoogle } from "react-icons/fc";
import { useContext } from "react";
import { LayoutContext } from "@/components/layout/pageLayout";

export default function Signin({ providers }) {
  const themeColor = useContext(LayoutContext);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor:
          themeColor === "light" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)",
        gap: "20px",
      }}
    >
      <Head>
        <title>Sign in to CoS Portal </title>
      </Head>
      <Typography.Title
        style={{
          color: themeColor === "light" ? "black" : "white",
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
        style={{ color: themeColor === "light" ? "black" : "white" }}
      >
        You will be redirected to Google Account to sign in
      </Typography.Text>
      {providers &&
        Object.values(providers).map((provider) => (
          <div key={provider.name} style={{ marginBottom: 0 }}>
            <Button
              onClick={() => signIn(provider.id)}
              style={{
                width: "100%",
                marginBottom: 0,
                backgroundColor: themeColor === "light" ? "#4285f4" : "#1a73e8",
                color: themeColor === "light" ? "white" : "black",
              }}
              size="large"
              icon={<FcGoogle />}
            >
              Sign in with {provider.name}
            </Button>
          </div>
        ))}

      {/* </Space> */}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }

  return {
    props: {
      providers: await getProviders(context),
      // csrfToken: await getCsrfToken(context),
    },
  };
}