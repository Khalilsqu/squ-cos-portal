import { Modal, Form, Button, Input, notification } from "antd";

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
                setPositionAddModalOpen(false);

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
          Submit
        </Button>,
      ]}
    >
      <Form
        form={formAddPosition}
        onFinish={(values) => {
          positionList.push(values.position);
          setPositionAddModalOpen(false);
        }}
      >
        <Form.Item
          name="position"
          label="Position"
          rules={[
            {
              required: true,
              message: "Please enter a position",
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
      title="Delete a Position"
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
          onClick={() => {
            formDeletePosition.validateFields().then(async (values) => {
              const response = await fetch(
                "/api/dashboard/staffDirectory/positionsAvailable",
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    position: values.position,
                  }),
                }
              );

              if (response.ok) {
                setPositionDeleteModalOpen(false);

                setPositionList(
                  positionList.filter((position) => position !== values.position)
                );
                notification.success({
                  message: "Position Deleted",
                  description: "Position has been deleted successfully",
                });
                formDeletePosition.resetFields();
              } else {
                notification.error({
                  message: "Position Not Deleted",
                  description: "Position has not been deleted",
                });
              }
            });
          }}
        >
          Submit
        </Button>,
      ]}
    >
      <Form
        form={formDeletePosition}
        onFinish={(values) => {
          positionList.push(values.position);
          setPositionDeleteModalOpen(false);
        }}
      >
        <Form.Item
          name="position"
          label="Position"
          rules={[
            {
              required: true,
              message: "Please enter a position",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
