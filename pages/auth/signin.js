import { getProviders, signIn, getSession } from "next-auth/react";
import { Button, Space, Typography } from "antd";
import Head from "next/head";
import { Player, Controls } from "@lottiefiles/react-lottie-player";

import { FcGoogle } from "react-icons/fc";

export default function Signin({ providers }) {
  return (
    <div
      style={{
        marginTop: "64px",
      }}
    >
      <Head>
        <title>Sign in to CoS Portal </title>
      </Head>
      <Typography.Title>Sign in to College of Science Portal</Typography.Title>
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
      {providers &&
        Object.values(providers).map((provider) => (
          <div key={provider.name} style={{ marginBottom: 0 }}>
            <Button
              onClick={() => signIn(provider.id)}
              style={{ width: "100%", marginBottom: 0 }}
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
