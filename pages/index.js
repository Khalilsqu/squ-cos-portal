import { Carousel, Space, Typography } from "antd";
import { google } from "googleapis";
import moment from "moment/moment";
import Link from "next/link";

export default function IndexPage(props) {
  const { data } = props;

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
                <Link href="/newsKey" as={`/${item.key}`}>
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

export async function getServerSideProps(context) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACOUNT_EMAIL,
        client_id: process.env.GOOGLE_SERVICE_CLIENT_ID,
        private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY,
      },
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
      ],
    });

    const sheet = google.sheets({ version: "v4", auth });

    const response = await sheet.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:E",
    });

    const rows = response.data.values;

    //get image url from google drive from folder id

    const drive = google.drive({ version: "v3", auth });

    const imageResponse = await drive.files.list({
      q: `'${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents`,
      fields: "files(id, name, mimeType, webContentLink, webViewLink, size)",
    });

    const imageRows = imageResponse.data.files;

    // map image url to rows

    const imageMap = imageRows.map((row) => {
      return {
        key: row.name,
        image: {
          url: row.webContentLink,
          type: row.mimeType,
          linkView: row.webViewLink,
          size: row.size,
        },

        Headers: {
          "Content-Type": row.mimeType,
        },
      };
    });

    // map image url to rows

    const rowsWithImage = rows.map((row) => {
      const image = imageMap.find((image) => image.key === row[0]);
      return {
        key: row[0],
        title: row[1],
        description: row[2],
        image: image.image,
        expiryDate: row[4],
      };
    });

    return {
      props: {
        data: rowsWithImage,
      },
    };
  } catch (error) {
    return {
      props: {
        data: [],
      },
    };
  }
}
