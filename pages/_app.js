import "@/styles/globals.css";
import PageLayout from "@/components/layout/pageLayout";
import { SessionProvider } from "next-auth/react";

import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useEffect } from "react";
import Router from "next/router";
import { Analytics } from "@vercel/analytics/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
  ...appProps
}) {
  useEffect(() => {
    Router.events.on("routeChangeStart", NProgress.start);
    Router.events.on("routeChangeComplete", NProgress.done);
    Router.events.on("routeChangeError", NProgress.done);
    return () => {
      Router.events.off("routeChangeStart", NProgress.start);
      Router.events.off("routeChangeComplete", NProgress.done);
      Router.events.off("routeChangeError", NProgress.done);
    };
  }, []);
  if ([...appProps.router.asPath.split("/")].includes("auth"))
    return (
      <>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
        <Analytics />
      </>
    );
  return (
    <>
      <SessionProvider session={session}>
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </SessionProvider>
      <Analytics />
    </>
  );
}
