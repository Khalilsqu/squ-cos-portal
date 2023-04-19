import {
  Button,
  Divider,
  Space,
  Tag,
  Modal,
  Form,
  Select,
  notification,
  Input,
  Skeleton,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import CustomTooltip from "@/components/tooltip/customtooltip";
import { colorThemeState } from "@/components/layout/pageLayout";

export default function DepartmentsList({
  departmentList,
  setDepartmentList,
  departmentListLoading,
  departmentListError,
}) {
  // sort the departmentList by departmentName
  departmentList?.sort((a, b) => {
    if (a.departmentName < b.departmentName) {
      return -1;
    }
    if (a.departmentName > b.departmentName) {
      return 1;
    }
    return 0;
  });
  const [departmentAddModalOpen, setDepartmentAddModalOpen] = useState(false);
  const [departmentDeleteModalOpen, setDepartmentDeleteModalOpen] =
    useState(false);

  const colorTheme = colorThemeState().colorTheme;

  const [notificationApi, contextHolder] = notification.useNotification();

  return (
    <Space wrap className="mb-4">
      {contextHolder}
      <Skeleton loading={departmentListLoading} active>
        {departmentList?.map((department) => (
          <Tag
            color={colorTheme === "dark" ? "geekblue" : "blue"}
            key={department.key}
          >
            {department.departmentName}
          </Tag>
        ))}
        <Divider type="vertical" className="h-8 shadow-2xl border-2" />
        <CustomTooltip title="Add Department">
          <Button
            type="text"
            onClick={() => {
              setDepartmentAddModalOpen(true);
            }}
            icon={<PlusOutlined />}
          />
        </CustomTooltip>
        <CustomTooltip title="Delete Department">
          <Button
            type="text"
            onClick={() => {
              setDepartmentDeleteModalOpen(true);
            }}
            icon={<DeleteOutlined className="text-red-500" />}
          />
        </CustomTooltip>
        <AddDepartmentModal
          departmentAddModalOpen={departmentAddModalOpen}
          setDepartmentAddModalOpen={setDepartmentAddModalOpen}
          departmentList={departmentList}
          setDepartmentList={setDepartmentList}
          notificationApi={notificationApi}
        />
        <DeleteDepartmentModal
          departmentDeleteModalOpen={departmentDeleteModalOpen}
          setDepartmentDeleteModalOpen={setDepartmentDeleteModalOpen}
          departmentList={departmentList}
          setDepartmentList={setDepartmentList}
          notificationApi={notificationApi}
        />
      </Skeleton>
    </Space>
  );
}

const AddDepartmentModal = ({
  departmentAddModalOpen,
  setDepartmentAddModalOpen,
  departmentList,
  setDepartmentList,
  notificationApi,
}) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const res = await fetch("/api/dashboard/staffDirectory/departments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const data = await res.json();

    if (data.error) {
      notificationApi["error"]({
        message: "Error",
        description: data.error,
        duration: 3,
        placement: "topRight",
      });
    } else {
      notificationApi["success"]({
        message: "Success",
        description: "Department added successfully",
        duration: 3,
        placement: "topRight",
      });
      setDepartmentList([
        ...departmentList,
        {
          key: data,
          departmentName: data.$id,
        },
      ]);
      setDepartmentAddModalOpen(false);
    }
  };
  const onFinishFailed = (errorInfo) => {
    notificationApi["error"]({
      message: "Error",
      description: `Something went wrong, ${errorInfo}.`,
      duration: 3,
      placement: "topRight",
    });
  };
  return (
    <Modal
      title="Add Department"
      open={departmentAddModalOpen}
      onCancel={() => setDepartmentAddModalOpen(false)}
      footer={null}
    >
      <Form
        form={form}
        name="addDepartment"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="departmentName"
          label="Department Name"
          rules={[
            {
              required: true,
              message: "Please input the department name!",
            },
            {
              // prevernt duplicate department name
              validator: async (_, value) =>
                departmentList?.find(
                  (department) => department.departmentName === value
                )
                  ? Promise.reject(new Error("Department already exists"))
                  : Promise.resolve(),
            },
            {
              // prevent trailing or leading spaces
              validator: async (_, value) =>
                value.trim() === value
                  ? Promise.resolve()
                  : Promise.reject(new Error("No leading or trailing spaces")),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const DeleteDepartmentModal = ({
  departmentDeleteModalOpen,
  setDepartmentDeleteModalOpen,
  departmentList,
  setDepartmentList,
  notificationApi,
}) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log(values);
    const res = await fetch("/api/dashboard/staffDirectory/departments", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values.department),
    });

    if (!res.ok) {
      notificationApi["error"]({
        message: "Error",
        description: "Something went wrong, please try again later",
        duration: 3,
        placement: "topRight",
      });
    } else {
      notificationApi["success"]({
        message: "Success",
        description: "Department deleted successfully",
        duration: 3,
        placement: "topRight",
      });
      setDepartmentList(
        departmentList.filter(
          (department) => department.key !== values.department
        )
      );
      setDepartmentDeleteModalOpen(false);
    }
  };
  const onFinishFailed = (errorInfo) => {
    notificationApi["error"]({
      message: "Error",
      description: `Something went wrong, ${errorInfo}.`,
    });
  };
  return (
    <div>
      <Modal
        title="Delete Department"
        open={departmentDeleteModalOpen}
        onCancel={() => setDepartmentDeleteModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          name="deleteDepartment"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
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
              {departmentList?.map((department) => (
                <Select.Option value={department.key} key={department.key}>
                  {department.departmentName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Delete
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
