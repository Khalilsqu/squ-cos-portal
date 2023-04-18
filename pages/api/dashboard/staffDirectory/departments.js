import { Client, Databases, ID } from "node-appwrite";

export default async function handler(req, res) {
  const client = new Client();
  client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_DATABASE_API_KEY);

  const database = new Databases(client);

  const databaseId = process.env.APPWRITE_DATABASE_ID_USERS;
  const collectionId = process.env.APPWRITE_DATABASE_COLLECTION_ID_DEPARTMENTS;

  if (req.method === "GET") {
    try {
      const response = await database.listDocuments(databaseId, collectionId);

      // return on the fields departmentName and selected
      const data = [];
      response.documents.map((document) => {
        data.push({
          key: document.$id,
          departmentName: document.departmentName,
        });
      });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "POST") {
    const data = req.body;
    console.log(data);
    try {
      const response = await database.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        {
          departmentName: data.departmentName,
        }
      );
      res.status(200).json(response.$id);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "PATCH") {
    const data = req.body;
    console.log(data);
    try {
      const response = await database.deleteDocument(
        databaseId,
        collectionId,
        data
      );
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
