import { Client, Databases } from "node-appwrite";

export default async function handler(req, res) {
  const client = new Client();
  client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_DATABASE_API_KEY);

  const database = new Databases(client);

  const databaseId = process.env.APPWRITE_DATABASE_ID_USERS;
  const collectionId =
    process.env.APPWRITE_DATABASE_COLLECTION_ID_STAFF_DIRECTORY;

  if (req.method === "GET") {
    try {
      const response = await database.listAttributes(databaseId, collectionId);
      res.status(200).json(response.attributes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
