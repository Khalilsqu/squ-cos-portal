import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  return (
    <div>
      {!session && (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
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
    </div>
  );
}
