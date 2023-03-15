import {
  Modal,
  Button,
  notification,
  Form,
  Input,
  Select,
  Drawer,
  Row,
  Col,
  message,
} from "antd";
import { useWindowSize } from "@/components/utils/windowSize";

import { MailOutlined } from "@ant-design/icons";

import { columnWidth } from "@/pages/admin-dashboard/staff-directory";

export const AddDepartmentModal = ({
  departmentAddModalOpen,
  setDepartmentAddModalOpen,
  formAddDepartment,
  departmentList,
  setDepartmentList,
}) => {
  return (
    <Modal
      title="Add a new department"
      open={departmentAddModalOpen}
      onCancel={() => setDepartmentAddModalOpen(false)}
      footer={[
        <Button
          key="back"
          onClick={() => {
            formAddDepartment.resetFields();
            setDepartmentAddModalOpen(false);
          }}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            formAddDepartment
              .validateFields()
              .then((values) => {
                const newDepartmentList = [...departmentList];
                newDepartmentList.push(values.department);
                setDepartmentList(newDepartmentList);
                notification.success({
                  message: "Department Added",
                  description: "Department has been added successfully",
                });
                setDepartmentAddModalOpen(false);
                formAddDepartment.resetFields();
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
        >
          Add
        </Button>,
      ]}
    >
      <Form
        form={formAddDepartment}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: "public",
        }}
      >
        <Form.Item
          name="department"
          label="Department"
          rules={[
            {
              required: true,
              message: "Please input the department name!",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const DeleteDepartmentModal = ({
  departmentDeleteModalOpen,
  setDepartmentDeleteModalOpen,
  formDeleteDepartment,
  departmentList,
  setDepartmentList,
}) => {
  return (
    <Modal
      title="Delete a department"
      open={departmentDeleteModalOpen}
      onCancel={() => setDepartmentDeleteModalOpen(false)}
      footer={[
        <Button
          key="back"
          onClick={() => {
            formDeleteDepartment.resetFields();
            setDepartmentDeleteModalOpen(false);
          }}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            formDeleteDepartment
              .validateFields()
              .then((values) => {
                const newDepartmentList = [...departmentList];
                const index = newDepartmentList.indexOf(values.department);
                if (index > -1) {
                  newDepartmentList.splice(index, 1);
                }
                setDepartmentList(newDepartmentList);
                notification.success({
                  message: "Department Deleted",
                  description: "Department has been deleted successfully",
                });
                setDepartmentDeleteModalOpen(false);
                formDeleteDepartment.resetFields();
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
        >
          Delete
        </Button>,
      ]}
    >
      <Form
        form={formDeleteDepartment}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: "public",
        }}
      >
        <Form.Item
          name="department"
          label="Department"
          rules={[
            {
              required: true,
              message: "Please input the department name!",
            },
          ]}
        >
          <Select>
            {departmentList.map((department) => {
              return (
                <Select.Option key={department} value={department}>
                  {department}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

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
                console.log(newColumns);
                // check if the column already exists
                const columnExists = newColumns.find(
                  (column) =>
                    column.title.toLowerCase() === values.title.toLowerCase()
                );
                if (columnExists) {
                  message.error(
                    "Column already exists. Please use a different name"
                  );
                  return;
                }

                newColumns.splice(newColumns.length - 1, 0, {
                  title: values.title,
                  dataIndex: values.title,
                  editable: true,
                  width: columnWidth,
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
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const AddStaffDrawer = ({
  drawerOpen,
  setDrawerOpen,
  formAdd,
  handleAddFormFinish,
  setFormErrorMessages,
  departmentList,
  targetKeys,
  columns,
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
        width > 768 ? "50%" : width > 576 ? "70%" : width > 320 ? "90%" : "100%"
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
                  {departmentList.map((department) => {
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
                <Input />
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
                  {targetKeys.map((targetKey) => {
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
