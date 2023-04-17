import { Client, Databases } from "node-appwrite";

export default async function handler(req, res) {
  const client = new Client();
  client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_DATABASE_API_KEY);

  const database = new Databases(client);

  const databaseId = process.env.APPWRITE_DATABASE_ID_USERS;
  const collectionId = process.env.APPWRITE_DATABASE_COLLECTION_ID_POSITIONS;

  if (req.method === "GET") {
    try {
      const response = await database.listDocuments(databaseId, collectionId);

      // return on the fields positionName and selected
      const data = [];
      response.documents.map((document) => {
        data.push({
          key: document.$id,
          positionName: document.positionName,
          selected: document.selected,
          description: document.description,
        });
      });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "PATCH") {
    const data = req.body;
    if (data.changeType === "selected") {
      try {
        const response = await database.updateDocument(
          databaseId,
          collectionId,
          data.key,
          {
            selected: data.selected,
          }
        );

        res.status(200).json(response);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
}
