import { EditOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { Form, Input, Popconfirm, Button, DatePicker } from "antd";
import dayjs from "dayjs";

export function columnsData({
  handleDelete,
  editingRowKey,
  setEditingRowKey,
  editingRow,
  setEditingRow,
  formEdit,
  handleEditFormFinish,
}) {
  return [
    {
      key: "id",
      title: "Title",
      dataIndex: "title",
      key: "1",
      render: (text, record) => {
        if (record.key === editingRowKey) {
          return (
            <Form form={formEdit} onFinish={handleEditFormFinish}>
              <Form.Item
                name="title"
                initialValue={editingRow.title}
                rules={[
                  {
                    required: true,
                    message: "Please input title!",
                    min: 5,
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
      render: (text, record) => {
        if (record.key === editingRowKey) {
          return (
            <Form form={formEdit} onFinish={handleEditFormFinish}>
              <Form.Item
                name="description"
                initialValue={editingRow.description}
                rules={[
                  {
                    required: true,
                    message: "Please input description!",
                    min: 5,
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
      render: (text, record) => {
        if (record.key === editingRowKey) {
          return (
            <Form form={formEdit} onFinish={handleEditFormFinish}>
              <Form.Item
                name="expiryDate"
                initialValue={dayjs(editingRow.expiryDate)}
                rules={[
                  {
                    required: true,
                    message: "Please input expiry date!",
                  },
                ]}
              >
                <DatePicker />
              </Form.Item>
            </Form>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="flex flex-col justify-between gap-y-2">
          <EditOutlined
            className="flex cursor-pointer"
            onClick={() => {
              setEditingRowKey(record.key);
              setEditingRow(record);
            }}
          />
          <Popconfirm
            title="Save Edits?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => formEdit.submit()}
          >
            <Button
              icon={<SaveOutlined />}
              htmlType="submit"
              className="flex border-hidden bg-transparent"
            />
            {/* <SaveOutlined className="text-red-700 cursor-pointer" /> */}
          </Popconfirm>
          <Popconfirm
            title="Sure to delete?"
            okType="danger"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.key)}
          >
            <DeleteOutlined className="flex text-red-700 cursor-pointer" />
          </Popconfirm>
        </div>
      ),
      key: "6",
    },
  ];
}
