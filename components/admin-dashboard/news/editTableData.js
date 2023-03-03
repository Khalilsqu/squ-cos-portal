import { EditOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  Popconfirm,
  Button,
  DatePicker,
  Image,
  Space,
  Typography,
} from "antd";
import dayjs from "dayjs";
import moment from "moment/moment";

export function columnsData({
  handleDelete,
  editingRowKey,
  setEditingRowKey,
  formEdit,
  handleEditFormFinish,
  uploadedFile,
}) {
  return [
    {
      key: "id",
      title: "Title",
      dataIndex: "title",
      key: "1",
      width: "20%",
      render: (text, record) => {
        if (record.key === editingRowKey) {
          return (
            <Form form={formEdit} onFinish={handleEditFormFinish}>
              <Form.Item
                name="title"
                initialValue={record.title}
                rules={[
                  {
                    required: true,
                    message: "Please input title of minimum 5 characters!",
                    min: 1,
                  },
                ]}
              >
                <Input maxLength={25} />
              </Form.Item>
            </Form>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "2",
      width: "30%",
      render: (text, record) => {
        if (record.key === editingRowKey) {
          return (
            <Form form={formEdit} onFinish={handleEditFormFinish}>
              <Form.Item
                name="description"
                initialValue={record.description}
                rules={[
                  {
                    required: true,
                    message: "Please input description!",
                    min: 1,
                  },
                ]}
              >
                <Input.TextArea showCount maxLength={120} />
              </Form.Item>
            </Form>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Date Posted",
      dataIndex: "date",
      key: "3",
      width: "15%",
    },
    {
      title: "Image",
      // dataIndex: "image",

      key: "4",
      width: "15%",
      render: (text, record) => {
        return (
          <div className="flex flex-col justify-center items-center">
            {record.key === editingRowKey && (
              <Form form={formEdit} onFinish={handleEditFormFinish}>
                <Form.Item
                  name="image"
                  initialValue={
                    uploadedFile !== null
                      ? uploadedFile[0].thumbUrl
                      : record.image
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please input image!",
                    },
                  ]}
                >
                  <Image
                    width={100}
                    src={
                      uploadedFile !== null
                        ? uploadedFile[0].thumbUrl
                        : record.image
                    }
                    alt="Uploaded Image"
                  />
                </Form.Item>
              </Form>
            )}
          </div>
        );
      },
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "5",
      width: "15%",
      render: (text, record) => {
        const date = moment(record.expiryDate, "ddd, MMM Do YYYY");
        if (record.key === editingRowKey) {
          return (
            <Form form={formEdit} onFinish={handleEditFormFinish}>
              <Form.Item
                name="expiryDate"
                getValueFromEvent={(e) =>
                  e
                    ? e.format("YYYY-MM-DD")
                    : moment(record.expiryDate, "ddd, MMM Do YYYY")
                }
                getValueProps={(i) => ({
                  value: dayjs(
                    moment(i, "ddd, MMM Do YYYY").format("YYYY-MM-DD")
                  ),
                })}
                initialValue={date}
                rules={[
                  {
                    required: true,
                    message: "Please input expiry date!",
                  },
                ]}
              >
                <DatePicker format="YYYY-MM-DD" inputReadOnly />
              </Form.Item>
            </Form>
          );
        } else {
          return <Typography.Text>{text}</Typography.Text>;
        }
      },
    },
    {
      title: "Action",
      render: (text, record) => (
        <Space
          direction="vertical"
          className="flex flex-col gap-y-4 justify-between items-center align-middle"
        >
          <Space
            direction="horizontal"
            className="flex flex-row gap-x-2 justify-between items-center align-middle"
          >
            <EditOutlined
              className="flex cursor-pointer"
              onClick={() => {
                setEditingRowKey(record.key);
              }}
            />

            {record.key === editingRowKey && (
              <Popconfirm
                title="Save Edits?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => formEdit.submit()}
              >
                <Button
                  icon={<SaveOutlined />}
                  htmlType="submit"
                  className="flex border-hidden bg-transparent justify-center items-center"
                />
              </Popconfirm>
            )}
          </Space>
          <Popconfirm
            title="Sure to delete?"
            okType="danger"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.key)}
          >
            <DeleteOutlined className="flex text-red-700 cursor-pointer mt-4" />
          </Popconfirm>
        </Space>
      ),
      key: "6",
      fixed: "right",
      width: "5%",
    },
  ];
}
