import {
  Drawer,
  Button,
  Form,
  Select,
  Input,
  Row,
  Col,
  Radio,
  Switch,
  DatePicker,
  InputNumber,
} from "antd";
import { useWindowSize } from "@/components/utils/windowSize";
import { useState } from "react";

import { MailOutlined } from "@ant-design/icons";
import { RxInput } from "react-icons/rx";
import { BsCardList } from "react-icons/bs";
import CustomTooltip from "@/components/tooltip/customtooltip";

import { FaMale, FaFemale } from "react-icons/fa";

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
  editingKey,
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
                  placeholder="Select department(s)"
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
                  {
                    validator: (_, value) => {
                      const staffRow = data.find(
                        (item) => item.Email === value
                      );
                      if (staffRow && staffRow.key !== editingKey) {
                        return Promise.reject(
                          new Error(
                            `This email is already assigned to ${staffRow.Name}`
                          )
                        );
                      }
                      return Promise.resolve();
                    },
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
                <Select
                  showSearch
                  mode="multiple"
                  showArrow
                  placeholder="Select position(s)"
                >
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
              <Row key={column.dataIndex} className="w-full" align="middle">
                <Col flex={7}>
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
                    {reportsToMethod === "Input" ? (
                      <Input placeholder="Enter a name" />
                    ) : (
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
                    )}
                  </Form.Item>
                </Col>
                <Col flex={1}>
                  <Row justify="end">
                    <CustomTooltip title="Change input method" placement="left">
                      <Button
                        className="justify-end border-0 bg-transparent text-lg rounded-full"
                        onClick={() => {
                          formAdd.resetFields(["Reports To"]);
                          setReportsToMethod(
                            reportsToMethod === "Input" ? "Select" : "Input"
                          );
                        }}
                        icon={
                          reportsToMethod === "Input" ? (
                            <RxInput />
                          ) : (
                            <BsCardList />
                          )
                        }
                      />
                    </CustomTooltip>
                  </Row>
                </Col>
              </Row>
            );
          }

          if (column.dataIndex === "Gender") {
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
                <Radio.Group>
                  <Radio value="Male">
                    <FaMale className="text-lg" />
                  </Radio>
                  <Radio value="Female">
                    <FaFemale className="text-lg" />
                  </Radio>
                </Radio.Group>
              </Form.Item>
            );
          }

          return (
            <Form.Item
              key={column.dataIndex}
              name={column.dataIndex}
              label={column.title}
              rules={
                column.required === true && [
                  {
                    required: true,
                    message: `Please input the ${column.title.toLowerCase()}!`,
                  },
                ]
              }
            >
              {column.columnType === "date" ? (
                <DatePicker
                  format="DD/MM/YYYY"
                  placeholder="Select a date"
                  style={{ width: "100%" }}
                />
              ) : column.columnType === "number" ? (
                <InputNumber
                  placeholder={"Enter " + column.title}
                  style={{ width: "100%" }}
                />
              ) : column.columnType === "boolean" ? (
                <Switch />
              ) : (
                <Input placeholder={"Enter " + column.title} />
              )}
            </Form.Item>
          );
        })}
      </Form>
    </Drawer>
  );
};
