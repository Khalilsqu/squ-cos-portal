import {
  Modal,
  Form,
  Input,
  Upload,
  Button,
  DatePicker,
  Typography,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const ModalData = (props) => {
  const { formAdd, isModalVisible, setIsModalVisible, handleAddFormFinish } =
    props;

  const handleOk = () => {
    // check if form is valid before submitting it and closing the modal
    formAdd.validateFields().then((values) => {
      formAdd.resetFields();
      setIsModalVisible(false);
      handleAddFormFinish(values);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    formAdd.resetFields();
  };

  return (
    <Modal
      title="Add a article to the News Feed"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      closable={false}
      okText="Add News"
    >
      <Form form={formAdd} layout="vertical" name="Add News">
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
          {/* <CustomTooltip title="Upload an image of the news. Accepts only png, jpg or jpeg formats"> */}
          <Upload.Dragger
            listType="picture"
            accept=".png,.jpg,.jpeg"
            multiple={false}
            maxCount={1}
          >
            <Button
              block
              icon={<UploadOutlined />}
              className="w-full flex justify-center items-center gap-x-3 bg-transparent border-0 shadow-none"
            ></Button>
            <Typography.Text type="secondary">
              Click or drag file to this area to upload
            </Typography.Text>
          </Upload.Dragger>
          {/* </CustomTooltip> */}
        </Form.Item>
        <Form.Item
          label="Expiry Date"
          name="expiryDate"
          rules={[{ required: true, message: "Please input expiry date!" }]}
          className="flex justify-left items-center"
        >
          <DatePicker inputReadOnly />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalData;
