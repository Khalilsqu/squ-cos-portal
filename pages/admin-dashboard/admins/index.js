import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import {
  Table,
  Form,
  Switch,
  Space,
  Button,
  Modal,
  Input,
  Typography,
  Popconfirm,
  notification,
} from "antd";
import { DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { AiOutlineInsertRowBelow } from "react-icons/ai";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/components/utils/useSwrFetcher";
import { v4 as uuidv4 } from "uuid";

import { useWindowSize } from "@/components/utils/windowSize";
import { collapsedState } from "@/components/layout/pageLayout";
import { isBreakPointState } from "@/components/layout/pageLayout";
import { columnWidth } from "@/components/admin-dashboard/staffDirectory/tableColumns";

import CustomTooltip from "@/components/tooltip/customtooltip";

export default function Admins() {
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [modalAddRowOpen, setModalAddRowOpen] = useState(false);
  const [needToSave, setNeedToSave] = useState(false);
  const [editingKeys, setEditingKeys] = useState([]);

  const { width } = useWindowSize();

  const isBreakPoint = isBreakPointState().isBreakPoint;
  const collapsed = collapsedState().collapsed;

  const widthCalc = isBreakPoint ? "20px" : collapsed ? "100px" : "220px";

  const {
    data: tableData,
    mutate,
    isLoading,
  } = useSWR("/api/dashboard/admins", fetcher, {
    refreshInterval: 0,
  });

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      fixed: "left",
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ["descend", "ascend"],
      width: columnWidth,
    },
    {
      title: (
        <Typography.Text className="flex justify-center items-center">
          Can Edit News
        </Typography.Text>
      ),
      dataIndex: "canEditNews",
      render: (text, record) => (
        <Space
          size="small"
          className="flex justify-center items-center align-middle"
        >
          <Form
            name="canEditNews"
            initialValues={{ canEditNews: record.canEditNews }}
            onValuesChange={(changedValues, allValues) => {
              const newData = () => {
                const data = [...tableData];
                const index = data.findIndex((item) => record.key === item.key);
                const item = data[index];
                data.splice(index, 1, { ...item, ...changedValues });
                return data;
              };

              mutate(newData, false);

              setNeedToSave(true);

              if (editingKeys.indexOf(record.key) === -1) {
                setEditingKeys([...editingKeys, record.key]);
              }
            }}
          >
            <Form.Item name="canEditNews" valuePropName="checked">
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>
          </Form>
        </Space>
      ),

      width: columnWidth,
    },
    {
      title: (
        <Typography.Text className="flex justify-center items-center">
          Can Edit Staff Data
        </Typography.Text>
      ),
      dataIndex: "canEditStaff",
      render: (text, record) => (
        <Space size="small" className="flex justify-center">
          <Form
            name="canEditStaff"
            initialValues={{ canEditStaff: record.canEditStaff }}
            onValuesChange={(changedValues, allValues) => {
              const newData = () => {
                const data = [...tableData];
                const index = data.findIndex((item) => record.key === item.key);
                const item = data[index];
                data.splice(index, 1, { ...item, ...changedValues });
                return data;
              };
              mutate(newData, false);
              setNeedToSave(true);

              if (editingKeys.indexOf(record.key) === -1) {
                setEditingKeys([...editingKeys, record.key]);
              }
            }}
          >
            <Form.Item name="canEditStaff" valuePropName="checked">
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>
          </Form>
        </Space>
      ),

      width: columnWidth,
    },
    {
      title: (
        <Typography.Text className="flex justify-center items-center">
          Can Edit Admins
        </Typography.Text>
      ),
      dataIndex: "canEditAdmins",
      render: (text, record) => (
        <Space size="small" className="flex justify-center">
          <Form
            name="canEditAdmins"
            initialValues={{ canEditAdmins: record.canEditAdmins }}
            onValuesChange={(changedValues, allValues) => {
              const newData = () => {
                const data = [...tableData];
                const index = data.findIndex((item) => record.key === item.key);
                const item = data[index];
                data.splice(index, 1, { ...item, ...changedValues });
                return data;
              };
              mutate(newData, false);

              setNeedToSave(true);

              if (editingKeys.indexOf(record.key) === -1) {
                setEditingKeys([...editingKeys, record.key]);
              }
            }}
          >
            <Form.Item name="canEditAdmins" valuePropName="checked">
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>
          </Form>
        </Space>
      ),

      width: columnWidth,
    },
    {
      title: (
        <Typography.Text className="flex justify-center items-center">
          Delete
        </Typography.Text>
      ),
      dataIndex: "delete",
      render: (text, record) => (
        <Space size="small" className="flex justify-center">
          {notificationContextHolder}
          <Popconfirm
            title="Sure to delete?"
            onConfirm={async () => {
              const newData = () => {
                const data = [...tableData];
                const index = data.findIndex((item) => record.key === item.key);
                data.splice(index, 1);
                return data;
              };
              mutate(newData, false);

              const response = await fetch("/api/dashboard/admins", {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(record),
              });

              if (response.ok) {
                notificationApi["success"]({
                  message: "Admin deleted successfully",
                  description: "Admin deleted successfully to the database",
                  duration: 3,
                  placement: "topRight",
                });
              } else {
                notificationApi["error"]({
                  message: "Admin could not be deleted",
                  description: "Admin could not be deleted from the database",
                  duration: 3,
                  placement: "topRight",
                });
              }
            }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),

      width: columnWidth,
    },
  ];

  return (
    <div className="my-4">
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={tableData}
        pagination={false}
        size="small"
        scroll={{ x: "max-content" }}
        tableLayout="auto"
        bordered
        style={{
          maxWidth: `calc(${width}px - ${widthCalc})`,
        }}
        footer={() => {
          return (
            <Space
              direction="horizontal"
              size="large"
              className="flex justify-between"
            >
              {notificationContextHolder}
              <Space
                direction="horizontal"
                size="small"
                className="flex justify-start"
              >
                <CustomTooltip title="Save Changes to Database">
                  <Button
                    type="text"
                    disabled={!needToSave}
                    onClick={async () => {
                      // find data having recod key
                      const data = tableData.filter((item) =>
                        editingKeys.includes(item.key)
                      );

                      const response = await fetch("/api/dashboard/admins", {
                        method: "PATCH",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                      });

                      if (response.ok) {
                        notificationApi["success"]({
                          message: "Admins updated successfully",
                          description:
                            "Admins updated successfully to the database",
                          duration: 3,
                          placement: "topRight",
                        });
                        setEditingKeys([]);
                        setNeedToSave(false);
                      } else {
                        notificationApi["error"]({
                          message: "Admins could not be updated",
                          description:
                            "Admins could not be updated to the database",
                          duration: 3,
                          placement: "topRight",
                        });
                      }
                    }}
                    icon={<SaveOutlined />}
                    danger={needToSave}
                  />
                </CustomTooltip>
                <CustomTooltip title="Add New Admin">
                  <Button
                    type="text"
                    onClick={() => {
                      setModalAddRowOpen(true);
                    }}
                    icon={<AiOutlineInsertRowBelow className="text-xl" />}
                  />
                </CustomTooltip>
              </Space>
              <Space
                direction="horizontal"
                size="small"
                className="flex justify-end"
              >
                <Typography.Text className="text-red-500 font-semibold">
                  {needToSave ? "You have unsaved changes" : ""}
                </Typography.Text>
              </Space>
            </Space>
          );
        }}
      />
      <Modal
        title="Add New Admin"
        open={modalAddRowOpen}
        onCancel={() => {
          setModalAddRowOpen(false);
        }}
        footer={null}
      >
        {notificationContextHolder}
        <Form
          name="addAdmin"
          onFinish={async (values) => {
            const newData = () => {
              const data = [...tableData];
              data.push({
                key: uuidv4(),
                email: values.email,
                canEditNews: false,
                canEditStaff: false,
                canEditAdmins: false,
              });
              return data;
            };

            mutate(newData, false);
            setModalAddRowOpen(false);
            const response = await fetch("/api/dashboard/admins", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: values.email,
                canEditNews: false,
                canEditStaff: false,
                canEditAdmins: false,
              }),
            });

            if (response.ok) {
              notificationApi["success"]({
                message: "Admin added successfully",
                description: "Admins updated successfully to the database",
                duration: 3,
                placement: "topRight",
              });
            } else {
              notificationApi["error"]({
                message: "Error adding admin",
                description: "Error updating admins to the database",
                duration: 3,
                placement: "topRight",
              });
            }
          }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
                validator: (_, value) => {
                  if (value.endsWith("squ.edu.om")) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Please input a valid squ.edu.om email address")
                  );
                },
              },
              {
                validator: (_, value) => {
                  if (tableData.map((row) => row.email).includes(value)) {
                    return Promise.reject(
                      new Error("Email already exists in database")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export async function getServerSideProps(context) {
  const appwriteSdk = await import("node-appwrite");
  const session = await getServerSession(context.req, context.res, authOptions);

  const adminEmails = new Array();

  const client = new appwriteSdk.Client();

  client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_DATABASE_API_KEY);

  const databases = new appwriteSdk.Databases(client);

  try {
    const result = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID_USERS,
      process.env.APPWRITE_DATABASE_COLLECTION_ID_USERS
    );

    result.documents.forEach((element) => {
      if (element["canEditAdmins"] == true) {
        adminEmails.push(element["email"]);
      }
    });

    if (!session | !adminEmails.includes(session?.user.email)) {
      return {
        redirect: { destination: "/" },
      };
    }
  } catch (error) {
    return {
      redirect: { destination: "/" },
    };
  }

  return {
    props: {
      data: [],
    },
  };
}
