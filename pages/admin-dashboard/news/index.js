import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import {
  Form,
  Table,
  Card,
  Button,
  Modal,
  Input,
  DatePicker,
  Popconfirm,
  message,
} from "antd";
import { useState } from "react";

import ModalData from "./addModalNews";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export function columnsData({ handleDelete, handleEdit }) {
  return [
    {
      key: "id",
      title: "Title",
      dataIndex: "title",
      key: "1",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "2",
    },
    {
      title: "Date Posted",
      dataIndex: "date",
      key: "3",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "4",
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "5",
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="flex flex-row justify-between">
          <Popconfirm
            title="Sure to delete?"
            okType="danger"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.key)}
          >
            <DeleteOutlined className="text-red-700 cursor-pointer" />
          </Popconfirm>
          <EditOutlined
            className="cursor-pointer"
            onClick={() => handleEdit(record.key)}
          >
            Edit
          </EditOutlined>
        </div>
      ),
      key: "6",
    },
  ];
}

export default function News(props) {
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleEdit, setIsModalVisibleEdit] = useState(false);
  const [editingData, setEditingData] = useState({});
  const [data, setData] = useState([]);

  const currentdate = new Date();

  const handleDelete = (key) => {
    const dataSource = [...data];
    setData(dataSource.filter((item) => item.key !== key));

    message.success("News Deleted", 1);
  };

  const handleEdit = (key) => {
    const dataSource = [...data];
    const editingData = dataSource.filter((item) => item.key === key);
    setEditingData(editingData[0]);
    setIsModalVisibleEdit(true);
  };

  const columns = columnsData({ handleDelete, handleEdit });

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

  const handleEditFormFinish = (values) => {
    const dataSource = [...data];
    const editingData = dataSource.filter((item) => item.key === values.key);
    editingData[0].title = values.title;
    editingData[0].description = values.description;
    editingData[0].image = values.image;
    editingData[0].expiryDate = values.expiryDate;
    setData(dataSource);
  };

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
      <ModalEdit
        formEdit={formEdit}
        isModalVisibleEdit={isModalVisibleEdit}
        setIsModalVisibleEdit={setIsModalVisibleEdit}
        handleEditFormFinish={handleEditFormFinish}
        editingData={editingData}
      />
      <Table columns={columns} dataSource={data} className="flex" />
    </Card>
  );
}

const ModalEdit = ({
  formEdit,
  isModalVisibleEdit,
  setIsModalVisibleEdit,
  handleEditFormFinish,
  editingData,
}) => {
  const handleCancel = () => {
    setIsModalVisibleEdit(false);
    formEdit.resetFields();
  };

  const handleOk = () => {
    setIsModalVisibleEdit(false);
    formEdit.submit();
  };

  return (
    <Modal
      title="Edit News"
      open={isModalVisibleEdit}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="Update"
    >
      <Form
        form={formEdit}
        name="editNews"
        layout="vertical"
        initialValues={{
          title: editingData.title,
          description: editingData.description,
          image: editingData.image,
          expiryDate: editingData.expiryDate,
        }}
        onFinish={handleEditFormFinish}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input title!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input description!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Image"
          name="image"
          rules={[{ required: true, message: "Please input image!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Expiry Date"
          name="expiryDate"
          rules={[{ required: true, message: "Please input expiry date!" }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Edit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

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
