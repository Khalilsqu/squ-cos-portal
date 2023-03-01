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
  Upload,
  Popconfirm,
} from "antd";
import { useState } from "react";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export function columnsData(handleDelete) {
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
          <EditOutlined className="cursor-pointer">Edit</EditOutlined>
        </div>
      ),
      key: "6",
    },
  ];
}

export default function News(props) {
  const [data, setData] = useState([]);
  var currentdate = new Date();

  const handleDelete = (key) => {
    const dataSource = [...data];
    setData(dataSource.filter((item) => item.key !== key));
  };

  const handleEdit = (key) => {
    const dataSource = [...data];
    setData(dataSource.filter((item) => item.key !== key));
  };

  const columns = columnsData(handleDelete);
  const handleFormFinish = (values) => {
    setData([
      ...data,
      {
        key: data.length + 1,
        title: values.title,
        description: values.description,
        date: currentdate.toString(),
        image: values.image,
        expiryDate: values.expiryDate.format("DD/MMM/YYYY"),
      },
    ]);
  };

  const handleAddNews = () => {
    Modal.confirm({
      title: "Add News",
      content: (
        <Form onFinish={handleFormFinish}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input title!" }]}
          >
            <Input maxLength={25} placeholder="Write A Title" showCount />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <Input.TextArea
              placeholder="Write a description of the news"
              showCount
              maxLength={120}
            />
          </Form.Item>
          <Form.Item
            label="Image"
            name="image"
            rules={[{ required: true, message: "Please input image!" }]}
          >
            <Upload>
              <Button>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Expiry Date"
            name="expiryDate"
            rules={[{ required: true, message: "Please input expiry date!" }]}
          >
            <DatePicker />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      ),
    });
  };

  return (
    <Card>
      <Button type="primary" onClick={handleAddNews}>
        Add News
      </Button>
      <Table columns={columns} dataSource={data} />
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
