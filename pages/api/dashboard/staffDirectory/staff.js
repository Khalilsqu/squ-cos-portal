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
        spreadsheetId: process.env.GOOGLE_SHEET_STAFF_DIRECTORY,
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
 
    try {
      const sheet = authentication();
      const response = await sheet.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_STAFF_DIRECTORY,
        range: "Sheet1!A:A",
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [[req.body.department]],
        },
      });
      res.status(200).json({ message: "Department added successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      const sheet = authentication();
      const response = await sheet.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_STAFF_DIRECTORY,
        range: "Sheet1!A:A",
      });
      const rows = response.data.values;
      const data = [];
      if (rows) {
        rows.map((row) => {
          data.push(row[0]);
        });
        const index = data.indexOf(req.body.department);
        if (index > -1) {
          data.splice(index, 1);
        }
        const response = await sheet.spreadsheets.values.update({
          spreadsheetId: process.env.GOOGLE_SHEET_STAFF_DIRECTORY,
          range: "Sheet1!A:A",
          valueInputOption: "USER_ENTERED",
          resource: {
            values: [data],
          },
        });
        res.status(200).json({ message: "Department deleted successfully" });
      } else {
        res.status(200).json([]);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ error: "Invalid request method" });
  }
}
