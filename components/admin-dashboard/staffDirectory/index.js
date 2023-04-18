import { Modal, Button, Form, Input, Select, Switch } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

import { columnWidth } from "./tableColumns";

export const AddColumnModal = ({
  columns,
  setColumns,
  columnAddModalOpen,
  setColumnAddModalOpen,
  formAddColumns,
}) => {
  return (
    <Modal
      title="Add a new column"
      open={columnAddModalOpen}
      onCancel={() => setColumnAddModalOpen(false)}
      footer={[
        <Button
          key="back"
          onClick={() => {
            formAddColumns.resetFields();
            setColumnAddModalOpen(false);
          }}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            formAddColumns
              .validateFields()
              .then((values) => {
                const newColumns = [...columns];

                newColumns.splice(newColumns.length - 1, 0, {
                  title: values.title,
                  dataIndex: values.title,
                  columnType: values.columnType,
                  required: values.required,
                  editable: true,
                  width: columnWidth,
                  render: (text, record) => {
                    if (text !== undefined && text !== null) {
                      if (values.columnType === "date") {
                        return text.format("DD/MMM/YYYY");
                      }
                    }
                    if (values.columnType === "boolean") {
                      return text ? <CheckOutlined /> : <CloseOutlined />;
                    }
                  },
                });
                setColumns(newColumns);
                setColumnAddModalOpen(false);
                formAddColumns.resetFields();
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
        >
          Submit
        </Button>,
      ]}
    >
      <Form
        form={formAddColumns}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: "public",
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              message: "Please input the title of the column!",
            },
            {
              validator: async (rule, value) => {
                if (value.trim() !== value) {
                  throw new Error("Column cannot start or end with whitespace");
                }
              },
            },
            {
              validator: async (rule, value) => {
                if (value.length > 20) {
                  throw new Error(
                    "Column title cannot be longer than 20 characters"
                  );
                }
              },
            },
            {
              validator: async (rule, value) => {
                if (
                  columns
                    .map((column) => column.title.toLowerCase().trim())
                    .includes(value.toLowerCase().trim())
                ) {
                  throw new Error("Column already exists");
                }
              },
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="columnType"
          label="Column Type"
          rules={[
            {
              required: true,
              message: "Please select the column type!",
            },
          ]}
        >
          <Select>
            <Select.Option value="text">Text</Select.Option>
            <Select.Option value="number">Number</Select.Option>
            <Select.Option value="date">Date</Select.Option>
            <Select.Option value="boolean">Boolean</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="required"
          label="Required"
          valuePropName="checked"
          initialValue={true}
          rules={[
            {
              required: true,
              message: "Please select if the column is required!",
            },
          ]}
        >
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={true}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
