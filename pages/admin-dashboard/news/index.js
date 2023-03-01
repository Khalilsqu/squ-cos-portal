import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Typography, Form, Table, Card } from "antd";
import { useState } from "react";

const columns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Date Posted",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
  },
  {
    title: "Expiry Date",
    dataIndex: "expiryDate",
    key: "expiryDate",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
  },
];

export default function News(props) {
  const [data, setData] = useState([
    {
      key: "1",
      title: "John Brown",
      description: 32,
      date: "New York No. 1 Lake Park",
      image: "New York No. 1 Lake Park",
      expiryDate: "New York No. 1 Lake Park",
      action: "New York No. 1 Lake Park",
    },
    {
      key: "2",
      title: "John Brown",
      description: 32,
      date: "New York No. 1 Lake Park",
      image: "New York No. 1 Lake Park",
      expiryDate: "New York No. 1 Lake Park",
      action: "New York No. 1 Lake Park",
    },
    {
      key: "3",
      title: "John Brown",
      description: 32,
      date: "New York No. 1 Lake Park",
      image: "New York No. 1 Lake Park",
      expiryDate: "New York No. 1 Lake Park",
      action: "New York No. 1 Lake Park",
    },
    {
      key: "4",
      title: "John Brown",
      description: 32,
      date: "New York No. 1 Lake Park",
      image: "New York No. 1 Lake Park",
      expiryDate: "New York No. 1 Lake Park",
      action: "New York No. 1 Lake Park",
    },
  ]);
  return (
    <Card>
      <Table columns={columns} />
    </Card>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const adminEmails = [
    "hooti@squ.edu.om",
    "hosni@squ.edu.om",
    "wasila@squ.edu.om",
    "alhasnie@squ.edu.om",
    "said.m@squ.edu.om",
    "a.albarwani1@squ.edu.om",
    "h.alshukaili@squ.edu.om",
  ];

  if (!session | !adminEmails.includes(session?.user.email)) {
    return {
      redirect: { destination: "/" },
    };
  }

  return {
    props: { session },
  };
}
