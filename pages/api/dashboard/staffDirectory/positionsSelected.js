import { google } from "googleapis";

const authentication = () => {
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

  return sheet;
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const sheet = authentication();

      const response = await sheet.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_POSITIONS_SELECTED,
        range: "Sheet1!A:A",
      });
      const rows = response.data.values;
      const data = [];
      if (rows) {
        rows.map((row) => {
          data.push(row[0]);
        });
        res.status(200).json(data);
      } else {
        res.status(200).json([]);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "POST") {
    // add new target positions to google sheet

    if (req.body.movedKeys.length === 0) {
      res.status(200).json({ message: "No positions selected" });
    }

    if (req.body.direction === "right") {
      try {
        const sheet = authentication();
        const response = await sheet.spreadsheets.values.append({
          spreadsheetId: process.env.GOOGLE_SHEET_POSITIONS_SELECTED,
          range: "Sheet1!A:A",
          valueInputOption: "USER_ENTERED",
          resource: {
            values: req.body.movedKeys.map((key) => [key]),
          },
        });
        console.log(response);
        res.status(200).json({ message: "Position added successfully" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }

    if (req.body.direction === "left") {
      try {
        const sheet = authentication();
        const response = await sheet.spreadsheets.values.get({
          spreadsheetId: process.env.GOOGLE_SHEET_POSITIONS_SELECTED,
          range: "Sheet1!A:A",
        });
        const rows = response.data.values;

        if (rows) {
          const keyIndex = rows
            .map((row) => row[0])
            .map((row) => req.body.movedKeys.indexOf(row))
            .filter((index) => index !== -1);

          console.log(keyIndex);
        } else {
          res.status(500).json({ error: "Position not found" });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
}
