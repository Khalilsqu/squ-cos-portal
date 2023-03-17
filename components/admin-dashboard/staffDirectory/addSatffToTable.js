import { Drawer, Button, Form, Select, Input, Row, Col } from "antd";
import { useWindowSize } from "@/components/utils/windowSize";
import { useState } from "react";

import { MailOutlined } from "@ant-design/icons";
import { RxInput } from "react-icons/rx";
import { BsCardList } from "react-icons/bs";

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
  const [reportsToMethod, setReportsToMethod] = useState("Select");

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
        width > 768 ? "35%" : width > 576 ? "50%" : width > 320 ? "80%" : "100%"
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
                <Select
                  showSearch
                  mode="multiple"
                  showArrow
                  placeholder="Select Department"
                >
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
                <Input suffix={<MailOutlined />} placeholder="Enter an email" />
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
                <Select showSearch mode="multiple" showArrow>
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
            if (reportsToMethod === "Select") {
              return (
                <Row key={column.dataIndex} className="w-full" align="middle">
                  <Col flex={6}>
                    <Form.Item
                      key={column.dataIndex}
                      name={column.dataIndex}
                      label={column.title}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: `Please input the ${column.title.toLowerCase()}!`,
                      //   },
                      // ]}
                    >
                      <Select
                        showSearch
                        placeholder="Select a name from the list"
                      >
                        {data?.map((staff) => {
                          return (
                            <Select.Option
                              key={staff["Name"]}
                              value={staff["Name"]}
                            >
                              {staff["Name"]}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col flex={1}>
                    <Row justify="end">
                      <Button
                        className="justify-end border-0 bg-transparent text-lg rounded-full"
                        onClick={() => {
                          setReportsToMethod("Input");
                        }}
                        icon={<RxInput />}
                        label="Set to input"
                      />
                    </Row>
                  </Col>
                </Row>
              );
            } else {
              return (
                <Row key={column.dataIndex} className="w-full" align="middle">
                  <Col flex={6}>
                    <Form.Item
                      key={column.dataIndex}
                      name={column.dataIndex}
                      label={column.title}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: `Please input the ${column.title.toLowerCase()}!`,
                      //   },
                      // ]}
                    >
                      <Input placeholder="Type a name" />
                    </Form.Item>
                  </Col>
                  <Col flex={1}>
                    <Row justify="end">
                      <Button
                        className="border-0 bg-transparent text-lg rounded-full"
                        onClick={() => {
                          setReportsToMethod("Select");
                        }}
                        icon={<BsCardList />}
                        label="Set to select"
                      />
                    </Row>
                  </Col>
                </Row>
              );
            }
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
