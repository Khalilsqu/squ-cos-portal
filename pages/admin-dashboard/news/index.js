import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Form, Table, Button, message, Space } from "antd";
import { useState } from "react";
import moment from "moment/moment";
import { v4 as uuidv4 } from "uuid";

import { AiOutlineInsertRowBelow } from "react-icons/ai";

import ModalData from "../../../components/admin-dashboard/news/addModalNews";
import { columnsData } from "../../../components/admin-dashboard/news/editTableData";

import { useWindowSize } from "@/components/utils/windowSize";

export default function News(props) {
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [editingRowKey, setEditingRowKey] = useState(null);

  const { width } = useWindowSize();

  const currentdate = new Date();

  const handleDelete = (key) => {
    const dataSource = [...data];
    setData(dataSource.filter((item) => item.key !== key));

    message.success("News deleted successfully", 2);
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
    message.success("News edited succesfully", 2);
  };

  const columns = columnsData({
    handleDelete,
    editingRowKey,
    setEditingRowKey,
    formEdit,
    handleEditFormFinish,
  });

  const handleAddFormFinish = (values) => {
    setData([
      ...data,
      {
        key: uuidv4(),
        title: values.title,
        description: values.description,
        date: currentdate.toLocaleString(),
        image: values.image,
        expiryDate: values.expiryDate.format("ddd, MMM Do YYYY"),
      },
    ]);
  };

  return (
    <Space>
      <ModalData
        formAdd={formAdd}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        handleAddFormFinish={handleAddFormFinish}
      />
      <Table
        columns={columns}
        dataSource={data}
        footer={() => {
          return (
            <Button
              type="primary"
              onClick={() => setIsModalVisible(true)}
              className="w-full flex justify-center items-center gap-4"
              icon={<AiOutlineInsertRowBelow />}
            >
              Add News
            </Button>
          );
        }}
        size="small"
        scroll={{ x: true }}
        tableLayout="auto"
        bordered
        // style={{
        //   maxWidth: width > 768 ? "100%" : width > 500 ? "450px" : "280px",
        // }}
        className={
          "py-2 px-4 items-center justify-center " +
          (width > 768 ? "max-w-full" : width > 500 ? "max-w-md" : "max-w-xs")
        }
      />
    </Space>
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
