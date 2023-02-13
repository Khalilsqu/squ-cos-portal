import { signIn, signOut, useSession } from "next-auth/react";
import { Typography } from "antd";
import { useRouter } from "next/router";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/auth/signin");
  };

  return (
    <div>
      {!session && (
        <>
          Not signed in <br />
          <button onClick={handleSignIn}>Sign in</button>
        </>
      )}
      {session && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          Signed in as {session.user.name}
          <br />
          with email {session.user.email}
          <img src={session.user.image} alt={session.user.name} />
          <button
            onClick={() => signOut()}
            style={{
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "0.5rem",
              backgroundColor: "red",
              color: "white",
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </div>
      )}
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
