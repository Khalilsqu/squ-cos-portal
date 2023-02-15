import "@/styles/globals.css";
import PageLayout from "@/components/layout/pageLayout";
import { SessionProvider } from "next-auth/react";



export default function App({
  Component,
  pageProps: { session, ...pageProps },
  ...appProps
}) {
  if ([...appProps.router.asPath.split("/")].includes("auth"))
    return <Component {...pageProps} />;
  return (
    <SessionProvider session={session}>
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
    </SessionProvider>
  );
}
