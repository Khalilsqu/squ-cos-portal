import {
  getProviders,
  signIn,
  getSession,
  getCsrfToken,
} from "next-auth/react";
import { Button, Typography } from "antd";
import Head from "next/head";

export default function Signin({ providers }) {
  return (
    <div>
      <Head>
        <title>Sign in to CoS Portal</title>
      </Head>
      <Typography.Title>Sign in to College of Science Portal</Typography.Title>
      {Array(100)
        .fill(0)
        .map((_, i) => (
          <p key={i}>
            <Typography.Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quae Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Quisquam.
            </Typography.Text>
          </p>
        ))}
      {Object.values(providers).map((provider) => {
        return (
          <div key={provider.name}>
            <Button
              onClick={() => signIn(provider.id)}
              style={{ zIndex: 5000000, marginBottom: 10 }}
            >
              Sign in with {provider.name}
            </Button>
          </div>
        );
      })}
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
      csrfToken: await getCsrfToken(context),
    },
  };
}
