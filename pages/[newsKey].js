import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcher } from "@/components/utils/useSwrFetcher";
import { Typography, Spin } from "antd";

import dynamic from "next/dynamic";

const ReactQuill = dynamic(import("react-quill"), { ssr: false });
import "react-quill/dist/quill.bubble.css";

export default function NewsDetails() {
  const router = useRouter();
  const { newsKey } = router.query;

  const { data, error, isLoading } = useSWR(
    "/api/dashboard/news/fetchNews",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnMount: true,
      refreshInterval: 0,
    }
  );

  if (error)
    return (
      <div>
        <Typography.Title level={1} className="text-6xl font-bold">
          Error loading news from the database. Please try to re-visit the page
          again.
        </Typography.Title>
      </div>
    );
  if (isLoading)
    return (
      <div
        className="
        flex flex-col. w-full justify-center items-center
      "
      >
        <Spin size="large" tip="Loading" />
      </div>
    );

  if (data) {
    const newsData = data.find((item) => item.key === newsKey);
    return (
      <div>
        <Head>
          <title>{newsData?.title}</title>
          <meta name="description" content={newsData?.description} />
          <link rel="icon" href="/squ.ico" />
        </Head>

        <main>
          <div className="flex flex-col justify-start">
            <Typography.Title level={1} className="text-6xl font-bold">
              {newsData?.title}
            </Typography.Title>
            <ReactQuill value={newsData?.description} readOnly theme="bubble" />
          </div>
        </main>
      </div>
    );
  }
}
