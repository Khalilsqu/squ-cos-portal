import { getProviders, signIn, getSession, useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Button, Typography, Space } from "antd";
import Head from "next/head";
import { Player, Controls } from "@lottiefiles/react-lottie-player";

import { FcGoogle } from "react-icons/fc";
import { useContext } from "react";
import { LayoutContext } from "@/components/layout/pageLayout";

export default function Signin(props) {
  const themeColor = useContext(LayoutContext);
  const { data: session, status } = useSession();

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
        gap: "20px",
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
        className="flex first-letter:uppercase
      text-center align-middle content-center items-center
      dark:text-white
      "
      >
        You will be redirected to Google Account to sign in. Acess is resitrcted
        to SQU accounts.
      </Typography.Text>
      <Button
        onClick={() => signIn("google", { prompt: "select_account" })}
        className="flex text-center align-middle content-center items-center rounded-md"
        size="large"
        icon={<FcGoogle className="text-xl" />}
      >
        Click to sign in with Google
      </Button>
      {/* {providers &&
        Object.values(providers).map((provider) => (
          <div key={provider.name} style={{ marginBottom: 0 }}>
            <Button
              onClick={() => signIn(provider.id, { prompt: "select_account" })}
              className="flex text-center align-middle content-center items-center rounded-md"
              size="large"
              icon={<FcGoogle className="text-xl" />}
            >
              Click to sign-in with {provider.name}
            </Button>
          </div>
        ))} */}
    </Space>
  );
}

// export async function getServerSideProps(context) {
//   const { req } = context;
//   const session = await getSession({ req });

//   if (session) {
//     return {
//       redirect: { destination: "/" },
//     };
//   }

//   return {
//     props: {
//       providers: await getProviders(context),
//       // csrfToken: await getCsrfToken(context),
//     },
//   };
// }

export async function getServerSideProps(context) {
  const { res } = context;

  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");

  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }

  return {
    props: {
      session,
    },
  };
}
