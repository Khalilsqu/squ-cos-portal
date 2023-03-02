import { Modal, Form, Input, Upload, Button, DatePicker } from "antd";

const ModalData = (props) => {
  const { formAdd, isModalVisible, setIsModalVisible, handleAddFormFinish } =
    props;

  const handleOk = () => {
    setIsModalVisible(false);
    formAdd.submit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    formAdd.resetFields();
  };

  return (
    <Modal
      title="Add a News to the News Feed"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      closable={false}
      okText="Add News"
    >
      <Form
        onFinish={handleAddFormFinish}
        form={formAdd}
        layout="vertical"
        name="Add News"
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input title!" }]}
        >
          <Input maxLength={25} placeholder="Write A Title" showCount />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input description!" }]}
        >
          <Input.TextArea
            placeholder="Write a description of the news"
            showCount
            maxLength={120}
          />
        </Form.Item>
        <Form.Item
          label="Image"
          name="image"
          rules={[{ required: true, message: "Please input image!" }]}
        >
          <Upload>
            <Button>Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          label="Expiry Date"
          name="expiryDate"
          rules={[{ required: true, message: "Please input expiry date!" }]}
        >
          <DatePicker />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalData;
