import { Modal, Form, Button, Input } from "antd";

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
            formAddPosition.validateFields().then((values) => {
              setPositionList([...positionList, values.position]);
              formAddPosition.resetFields();
              setPositionAddModalOpen(false);
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
