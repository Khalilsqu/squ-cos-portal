// save news data to a google sheet

// Path: pages\api\dashboard\news\index.js
// Compare this snippet from components\admin-dashboard\news\addModalNews.js:
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { GoogleSpreadsheet } from "google-spreadsheet";

export default async function handler(req, res) {
  res.status(200).json({ message: "News added successfully" });
  //   const session = await getServerSession(req, res, authOptions);
  //   const comment = req.body.comment;

  //   console.log(values);
  //   if (session) {
  //     if (req.method == "POST") {
  //       const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
  //       await doc.useServiceAccountAuth({
  //         client_email: process.env.GOOGLE_SERVICE_ACOUNT_EMAIL,
  //         private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY.replace(
  //           /\\n/gm,
  //           "\n"
  //         ),
  //       });
  //       await doc.loadInfo();
  //       const sheet = doc.sheetsByIndex[0];
  //       await sheet.addRow({
  //         key: comment,
  //       });
  //       res.status(200).json({ message: "News added successfully" });
  //     } else {
  //       res.status(400).json({ message: "Bad request" });
  //     }
  //   } else {
  //     res.status(401).json({ message: "Unauthorized" });
  //   }
}
