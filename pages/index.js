import { Typography } from "antd";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();
  return (
    <div>
      <h1>Home</h1>
      <p>
        <Typography.Text>
          {status === "authenticated" ? (
            <span>
              Welcome, <strong>{session.user.name}</strong>!
            </span>
          ) : (
            <span>
              You are not signed in.{" "}
              <a href="/auth/signin">Click here to sign in.</a>
            </span>
          )}
        </Typography.Text>
      </p>

      {Array(100)
        .fill(0)
        .map((_, i) => (
          <p key={i}>
            <Typography.Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quae.
            </Typography.Text>
          </p>
        ))}
    </div>
  );
}
