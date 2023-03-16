import {
  Modal,
  Button,
  notification,
  Form,
  Input,
  Select,
  message,
} from "antd";

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
              .then(async (values) => {
                setDepartmentAddModalOpen(false);
                const response = await fetch(
                  "/api/dashboard/staffDirectory/departments",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ department: values.department }),
                  }
                );
                if (response.ok) {
                  setDepartmentList(
                    [...departmentList, values.department],
                    false
                  );
                  formAddDepartment.resetFields();
                  notification.success({
                    message: "Department Added",
                    description: "Department has been added successfully",
                  });
                } else {
                  notification.error({
                    message: "Department Not Added",
                    description: "Department was not added",
                  });
                }
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
            {
              validator: async (rule, value) => {
                if (
                  departmentList
                    .map((department) => department.toLowerCase().trim())
                    .includes(value.toLowerCase().trim())
                ) {
                  throw new Error("Department already exists");
                }
              },
            },
            {
              validator: async (rule, value) => {
                if (value.trim() !== value) {
                  throw new Error(
                    "Department cannot start or end with whitespace"
                  );
                }
              },
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
          danger
          onClick={() => {
            formDeleteDepartment
              .validateFields()
              .then(async (values) => {
                setDepartmentDeleteModalOpen(false);
                const response = await fetch(
                  "/api/dashboard/staffDirectory/departments",
                  {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ department: values.department }),
                  }
                );
                if (response.ok) {
                  setDepartmentList(
                    departmentList.filter(
                      (department) => department !== values.department
                    ),
                    false
                  );
                  formDeleteDepartment.resetFields();
                  notification.success({
                    message: "Department Deleted",
                    description: "Department has been deleted successfully",
                  });
                }
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
