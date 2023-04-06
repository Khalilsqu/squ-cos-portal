import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
export default function Admins(props) {
  return (
    <div>
      <h1>Admins</h1>
    </div>
  );
}

export async function getServerSideProps(context) {
  const appwriteSdk = await import("node-appwrite");
  const session = await getServerSession(context.req, context.res, authOptions);

  const adminEmails = new Array();

  const client = new appwriteSdk.Client();

  client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_DATABASE_API_KEY);

  const databases = new appwriteSdk.Databases(client);

  try {
    let promise = databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID_USERS,
      process.env.APPWRITE_DATABASE_COLLECTION_ID_USERS
    );

    let result = await promise;

    result.documents.forEach((element) => {
      adminEmails.push(element["admin-emails"]);
    });
  } catch (error) {
    return {
      redirect: { destination: "/" },
    };
  }

  if (!session | !adminEmails.includes(session?.user.email)) {
    return {
      redirect: { destination: "/" },
    };
  }

  return {
    props: { session },
  };
}
