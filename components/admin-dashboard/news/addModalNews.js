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
  const {
    formAdd,
    isModalVisible,
    setIsModalVisible,
    handleAddFormFinish,
    setUploadedUserImage,
  } = props;

  const handleOk = () => {
    // check if form is valid before submitting it and closing the modal
    formAdd
      .validateFields()
      .then((values) => {
        formAdd.resetFields();
        setIsModalVisible(false);
        handleAddFormFinish(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
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
          rules={[
            {
              required: true,
              message: "Please input title!",
              min: 3,
              max: 25,
            },
          ]}
        >
          <Input
            maxLength={25}
            placeholder="Write A Title"
            showCount
            minLength={3}
          />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: "Please input description!",
              min: 5,
              max: 200,
            },
          ]}
        >
          <Input.TextArea
            placeholder="Write a description of the news"
            showCount
            maxLength={200}
            minLength={5}
          />
        </Form.Item>
        <Form.Item
          label="Image"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList;
          }}
          rules={[
            { required: true, message: "Please upload an image" },
            {
              validator: (rule, fileList) => {
                const fileTypeArray = ["image/png", "image/jpg", "image/jpeg"];

                if (!fileList) {
                  return Promise.reject();
                } else if (fileList.length < 1) {
                  return Promise.reject();
                }

                return new Promise((resolve, reject) => {
                  if (fileList[0]?.size > 1024 * 1024 * 4.5) {
                    reject("File size is greater than 4.5MB!");
                  } else if (
                    fileTypeArray.includes(fileList[0]?.type) === false
                  ) {
                    reject(
                      "File type is not supported!. Supported types: png, jpg, jpeg"
                    );
                  } else {
                    const img = new Image();
                    img.src = URL.createObjectURL(fileList[0]?.originFileObj);
                    img.onload = () => {
                      const width = img.naturalWidth;
                      const height = img.naturalHeight;
                      URL.revokeObjectURL(img.src);
                      if (width / height < 3) {
                        reject(
                          "Image width must be greater than 3 times the height"
                        );
                      } else {
                        resolve("Success!");
                      }
                    };
                  }
                });
              },
            },
          ]}
        >
          <Upload.Dragger
            listType="picture"
            accept="image/png,image/jpg,image/jpeg"
            multiple={false}
            maxCount={1}
            beforeUpload={(file) => {
              const fileTypeArray = ["image/png", "image/jpg", "image/jpeg"];
              return new Promise((resolve, reject) => {
                if (file.size > 1024 * 1024 * 4.5) {
                  reject("Maximum file size allowed is 4.5MB!");
                } else if (fileTypeArray.includes(file.type) === false) {
                  // find dimensions of image

                  reject(
                    "File type is not supported!. Supported types: png, jpg, jpeg"
                  );
                } else {
                  const img = new Image();
                  img.src = URL.createObjectURL(file);
                  img.onload = () => {
                    const width = img.naturalWidth;
                    const height = img.naturalHeight;
                    URL.revokeObjectURL(img.src);
                    if (width / height < 3) {
                      reject(
                        "Image width must be greater than 3 times the height"
                      );
                    } else {
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onload = () => {
                        setUploadedUserImage(reader.result);
                      };
                      resolve("Success!");
                    }
                  };
                }
              });
            }}
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
