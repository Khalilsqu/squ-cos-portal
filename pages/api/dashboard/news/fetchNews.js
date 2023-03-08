export default async function fetchNews(req, res) {
  if (req.method == "GET") {
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
      fields: "files(id, name, mimeType, webViewLink, webContentLink)",
    });

    const driveRows = driveResponse.data.files;

    const driveData = driveRows.map((row) => {
      return {
        key: row.name,
        mimeType: row.mimeType,
        webViewLink: row.webViewLink,
        webContentLink: row.webContentLink,
      };
    });

    // merge the data from google sheets and google drive

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
  }
}
