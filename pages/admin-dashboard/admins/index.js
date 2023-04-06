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
  notification,
} from "antd";
import { DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { AiOutlineInsertRowBelow } from "react-icons/ai";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import CustomTooltip from "@/components/tooltip/customtooltip";

export default function Admins({ data }) {
  const [tableData, setTableData] = useState(data);
  const [modalAddRowOpen, setModalAddRowOpen] = useState(false);
  const [needToSave, setNeedToSave] = useState(false);

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
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
              setTableData((prev) => {
                const newData = [...prev];
                const index = newData.findIndex(
                  (item) => record.key === item.key
                );
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...changedValues });
                return newData;
              });

              setNeedToSave(true);
            }}
          >
            <Form.Item name="canEditNews" valuePropName="checked">
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>
          </Form>
        </Space>
      ),
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
              setTableData((prev) => {
                const newData = [...prev];
                const index = newData.findIndex(
                  (item) => record.key === item.key
                );
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...changedValues });
                return newData;
              });

              setNeedToSave(true);
            }}
          >
            <Form.Item name="canEditStaff" valuePropName="checked">
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>
          </Form>
        </Space>
      ),
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
              setTableData((prev) => {
                const newData = [...prev];
                const index = newData.findIndex(
                  (item) => record.key === item.key
                );
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...changedValues });
                return newData;
              });

              setNeedToSave(true);
            }}
          >
            <Form.Item name="canEditAdmins" valuePropName="checked">
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>
          </Form>
        </Space>
      ),
    },
    {
      title: (
        <Typography.Text className="flex justify-center items-center">
          Action
        </Typography.Text>
      ),
      dataIndex: "action",
      render: (text, record) => (
        <Space size="small" className="flex justify-center">
          <Button
            type="text"
            danger
            onClick={() => {
              setTableData((prev) => {
                const newData = [...prev];
                const index = newData.findIndex(
                  (item) => record.key === item.key
                );
                newData.splice(index, 1);
                return newData;
              });

              const response = fetch("/api/dashboard/admins", {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(record),
              });

              if (response.ok) {
                notification.success({
                  message: "Success",
                  description: "Admin deleted successfully",
                  duration: 3000,
                });
              } else {
                notification.error({
                  message: "Error",
                  description: "Admin could not be deleted",
                  duration: 3000,
                });
              }
            }}
            icon={<DeleteOutlined />}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={tableData}
        footer={() => {
          return (
            <Space
              direction="horizontal"
              size="large"
              className="flex justify-between"
            >
              <Space
                direction="horizontal"
                size="small"
                className="flex justify-start"
              >
                <CustomTooltip title="Save Changes to Database">
                  <Button
                    type="text"
                    onClick={async () => {
                      setNeedToSave(false);

                      const response = await fetch("/api/dashboard/admins", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(tableData),
                      });

                      if (response.ok) {
                        notification.success({
                          message: "Success",
                          description: "Admins updated successfully",
                          duration: 3000,
                        });
                      } else {
                        notification.error({
                          message: "Error",
                          description: "Error updating admins",
                          duration: 3000,
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
        <Form
          name="addAdmin"
          onFinish={(values) => {
            setTableData((prev) => {
              const newData = [...prev];
              newData.push({
                key: uuidv4(),
                email: values.email,
                canEditNews: false,
                canEditStaff: false,
                canEditAdmins: false,
              });
              return newData;
            });
            setModalAddRowOpen(false);
            setNeedToSave(true);
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
    let promise = databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID_USERS,
      process.env.APPWRITE_DATABASE_COLLECTION_ID_USERS
    );

    const result = await promise;

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

    return {
      props: {
        data: result.documents.map((element) => {
          return {
            key: element["$id"],
            email: element["email"],
            canEditNews: element["canEditNews"],
            canEditStaff: element["canEditStaff"],
            canEditAdmins: element["canEditAdmins"],
          };
        }),
      },
    };
  } catch (error) {
    return {
      redirect: { destination: "/" },
    };
  }
}
