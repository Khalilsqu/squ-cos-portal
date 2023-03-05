// save news data to a google sheet
import { GoogleSpreadsheet } from "google-spreadsheet";
import { google } from "googleapis";

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

export default async function handler(req, res) {
  if (req.method == "POST") {
    const values = req.body;

    console.log(values === undefined);
    if (values !== undefined) {
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

      const response = await sheet.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: "Sheet1!A:E",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [
            [
              values.key,
              values.title,
              values.description,
              values.date,
              values.expiryDate,
            ],
          ],
        },
      });

      const drive = google.drive({ version: "v3", auth });

      async function uploadImage() {
        const response = await drive.files.create({
          requestBody: {
            name: values.key,
            mimeType: "image/jpeg,image/png,image/jpg",
          },
          media: {
            mimeType: "image/jpeg,image/png,image/jpg",
            body: await getBase64(values.image),
          },
        });

        return response.data.id;
      }

      const imageId = await uploadImage();
    } else {
      res.status(400).json({ message: "No data" });
    }
  }
}
