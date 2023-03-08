import { google } from "googleapis";

import { Readable } from "stream";

const convertImageStream = (image) => {
  const readableImageStream = new Readable();
  readableImageStream.push(image);
  readableImageStream.push(null);

  return readableImageStream;
};

export default async function updateHandler(req, res) {
  if (req.method == "POST") {
    const { dataEditted, image } = req.body;

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

    const keyIndex = rows.findIndex((row) => row[0] === dataEditted.key);
    const keyRow = rows[keyIndex];
    const fileName = keyRow[0];

    // update row from sheet using batchUpdate

    const request = {
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      resource: {
        requests: [
          {
            updateCells: {
              start: {
                sheetId: 0,
                rowIndex: keyIndex,
                columnIndex: 0,
              },
              rows: [
                {
                  values: [
                    {
                      userEnteredValue: {
                        stringValue: dataEditted.key,
                      },
                    },
                    {
                      userEnteredValue: {
                        stringValue: dataEditted.title,
                      },
                    },
                    {
                      userEnteredValue: {
                        stringValue: dataEditted.description,
                      },
                    },
                    {
                      userEnteredValue: {
                        stringValue: dataEditted.datePosted,
                      },
                    },
                    {
                      userEnteredValue: {
                        stringValue: dataEditted.expiryDate,
                      },
                    },
                  ],
                },
              ],
              fields: "*",
            },
          },
        ],
      },
    };

    const response2 = await sheet.spreadsheets.batchUpdate(request);

    // image is not null then delete old image and upload new image to drive using file name as key
    if (image != null) {
      const drive = google.drive({ version: "v3", auth });
      const response3 = await drive.files.list({
        q: `name = '${fileName}'`,
        fields: "files(id)",
      });

      const fileId = response3.data.files[0].id;

      const response4 = await drive.files.delete({
        fileId: fileId,
      });

      const fileMetadata = {
        name: fileName,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
      };

      const media = {
        mimeType: "image/jpeg",
        body: convertImageStream(Buffer.from(image.split(",")[1], "base64")),
      };

      const response5 = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: "id",
      });
    }

    res.status(200).json({ message: "Success" });
  } else {
    res.status(400).json({ message: "Error" });
  }

  res.end();
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};
