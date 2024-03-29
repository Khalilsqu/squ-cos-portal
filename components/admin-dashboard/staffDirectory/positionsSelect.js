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
  Select,
  Dropdown,
} from "antd";
import { useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  LeftOutlined,
  RightOutlined,
  DownOutlined,
} from "@ant-design/icons";

import { AiOutlineQuestionCircle } from "react-icons/ai";
import CustomTooltip from "@/components/tooltip/customtooltip";

export default function PositionsList({
  positionsList,
  positionsListError,
  positionsListLoading,
  setPositionsList,
}) {
  // sort positionsList by positionName case insensitive
  positionsList?.data.sort((a, b) => {
    if (a.positionName.toLowerCase() < b.positionName.toLowerCase()) {
      return -1;
    }
    if (a.positionName.toLowerCase() > b.positionName.toLowerCase()) {
      return 1;
    }
    return 0;
  });

  // sort positionsList.categoryList by category case insensitive
  positionsList?.categoryList.sort((a, b) => {
    if (a.toLowerCase() < b.toLowerCase()) {
      return -1;
    }
    if (a.toLowerCase() > b.toLowerCase()) {
      return 1;
    }
    return 0;
  });

  const [listPage, setListPage] = useState(1);
  const [listSize, setListSize] = useState(5);

  const [messageApi, contextHolder] = message.useMessage();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [deleteCategoryModalOpen, setDeleteCategoryModalOpen] = useState(false);
  const [formEditPosition] = Form.useForm();
  const [formAddPosition] = Form.useForm();
  const [formAddCategory] = Form.useForm();
  const [formDeleteCategory] = Form.useForm();

  const items = [
    {
      key: "1",
      label: "Add a Category",
      icon: <PlusCircleOutlined />,
      onClick: () => {
        setCategoryModalOpen(true);
      },
    },
    {
      key: "2",
      label: "Delete a Category",
      icon: <DeleteOutlined />,
      onClick: () => {
        setCategoryModalOpen(true);
      },
      danger: true,
    },
  ];
  return (
    <div>
      {contextHolder}
      <Skeleton loading={positionsListLoading} active>
        <List
          // className="max-h-80 overflow-y-scroll border-2 rounded-md px-2"
          pagination={{
            pageSize: listSize,
            current: listPage,
            onChange: (page, pageSize) => {
              setListPage(page);
              setListSize(pageSize);
            },
            showOnSinglePage: false,
            pageSizeOptions: [5, 10, 15],
            total: positionsList?.data.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showLessItems: true,
            response: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} positions`,
            size: "small",
            itemRender: (current, type, originalElement) => {
              if (type === "prev") {
                return (
                  <a>
                    <LeftOutlined />
                  </a>
                );
              }
              if (type === "next") {
                return (
                  <a>
                    <RightOutlined />
                  </a>
                );
              }
              return originalElement;
            },
            showTitle: true,
            hideOnSinglePage: true,
          }}
          size="small"
          bordered
          header={
            <div className="flex flex-row justify-between">
              <div className="flex flex-row text-center">
                <CustomTooltip
                  title="Tick to make the position avilable for selection"
                  placement="top"
                >
                  <Button
                    type="text"
                    icon={<AiOutlineQuestionCircle />}
                    className="flex rounded-full align-middle justify-center items-center"
                  />
                </CustomTooltip>
                <Typography.Text strong>Position Name</Typography.Text>
              </div>

              <Typography.Text strong>Actions</Typography.Text>
            </div>
          }
          footer={
            <Space className="flex flex-row justify-end">
              <Button
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  setModalOpen(true);
                }}
              >
                Add a Position
              </Button>
              <Dropdown
                menu={{
                  items,
                }}
              >
                <Button>
                  <Space>
                    Categories
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
            </Space>
          }
          dataSource={positionsList?.data}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Space key={item.key}>
                  <CustomTooltip title="Edit">
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => {
                        console.log(item.category);
                        setEditModalOpen(true);
                        formEditPosition.setFieldsValue({
                          key: item.key,
                          positionName: item.positionName,
                          category: item.category,
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
                          {
                            data: positionsList.data.filter(
                              (position) => position.key !== item.key
                            ),
                            categoryList: positionsList.categoryList,
                          },
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
                description={item.category}
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
                        const newData = positionsList.data.map((position) => {
                          if (position.positionName === item.positionName) {
                            return {
                              ...position,
                              selected: e.target.checked,
                            };
                          } else {
                            return position;
                          }
                        });

                        const newCategoryList = positionsList.categoryList;

                        // combine data and categoryList

                        setPositionsList(
                          {
                            data: newData,
                            categoryList: newCategoryList,
                          },
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
      <EditCategoriesModal
        categoryModalOpen={categoryModalOpen}
        setCategoryModalOpen={setCategoryModalOpen}
        formAddCategory={formAddCategory}
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
                    category: formAddPosition.getFieldValue("category"),
                  }),
                }
              );

              if (response.ok) {
                const body = await response.json();
                setPositionsList(
                  {
                    data: positionsList.data.concat({
                      key: body.key,
                      positionName:
                        formAddPosition.getFieldValue("positionName"),
                      category: formAddPosition.getFieldValue("category"),
                      selected: false,
                    }),
                    categoryList: positionsList.categoryList,
                  },
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
              {
                validator: async (rule, value) => {
                  if (
                    positionsList.data.some(
                      (position) => position.positionName === value
                    )
                  ) {
                    throw new Error("Position already exists");
                  }
                },
              },
            ]}
          >
            <Input placeholder="Type position name" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[
              {
                required: true,
                message: "Please input the category!",
              },
            ]}
          >
            <Select placeholder="Select a category">
              {positionsList?.categoryList.map((category) => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
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
                    category: formEditPosition.getFieldValue("category"),
                  }),
                }
              );

              if (response.ok) {
                setPositionsList(
                  {
                    data: positionsList.data.map((position) => {
                      if (
                        position.key === formEditPosition.getFieldValue("key")
                      ) {
                        return {
                          ...position,
                          positionName:
                            formEditPosition.getFieldValue("positionName"),
                          category: formEditPosition.getFieldValue("category"),
                        };
                      } else {
                        return position;
                      }
                    }),
                    categoryList: positionsList.categoryList,
                  },
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
              {
                validator: async (rule, value) => {
                  if (
                    positionsList.data.some(
                      (position) =>
                        position.positionName === value &&
                        position.key !== formEditPosition.getFieldValue("key")
                    )
                  ) {
                    throw new Error("Position already exists");
                  }
                },
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[
              {
                required: true,
                message: "Please select the category!",
              },
            ]}
          >
            <Select placeholder="Select a category">
              {positionsList?.categoryList.map((category) => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </div>
  );
};

export const EditCategoriesModal = ({
  categoryModalOpen,
  setCategoryModalOpen,
  formAddCategory,
  positionsList,
  setPositionsList,
  positionsListLoading,
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <div>
      <Modal
        title="Categories"
        open={categoryModalOpen}
        closable={false}
        maskClosable={false}
        onCancel={() => {
          setCategoryModalOpen(false);
          formAddCategory.resetFields();
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setCategoryModalOpen(false);
              formAddCategory.resetFields();
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={positionsListLoading}
            onClick={async () => {
              console.log(formAddCategory.getFieldValue("categoryAdd"));
              const response = await fetch(
                "/api/dashboard/staffDirectory/positions",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    changeType: "categoryAdd",
                    categoryList: positionsList.categoryList.concat(
                      formAddCategory.getFieldValue("categoryAdd")
                    ),
                  }),
                }
              );

              const responseMessage = await response.json();

              if (response.ok) {
                setPositionsList(
                  {
                    data: positionsList.data,
                    categoryList: positionsList.categoryList.concat(
                      formAddCategory.getFieldValue("categoryAdd")
                    ),
                  },
                  true
                );
                setCategoryModalOpen(false);
                formAddCategory.resetFields();
                messageApi.open({
                  type: "success",
                  content: "Categories updated",
                });
              } else {
                messageApi.open({
                  type: "error",
                  content: `Categories update failed - ${responseMessage.error}`,
                });
              }
            }}
          >
            Confirm
          </Button>,
        ]}
      >
        <Form
          form={formAddCategory}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}
        >
          <Form.Item
            name="categoryAdd"
            label="Add a Category"
            rules={[
              {
                required: true,
                message: "Please input the categories!",
              },
              {
                validator: async (rule, value) => {
                  if (
                    positionsList.categoryList.some(
                      (category) => category === value
                    )
                  ) {
                    throw new Error(value + " already exists");
                  }
                },
              },
              {
                // prevent trailing or leading spaces
                validator: async (_, value) =>
                  value.trim() === value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("No leading or trailing spaces are allowed")
                      ),
              },
            ]}
          >
            <Input placeholder="Type the new category name" />
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </div>
  );
};
