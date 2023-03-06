// save news data to a google sheet
import { google } from "googleapis";
import { Readable } from "stream";

const convertImageStream = (image) => {
  const readableImageStream = new Readable();
  readableImageStream.push(image);
  readableImageStream.push(null);

  return readableImageStream;
};

export default async function addHandler(req, res) {
  if (req.method == "POST") {
    const { dataAdded, uploadedUserImage } = req.body;

    if (dataAdded !== undefined && uploadedUserImage !== undefined) {
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
        const response = await sheet.spreadsheets.values.append({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
          range: "Sheet1!A:E",
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [
              [
                dataAdded.key,
                dataAdded.title,
                dataAdded.description,
                dataAdded.date,
                dataAdded.expiryDate,
              ],
            ],
          },
        });
        const drive = google.drive({ version: "v3", auth });
        const fileMetadata = {
          name: dataAdded.key,
          parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
        };
        const media = {
          mimeType: dataAdded.image.type,
          body: convertImageStream(
            Buffer.from(uploadedUserImage.split(",")[1], "base64")
          ),
        };
        const file = await drive.files.create({
          resource: fileMetadata,
          media: media,
          fields: "id",
        });

        res.status(200).json({ message: "Success" });
      } catch (error) {
        res.status(500).json({ message: "Error adding news" });
      } finally {
        res.end();
      }
    } else {
      res.status(400).json({ message: "No data recieved" });
    }
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};
