import { google } from "googleapis";

export default async function deleteHandler(req, res) {
  if (req.method == "POST") {
    const { key } = req.body;

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
    const keyIndex = rows.findIndex((row) => row[0] == key);
    const keyRow = rows[keyIndex];
    const fileName = keyRow[0];

    // delete row from sheet using batchUpdate
    const request = {
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0,
                dimension: "ROWS",
                startIndex: keyIndex,
                endIndex: keyIndex + 1,
              },
            },
          },
        ],
      },
    };
    const sheetResponse = await sheet.spreadsheets.batchUpdate(request);

    // delete file from google drive having file name as fileName

    const drive = google.drive({ version: "v3", auth });

    const queryFileDeleteId = await drive.files.list({
      q: `name='${fileName}'`,
      fields: "files(id, name)",
    });

    const fileId = queryFileDeleteId.data.files[0].id;

    const fileResponse = await drive.files.delete({
      fileId: fileId,
    });

    if (sheetResponse.status === 200 && fileResponse.status === 204) {
      res.status(200).json({ message: "Success" });
    }
  } else {
    res.status(400).json({ message: "Invalid request" });
  }
}
