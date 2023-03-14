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
} from "antd";
import { useWindowSize } from "@/components/utils/windowSize";

import { MailOutlined } from "@ant-design/icons";

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
                newColumns.splice(newColumns.length - 1, 0, {
                  title: values.title,
                  dataIndex: values.dataIndex,
                  key: values.dataIndex,
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
        <Form.Item
          name="dataIndex"
          label="Data Index"
          rules={[
            {
              required: true,
              message: "Please input the data index of the column!",
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter name" }]}
            >
              <Input placeholder="Please enter name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Please enter email",
                },
                {
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
            >
              <Input
                placeholder="Please enter email"
                prefix={<MailOutlined />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="department"
              label="Department"
              hasFeedback
              rules={[{ required: true, message: "Please enter department" }]}
            >
              <Select placeholder="Please select department" allowClear>
                {departmentList.sort().map((department) => {
                  return (
                    <Select.Option key={department} value={department}>
                      {department}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};
