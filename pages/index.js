import { Space, Typography, Carousel, Image } from "antd";
import { google } from "googleapis";

const contentStyle = {
  margin: 0,
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

export default function IndexPage(props) {
  const { data } = props;

  return (
    <div className="block w-full">
      <Carousel autoplay>
        {data.map((item) => (
          <div key={item.key}>
            <h1
              style={{
                color: "white",
                textShadow: "2px 2px 4px #000000",
                backgroundImage: `url(${item.image.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "200px",
                textAlign: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {item.title}
            </h1>
          </div>
        ))}
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
          // "Access-Control-Allow-Origin": "*",
          // "Access-Control-Allow-Methods": "GET",
          // "Access-Control-Allow-Headers": "Content-Type",
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
