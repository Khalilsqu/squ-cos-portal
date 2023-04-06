import { Client, Databases, Query } from "appwrite";
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
  const session = await getServerSession(context.req, context.res, authOptions);

  const adminEmails = new Array();

  const client = new Client();

  client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID);

  const databases = new Databases(client);

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
