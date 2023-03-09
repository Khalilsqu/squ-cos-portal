import { google } from "googleapis";

export default async function fetchNews(req, res) {
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

    if (rows) {
      const data = rows.map((row) => {
        return {
          key: row[0],
          title: row[1],
          description: row[2],
          datePosted: row[3],
          expiryDate: row[4],
        };
      });

      // fetch images from google drive using the key as the file from folder id stored in .env file

      const drive = google.drive({ version: "v3", auth });
      const driveResponse = await drive.files.list({
        q: `'${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents`,
        fields: "files(id, name, mimeType, webContentLink, webViewLink, size)",
      });

      const driveRows = driveResponse.data.files;

      const driveData = driveRows.map((row) => {
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

      const mergedData = data.map((item) => {
        const driveItem = driveData.find(
          (driveItem) => driveItem.key === item.key
        );
        return {
          ...item,
          ...driveItem,
        };
      });

      res.status(200).json(mergedData);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  } finally {
    res.end();
  }
}
