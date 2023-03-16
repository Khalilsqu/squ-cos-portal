import { Modal, Form, Button, Input, notification, Select } from "antd";

export const AddNewPositionModal = ({
  positionAddModalOpen,
  setPositionAddModalOpen,
  positionList,
  setPositionList,
  formAddPosition,
}) => {
  return (
    <Modal
      title="Add a new Position"
      open={positionAddModalOpen}
      onCancel={() => {
        setPositionAddModalOpen(false);
        formAddPosition.resetFields();
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            setPositionAddModalOpen(false);
            formAddPosition.resetFields();
          }}
        >
          Return
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            formAddPosition.validateFields().then(async (values) => {
              setPositionAddModalOpen(false);
              const response = await fetch(
                "/api/dashboard/staffDirectory/positionsAvailable",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    position: values.position,
                  }),
                }
              );

              if (response.ok) {
                setPositionList([...positionList, values.position]);
                notification.success({
                  message: "Position Added",
                  description: "Position has been added successfully",
                });
                formAddPosition.resetFields();
              } else {
                notification.error({
                  message: "Position Not Added",
                  description: "Position has not been added",
                });
              }
            });
          }}
        >
          Add
        </Button>,
      ]}
    >
      <Form form={formAddPosition}>
        <Form.Item
          name="position"
          label="Position"
          rules={[
            {
              required: true,
              message: "Please enter a position",
            },
            {
              validator: async (_, value) => {
                if (
                  positionList
                    .map((position) => position.toLowerCase().trim())
                    .includes(value.toLowerCase().trim())
                ) {
                  return Promise.reject(new Error("Position already exists"));
                }
              },
            },
            {
              validator: async (_, value) => {
                if (value.trim() !== value) {
                  return Promise.reject(
                    new Error(
                      "Position cannot have leading or trailing whitespace"
                    )
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

export const DeletePositionModal = ({
  positionDeleteModalOpen,
  setPositionDeleteModalOpen,
  positionList,
  setPositionList,
  formDeletePosition,
}) => {
  return (
    <Modal
      title="Delete a single or multipe positions"
      open={positionDeleteModalOpen}
      onCancel={() => {
        setPositionDeleteModalOpen(false);
        formDeletePosition.resetFields();
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            setPositionDeleteModalOpen(false);
            formDeletePosition.resetFields();
          }}
        >
          Return
        </Button>,
        <Button
          key="submit"
          type="primary"
          danger
          onClick={() => {
            formDeletePosition.validateFields().then(async (values) => {
              setPositionDeleteModalOpen(false);
              const response = await fetch(
                "/api/dashboard/staffDirectory/positionsAvailable",
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    positions: values.positions,
                  }),
                }
              );

              if (response.ok) {
                setPositionList(
                  positionList.filter(
                    (position) => !values.positions.includes(position)
                  )
                );
                notification.success({
                  message: "Position(s) Deleted",
                  description: "Position(s) has/have been deleted successfully",
                });
                formDeletePosition.resetFields();
              } else {
                notification.error({
                  message: "Position(s) Not Deleted",
                  description: "Position(s) has/have not been deleted",
                });
              }
            });
          }}
        >
          Delete
        </Button>,
      ]}
    >
      <Form form={formDeletePosition}>
        <Form.Item
          name="positions"
          label="Positions"
          rules={[
            {
              required: true,
              message: "Please enter a position",
            },
          ]}
        >
          <Select
            placeholder="Select positions to delete"
            mode="multiple"
            allowClear
            showSearch
          >
            {positionList.map((position) => (
              <Select.Option key={position} value={position}>
                {position}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
