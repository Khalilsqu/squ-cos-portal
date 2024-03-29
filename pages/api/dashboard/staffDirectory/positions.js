import { Client, Databases, ID } from "node-appwrite";

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
      // const response = await database.listDocuments(databaseId, collectionId);

      const [dataResponse, categoryResponse] = await Promise.all([
        database.listDocuments(databaseId, collectionId),
        database.getAttribute(databaseId, collectionId, "category"),
      ]);

      // return on the fields positionName and selected
      const data = [];
      dataResponse.documents.map((document) => {
        data.push({
          key: document.$id,
          positionName: document.positionName,
          selected: document.selected,
          category: document.category,
        });
      });

      const categoryList = categoryResponse.elements;

      res.status(200).json({ data, categoryList });
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
  } else if (req.method === "POST") {
    const data = req.body;
    if (data.changeType === "delete") {
      try {
        const response = await database.deleteDocument(
          databaseId,
          collectionId,
          data.key
        );
        res.status(200).json(response);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else if (data.changeType === "add") {
      try {
        const response = await database.createDocument(
          databaseId,
          collectionId,
          ID.unique(),
          {
            positionName: data.positionName,
            category: data.category,
          }
        );
        res.status(201).json(response.$id);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else if (data.changeType === "edit") {
      try {
        const response = await database.updateDocument(
          databaseId,
          collectionId,
          data.key,
          {
            positionName: data.positionName,
            category: data.category,
          }
        );
        res.status(200).json(response.$id);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else if (data.changeType === "categoryAdd") {
      const response = () =>
        database
          .deleteAttribute(databaseId, collectionId, "category")
          .then((deleteResponse) => deleteResponse.json())
          .then(
            database.createEnumAttribute(
              databaseId,
              collectionId,
              "category",
              data.categoryList,
              true
            )
          )
          .then(res.status(200).json({ message: "success" }))
          .catch((error) => res.status(500).json({ error: error.message }));

      response();
    }
  }
}
