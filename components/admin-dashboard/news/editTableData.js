import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import {
  Form,
  Input,
  Popconfirm,
  Button,
  DatePicker,
  Image,
  Space,
  Typography,
  Upload,
} from "antd";
import dayjs from "dayjs";
import moment from "moment/moment";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

export function columnsData({
  handleDelete,
  editingRowKey,
  setEditingRowKey,
  formEdit,
  handleEditFormFinish,
}) {
  return [
    {
      key: uuidv4(),
      title: "Title",
      dataIndex: "title",
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
      key: uuidv4(),
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
      key: uuidv4(),
    },
    {
      title: "Image",
      key: uuidv4(),
      render: (text, record) => {
        if (record.key === editingRowKey) {
          return (
            <Form form={formEdit} onFinish={handleEditFormFinish}>
              <Form.Item
                name="image"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e && e.fileList;
                }}
                initialValue={record.image.fileList}
                rules={[
                  {
                    required: true,
                    message: "Please upload an image!",
                  },
                ]}
              >
                <Upload
                  listType="picture"
                  maxCount={1}
                  accept="
                  image/png,
                  image/jpeg,
                  image/jpg,
                "
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Form>
          );
        } else {
          return record.image.fileList ? (
            <Image
              width={70}
              src={record.image.fileList[0].thumbUrl}
              alt={record.image.fileList[0].name}
            />
          ) : (
            <Image
              width={70}
              src={text.image[0].thumbUrl}
              alt={text.image[0].thumbUrl.name}
            />
          );
        }
      },
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: uuidv4(),
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
      key: uuidv4(),
      fixed: "right",
    },
  ];
}
