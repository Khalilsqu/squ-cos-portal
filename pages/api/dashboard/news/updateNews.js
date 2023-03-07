import { google } from "googleapis";

export default async function updateHandler(req, res) {
  if (req.method == "POST") {
    const { dataEditted, image } = req.body;

    // console.log(image);
    res.json({ message: "Success" });

    //   const auth = new google.auth.GoogleAuth({
    //     credentials: {
    //       client_email: process.env.GOOGLE_SERVICE_ACOUNT_EMAIL,
    //       client_id: process.env.GOOGLE_SERVICE_CLIENT_ID,
    //       private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY,
    //     },
    //     scopes: [
    //       "https://www.googleapis.com/auth/spreadsheets",
    //       "https://www.googleapis.com/auth/drive",
    //     ],
    //   });
    //   const sheet = google.sheets({ version: "v4", auth });
    //   const response = await sheet.spreadsheets.values.get({
    //     spreadsheetId: process.env.GOOGLE_SHEET_ID,
    //     range: "Sheet1!A:E",
    //   });

    //   const rows = response.data.values;
    //   const keyIndex = rows.findIndex((row) => row[0] == values[0]);
    //   const keyRow = rows[keyIndex];
    //   const fileName = keyRow[0];

    //   // update row from sheet using batchUpdate

    //   const request = {
    //     spreadsheetId: process.env.GOOGLE_SHEET_ID,
    //     resource: {
    //       requests: [
    //         {
    //           updateCells: {
    //             start: {
    //               sheetId: 0,
    //               rowIndex: keyIndex,
    //               columnIndex: 0,
    //             },
    //             rows: [
    //               {
    //                 values: [
    //                   {
    //                     userEnteredValue: {
    //                       stringValue: values[0],
    //                     },
    //                   },
    //                   {
    //                     userEnteredValue: {
    //                       stringValue: values[1],
    //                     },
    //                   },
    //                   {
    //                     userEnteredValue: {
    //                       stringValue: values[2],
    //                     },
    //                   },
    //                   {
    //                     userEnteredValue: {
    //                       stringValue: link,
    //                     },
    //                   },
    //                   {
    //                     userEnteredValue: {
    //                       stringValue: date,
    //                     },
    //                   },
    //                 ],
    //               },
    //             ],
    //             fields: "*",
    //           },
    //         },
    //       ],
    //     },
    //   };
    //   const sheetResponse = await sheet.spreadsheets.batchUpdate(request);

    //   // update file from google drive having file name as fileName

    //   const drive = google.drive({ version: "v3", auth });

    //   const queryFileDeleteId = await drive.files.list({
    //     q: `name='${fileName}'`,
    //     fields: "files(id, name)",
    //   });

    //   const fileId = queryFileDeleteId.data.files[0].id;

    //   const fileResponse = await drive.files.update({
    //     fileId: fileId,
    //     requestBody: {
    //       name: fileName,
    //       description: description,
    //       mimeType: "application/vnd.google-apps.document",
    //     },
    //   });

    //   res.status(200).json({ message: "success" });
    // } else {
    //   res.status(400).json({ message: "error" });
  }
}
