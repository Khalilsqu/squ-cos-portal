import { Carousel, Space, Typography, Card, Image } from "antd";
import moment from "moment/moment";
import Link from "next/link";
import useSWR from "swr";
import { useRouter } from "next/router";

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
  const router = useRouter();
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

  const goToNewsDetail = (item) => {
    router.push(
      {
        pathname: "/[newsKey]",
        query: { newsKey: item.key },
      },

      "/" + // news title without special characters and spaces
        item.title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s/g, "-") +
        "/" +
        item.datePosted
          .replace(/\s/g, "-") // replace / with - to prevent error
          .replace(/\//g, "-") // replace , with nothing to prevent error
          .replace(/,/g, ""),
      { shallow: true }
    );
  };

  const carsouel = data?.map((item) => {
    if (
      moment(item.expiryDate, "ddd, MMM Do YYYY").diff(new moment(), "days") +
        1 >
      0
    ) {
      return (
        <div key={item.key}>
          <Card
            loading={isLoading}
            hoverable
            style={{
              width: "100%",
              height: "300px",
              borderRadius: "12px",
            }}
            cover={
              <Image
                alt={item.title}
                src={item.image.url}
                preview={false}
                style={{
                  height: "300px",
                  borderRadius: "12px",
                }}
              />
            }
            onClick={() => {
              goToNewsDetail(item);
            }}
          />
        </div>
      );
    }
  });

  return (
    <div className="block w-full pt-2 rounded-xl">
      {!error && (
        <Carousel autoplay autoplaySpeed={4000}>
          {carsouel}
        </Carousel>
      )}
    </div>
  );
}
