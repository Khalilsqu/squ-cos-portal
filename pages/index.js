import { Carousel, Space, Typography } from "antd";
import moment from "moment/moment";
import Link from "next/link";
import useSWR from "swr";

const fetcher = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export default function IndexPage() {
  const { data, error, isLoading } = useSWR(
    "/api/dashboard/news/fetchNews",
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
      revalidateOnMount: true,
      refreshInterval: 0,
    }
  );

  if (!data) {
    return;
  }

  const carsouel = data.map((item) => {
    if (
      moment(item.expiryDate, "ddd, MMM Do YYYY").diff(new moment(), "days") +
        1 >
      0
    ) {
      return (
        <div key={item.key}>
          <section
            style={{
              color: "white",
              textShadow: "2px 2px 4px #000000",
              backgroundImage: `url(${item.image.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "300px",
              textAlign: "center",
              backgroundRepeat: "no-repeat",
              borderRadius: "12px",
              fontSize: "2rem",
            }}
          >
            <Space direction="vertical" className="justify-between">
              <Typography.Title level={2}>
                <Link
                  href={{
                    pathname: "/[newsKey]",
                    query: { newsKey: item.key },
                  }}
                  as={
                    "/" + // news title without special characters and spaces
                    item.title
                      .replace(/[^a-zA-Z0-9 ]/g, "")
                      .replace(/\s/g, "-") +
                    "/" +
                    item.datePosted
                      .replace(/\s/g, "-") // replace / with - to prevent error
                      .replace(/\//g, "-") // replace , with nothing to prevent error
                      .replace(/,/g, "")
                  }
                >
                  {item.title}
                </Link>
              </Typography.Title>
            </Space>
          </section>
        </div>
      );
    }
  });

  return (
    <div className="block w-full pt-2 rounded-xl">
      <Carousel autoplay autoplaySpeed={5000}>
        {carsouel}
      </Carousel>
    </div>
  );
}
