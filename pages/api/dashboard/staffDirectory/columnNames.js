import { Client, Databases } from "node-appwrite";

export default async function addHandler(req, res) {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_DATABASE_API_KEY);

  const databases = new Databases(client);

  if (req.method == "GET") {
    try {
      const staffDirecory = await databases.listAttributes(
        process.env.APPWRITE_DATABASE_ID_USERS,
        process.env.APPWRITE_DATABASE_COLLECTION_ID_STAFF_DIRECTORY
      );

      res.status(200).json(staffDirecory.attributes);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
