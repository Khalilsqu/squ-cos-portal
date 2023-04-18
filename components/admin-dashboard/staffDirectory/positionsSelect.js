import {
  List,
  Space,
  Typography,
  Checkbox,
  message,
  Skeleton,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
} from "antd";
import { useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import CustomTooltip from "@/components/tooltip/customtooltip";

export default function PositionsList({
  positionsList,
  positionsListError,
  positionsListLoading,
  setPositionsList,
}) {
  const [messageApi, contextHolder] = message.useMessage();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formEditPosition] = Form.useForm();
  const [formAddPosition] = Form.useForm();
  return (
    <div>
      {contextHolder}
      <Skeleton loading={positionsListLoading} active>
        <List
          size="small"
          bordered
          header={
            <div className="flex flex-row justify-between">
              <Typography.Text strong>Position Name</Typography.Text>
              <Typography.Text strong>Actions</Typography.Text>
            </div>
          }
          footer={
            <Button
              type="text"
              icon={<PlusCircleOutlined />}
              onClick={() => {
                setModalOpen(true);
              }}
            >
              Add a Position
            </Button>
          }
          dataSource={positionsList}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Space key={item.key}>
                  <CustomTooltip title="Edit">
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditModalOpen(true);
                        formEditPosition.setFieldsValue({
                          key: item.key,
                          positionName: item.positionName,
                          description: item.description,
                        });
                      }}
                    />
                  </CustomTooltip>

                  <Popconfirm
                    title={`Are you sure to delete ${item.positionName}?`}
                    okText="Yes"
                    cancelText="No"
                    onConfirm={async () => {
                      const responseDelete = await fetch(
                        "/api/dashboard/staffDirectory/positions",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            changeType: "delete",
                            key: item.key,
                          }),
                        }
                      );

                      if (responseDelete.ok) {
                        setPositionsList(
                          positionsList.filter(
                            (position) => position.key !== item.key
                          ),
                          false
                        );
                        messageApi.open({
                          type: "success",
                          content: `${item.positionName} deleted`,
                        });
                      } else {
                        messageApi.open({
                          type: "error",
                          content: `${item.positionName} delete failed`,
                        });
                      }
                    }}
                  >
                    <Button type="text" icon={<DeleteOutlined />} danger />
                  </Popconfirm>
                </Space>,
              ]}
            >
              <List.Item.Meta
                title={item.positionName}
                description={item.description}
                avatar={
                  <Checkbox
                    defaultChecked={item.selected}
                    onChange={async (e) => {
                      const response = await fetch(
                        "/api/dashboard/staffDirectory/positions",
                        {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            changeType: "selected",
                            key: item.key,
                            selected: e.target.checked,
                          }),
                        }
                      );

                      if (response.ok) {
                        setPositionsList(
                          positionsList.map((position) => {
                            if (position.positionName === item.positionName) {
                              return {
                                ...position,
                                selected: e.target.checked,
                              };
                            } else {
                              return position;
                            }
                          }),
                          false
                        );
                        if (e.target.checked) {
                          messageApi.open({
                            type: "success",
                            content: `${item.positionName} is now available`,
                          });
                        } else {
                          messageApi.open({
                            type: "warning",
                            content: `${item.positionName} is now unavailable`,
                          });
                        }
                      } else {
                        messageApi.open({
                          type: "error",
                          content: `${item.positionName} update failed`,
                        });
                      }
                    }}
                  />
                }
              />
            </List.Item>
          )}
        />
      </Skeleton>
      <AddPositionModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        formAddPosition={formAddPosition}
        positionsList={positionsList}
        setPositionsList={setPositionsList}
        positionsListLoading={positionsListLoading}
      />
      <EditPositionModal
        editModalOpen={editModalOpen}
        setEditModalOpen={setEditModalOpen}
        formEditPosition={formEditPosition}
        positionsList={positionsList}
        setPositionsList={setPositionsList}
        positionsListLoading={positionsListLoading}
      />
    </div>
  );
}

export const AddPositionModal = ({
  modalOpen,
  setModalOpen,
  formAddPosition,
  positionsList,
  setPositionsList,
  positionsListLoading,
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <div>
      <Modal
        title="Add a Position"
        open={modalOpen}
        closable={false}
        maskClosable={false}
        onCancel={() => {
          setModalOpen(false);
          formAddPosition.resetFields();
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setModalOpen(false);
              formAddPosition.resetFields();
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={positionsListLoading}
            onClick={async () => {
              const response = await fetch(
                "/api/dashboard/staffDirectory/positions",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    changeType: "add",
                    positionName: formAddPosition.getFieldValue("positionName"),
                    description: formAddPosition.getFieldValue("description"),
                  }),
                }
              );

              if (response.ok) {
                const body = await response.json();
                setPositionsList(
                  positionsList.concat({
                    key: body.key,
                    positionName: formAddPosition.getFieldValue("positionName"),
                    description: formAddPosition.getFieldValue("description"),
                    selected: false,
                  }),
                  true
                );
                setModalOpen(false);
                formAddPosition.resetFields();
                messageApi.open({
                  type: "success",
                  content: "Position added",
                });
              } else {
                messageApi.open({
                  type: "error",
                  content: "Position add failed",
                });
              }
            }}
          >
            Add
          </Button>,
        ]}
      >
        <Form
          form={formAddPosition}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}
        >
          <Form.Item
            name="positionName"
            label="Position Name"
            rules={[
              {
                required: true,
                message: "Please input the position name!",
                max: 200,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                max: 500,
              },
            ]}
          >
            <Input type="textarea" />
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </div>
  );
};

export const EditPositionModal = ({
  editModalOpen,
  setEditModalOpen,
  formEditPosition,
  positionsList,
  setPositionsList,
  positionsListLoading,
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <div>
      <Modal
        title="Edit Position"
        open={editModalOpen}
        closable={false}
        maskClosable={false}
        onCancel={() => {
          setEditModalOpen(false);
          formEditPosition.resetFields();
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setEditModalOpen(false);
              formEditPosition.resetFields();
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={positionsListLoading}
            onClick={async () => {
              const response = await fetch(
                "/api/dashboard/staffDirectory/positions",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    changeType: "edit",
                    key: formEditPosition.getFieldValue("key"),
                    positionName:
                      formEditPosition.getFieldValue("positionName"),
                    description: formEditPosition.getFieldValue("description"),
                  }),
                }
              );

              if (response.ok) {
                setPositionsList(
                  positionsList.map((position) => {
                    if (
                      position.key === formEditPosition.getFieldValue("key")
                    ) {
                      return {
                        ...position,
                        positionName:
                          formEditPosition.getFieldValue("positionName"),
                        description:
                          formEditPosition.getFieldValue("description"),
                      };
                    } else {
                      return position;
                    }
                  }),
                  true
                );
                setEditModalOpen(false);
                formEditPosition.resetFields();
                messageApi.open({
                  type: "success",
                  content: "Position updated",
                });
              } else {
                messageApi.open({
                  type: "error",
                  content: "Position update failed",
                });
              }
            }}
          >
            Update
          </Button>,
        ]}
      >
        <Form
          form={formEditPosition}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}
        >
          <Form.Item
            name="positionName"
            label="Position Name"
            rules={[
              {
                required: true,
                message: "Please input the position name!",
                max: 200,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                max: 500,
              },
            ]}
          >
            <Input type="textarea" />
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </div>
  );
};
