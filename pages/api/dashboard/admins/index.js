import { Client, ID, Databases, Query } from "node-appwrite";

export default async function addHandler(req, res) {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_DATABASE_API_KEY);

  const databases = new Databases(client);

  if (req.method == "POST") {
    const data = req.body;

    try {
      const createDocument = await databases.createDocument(
        process.env.APPWRITE_DATABASE_ID_USERS,
        process.env.APPWRITE_DATABASE_COLLECTION_ID_USERS,
        ID.unique(),
        data
      );

      res.status(200).json({ message: "Success" });
    } catch (error) {
      res.status(400).json({ message: "Error" });
    }
  }

  if (req.method == "DELETE") {
    const row = req.body;

    console.log(row);

    try {
      const listDocuments = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID_USERS,
        process.env.APPWRITE_DATABASE_COLLECTION_ID_USERS,
        [Query.equal("email", row.email)]
      );

      console.log(listDocuments);

      const result = await databases.deleteDocument(
        process.env.APPWRITE_DATABASE_ID_USERS,
        process.env.APPWRITE_DATABASE_COLLECTION_ID_USERS,
        listDocuments.documents[0].$id
      );
      res.status(200).json({ message: "Success" });
    } catch (error) {
      res.status(400).json({ message: "Error" });
    }
  }

  if (req.method == "GET") {
    try {
      const result = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID_USERS,
        process.env.APPWRITE_DATABASE_COLLECTION_ID_USERS
      );

      const data = result.documents.map((item) => ({
        key: item.$id,
        email: item.email,
        canEditNews: item.canEditNews,
        canEditStaff: item.canEditStaff,
        canEditAdmins: item.canEditAdmins,
      }));

      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: "Error" });
    }
  }

  if (req.method == "PATCH") {
    const data = req.body;

    try {
      data.map(async (item) => {
        const result = await databases.updateDocument(
          process.env.APPWRITE_DATABASE_ID_USERS,
          process.env.APPWRITE_DATABASE_COLLECTION_ID_USERS,
          item.key,
          {
            canEditNews: item.canEditNews,
            canEditStaff: item.canEditStaff,
            canEditAdmins: item.canEditAdmins,
          }
        );
      });

      res.status(200).json({ message: "Success" });
    } catch (error) {
      res.status(400).json({ message: "Error" });
    }
  }
}
