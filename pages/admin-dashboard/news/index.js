import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Form, Table, Card, Button, message } from "antd";
import { useState, useEffect } from "react";
import moment from "moment/moment";

import ModalData from "./addModalNews";
import { columnsData } from "./editTableData";

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export default function News(props) {
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [editingRowKey, setEditingRowKey] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const currentdate = new Date();

  const handleDelete = (key) => {
    const dataSource = [...data];
    setData(dataSource.filter((item) => item.key !== key));

    message.success("News Deleted", 1);
  };

  const handleEditFormFinish = (values) => {
    values.expiryDate = moment(values.expiryDate).format("ddd, MMM Do YYYY");

    const newData = [...data];
    const index = newData.findIndex((item) => editingRowKey === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...values,
    });
    setData(newData);
    setEditingRowKey(null);
    message.success("News Edited", 1);
  };

  const columns = columnsData({
    handleDelete,
    editingRowKey,
    setEditingRowKey,
    formEdit,
    handleEditFormFinish,
    uploadedFile,
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
        expiryDate: "Wed, Mar 22nd 2023",
      },
      {
        key: 2,
        title: "SQU Students Win 2rd ",
        description: "SQU students won the 3rd place in the 2021",
        date: currentdate.toLocaleString(),
        image: "https:/",
        expiryDate: "Wed, Mar 22nd 2023",
      },
      {
        key: 3,
        title: "SQU Students Win 3rd ",
        description: "SQU students won the 3rd place in the 2021",
        date: currentdate.toLocaleString(),
        image: "https:/",
        expiryDate: "Wed, Mar 22nd 2023",
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
        uploadedFile={uploadedFile}
        setUploadedFile={setUploadedFile}
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
