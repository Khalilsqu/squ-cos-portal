import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Form, Table, Card, Button, message } from "antd";
import { useState, useEffect } from "react";

import ModalData from "./addModalNews";
import { columnsData } from "./editTableData";

export default function News(props) {
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [editingRowKey, setEditingRowKey] = useState(null);
  const [editingRow, setEditingRow] = useState(null);

  const currentdate = new Date();
  const myDate = new Date("2021-05-24T10:30:00");

  const handleDelete = (key) => {
    const dataSource = [...data];
    setData(dataSource.filter((item) => item.key !== key));

    message.success("News Deleted", 1);
  };

  const handleEditFormFinish = (values) => {
    values.expiryDate = values.expiryDate.format("ddd, MMM Do YYYY"); // format date

    const newData = [...data];
    const index = newData.findIndex((item) => editingRowKey === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...values,
    });
    setData(newData);
    setEditingRowKey(null);
    setEditingRow(null);
    message.success("News Edited", 1);
  };

  const columns = columnsData({
    handleDelete,
    editingRowKey,
    setEditingRowKey,
    editingRow,
    setEditingRow,
    formEdit,
    handleEditFormFinish,
  });

  const handleAddFormFinish = (values) => {
    setData([
      ...data,
      {
        key: data.length + 1,
        title: values.title,
        description: values.description,
        date: currentdate.toLocaleString(),
        image: values.image,
        expiryDate: values.expiryDate.format("ddd, MMM Do YYYY"),
      },
    ]);
  };

  useEffect(() => {
    setData([
      {
        key: 1,
        title: "SQU Students Win 1rd ",
        description: "SQU students won the 3rd place in the 2021",
        date: currentdate.toLocaleString(),
        image: "https:/",
        expiryDate: "2021-05-12",
      },
      {
        key: 2,
        title: "SQU Students Win 2rd ",
        description: "SQU students won the 3rd place in the 2021",
        date: currentdate.toLocaleString(),
        image: "https:/",
        expiryDate: "2021-05-12",
      },
      {
        key: 3,
        title: "SQU Students Win 3rd ",
        description: "SQU students won the 3rd place in the 2021",
        date: currentdate.toLocaleString(),
        image: "https:/",
        expiryDate: "2021-05-12",
      },
    ]);
  }, []);

  return (
    <Card className="flex my-4 rounded-2xl shadow-xl">
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Add News
      </Button>
      <ModalData
        formAdd={formAdd}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        handleAddFormFinish={handleAddFormFinish}
      />
      <Table columns={columns} dataSource={data} className="flex" />
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
