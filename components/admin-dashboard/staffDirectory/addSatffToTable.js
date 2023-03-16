import { Drawer, Button, Form, Select, Input } from "antd";
import { useWindowSize } from "@/components/utils/windowSize";

import { MailOutlined } from "@ant-design/icons";
export const AddStaffDrawer = ({
  drawerOpen,
  setDrawerOpen,
  formAdd,
  handleAddFormFinish,
  setFormErrorMessages,
  departmentList,
  targetKeys,
  columns,
  data,
}) => {
  const { width } = useWindowSize();
  return (
    <Drawer
      title="Add Staff"
      placement="right"
      closable={false}
      onClose={() => setDrawerOpen(false)}
      open={drawerOpen}
      maskClosable={false}
      mask={true}
      maskStyle={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
      }}
      width={
        width > 768 ? "25%" : width > 576 ? "50%" : width > 320 ? "80%" : "100%"
      }
      footer={
        <div
          style={{
            textAlign: "right",
          }}
        >
          <Button
            onClick={() => {
              formAdd.resetFields();
              setDrawerOpen(false);
            }}
            style={{ marginRight: 8 }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              formAdd
                .validateFields()
                .then((values) => {
                  handleAddFormFinish(values);
                  formAdd.resetFields();
                  setDrawerOpen(false);
                })
                .catch((info) => {
                  setFormErrorMessages(info.errorFields);
                });
            }}
            type="primary"
          >
            Submit
          </Button>
        </div>
      }
    >
      <Form form={formAdd} layout="vertical">
        {columns.map((column) => {
          if (column.dataIndex === "Department") {
            return (
              <Form.Item
                key={column.dataIndex}
                name={column.dataIndex}
                label={column.title}
                rules={[
                  {
                    required: true,
                    message: `Please input the ${column.title.toLowerCase()}!`,
                  },
                ]}
              >
                <Select>
                  {departmentList?.map((department) => {
                    return (
                      <Select.Option key={department} value={department}>
                        {department}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            );
          }
          if (column.dataIndex === "Email") {
            return (
              <Form.Item
                key={column.dataIndex}
                name={column.dataIndex}
                label={column.title}
                rules={[
                  {
                    required: true,
                    message: `Please input the ${column.title.toLowerCase()}!`,
                  },
                  {
                    type: "email",
                    message: "Please input a valid email address",
                  },
                ]}
              >
                <Input suffix={<MailOutlined />} />
              </Form.Item>
            );
          }
          if (column.dataIndex === "Action") {
            return null;
          }

          if (column.dataIndex === "Position") {
            return (
              <Form.Item
                key={column.dataIndex}
                name={column.dataIndex}
                label={column.title}
                rules={[
                  {
                    required: true,
                    message: `Please input the ${column.title.toLowerCase()}!`,
                  },
                ]}
              >
                <Select showSearch>
                  {targetKeys?.map((targetKey) => {
                    return (
                      <Select.Option key={targetKey} value={targetKey}>
                        {targetKey}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            );
          }
          if (column.dataIndex === "Reports To") {
            return (
              <Form.Item
                key={column.dataIndex}
                name={column.dataIndex}
                label={column.title}
              >
                <Select showSearch>
                  {data?.map((staff) => {
                    return (
                      <Select.Option key={staff["Name"]} value={staff["Name"]}>
                        {staff["Name"]}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            );
          }

          return (
            <Form.Item
              key={column.dataIndex}
              name={column.dataIndex}
              label={column.title}
              rules={[
                {
                  required: true,
                  message: `Please input the ${column.title.toLowerCase()}!`,
                },
              ]}
            >
              <Input />
            </Form.Item>
          );
        })}
      </Form>
    </Drawer>
  );
};
