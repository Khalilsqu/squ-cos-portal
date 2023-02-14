import {
  getProviders,
  signIn,
  getSession,
  getCsrfToken,
} from "next-auth/react";
import { Button, Space, Typography } from "antd";
import Head from "next/head";
import { Player, Controls } from "@lottiefiles/react-lottie-player";

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
      {/* <Typography.Title>Sign in to College of Science Portal</Typography.Title>
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
      <Space
        direction="vertical"
        size="large"
        style={{ width: "100%", marginTop: "1rem" }}
      >
        {Object.values(providers).map((provider) => {
          return (
            <div key={provider.name}>
              <Button onClick={() => signIn(provider.id)}>
                Sign in with your SQU {provider.name} account
              </Button>
            </div>
          );
        })}
        {Array.isArray(providers) && providers.length === 0 && (
          <Typography.Text>
            No authentication providers are configured.{" "}
            <a href="https://next-auth.js.org/configuration/providers">
              Learn more
            </a>
          </Typography.Text>
        )}
        {Array.isArray(providers) && providers.length > 0 && (
          <Typography.Text>
            No authentication providers are configured.{" "}
            <a href="https://next-auth.js.org/configuration/providers">
              Learn more
            </a>
          </Typography.Text>
        )} */}

      {providers &&
        Object.values(providers).map((provider) => (
          <div key={provider.name} style={{ marginBottom: 0 }}>
            <Button
              onClick={() => signIn(provider.id)}
              style={{ width: "100%", marginBottom: 0 }}
              size="large"
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
