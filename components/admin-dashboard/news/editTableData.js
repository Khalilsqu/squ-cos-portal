import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  UploadOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import {
  Form,
  Input,
  Popconfirm,
  Button,
  DatePicker,
  Image as AntImage,
  Space,
  Typography,
  Upload,
} from "antd";
import dayjs from "dayjs";
import moment from "moment/moment";

export function columnsData({
  handleDelete,
  editingRowKey,
  setEditingRowKey,
  formEdit,
  handleEditFormFinish,
  setUploadedUserImage,
}) {
  // const currentTime = dayjs().format("YYYY-MMM-DD h:mm:ss A");
  return [
    {
      key: uuidv4(),
      title: "Title",
      dataIndex: "title",
      render: (text, record) => {
        if (record.key === editingRowKey) {
          return (
            <Form form={formEdit} onFinish={handleEditFormFinish}>
              <Form.Item
                name="title"
                initialValue={record.title}
                rules={[
                  {
                    required: true,
                    message: "Please input title of minimum 3 characters!",
                    min: 3,
                    max: 25,
                  },
                ]}
              >
                <Input maxLength={25} minLength={3} showCount />
              </Form.Item>
            </Form>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: uuidv4(),
      render: (text, record) => {
        if (record.key === editingRowKey) {
          return (
            <Form form={formEdit} onFinish={handleEditFormFinish}>
              <Form.Item
                name="description"
                initialValue={record.description}
                rules={[
                  {
                    required: true,
                    message:
                      "Please input description of minimum 5 characters!",
                    min: 5,
                    max: 200,
                  },
                ]}
              >
                <Input.TextArea showCount maxLength={200} minLength={5} />
              </Form.Item>
            </Form>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Date Posted",
      key: uuidv4(),
      dataIndex: "datePosted",
    },
    {
      title: "Image",
      key: uuidv4(),
      dataIndex: "image",
      render: (text, record) => {
        if (record.key === editingRowKey) {
          if (record.image.url !== undefined) {
            const fileList = [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: record.image.url,
                thumbUrl: record.image.url,
                type: "image/png",
                width: record.image.width,
                height: record.image.height,
              },
            ];
            formEdit.setFieldsValue({
              image: fileList,
            });
          }
          return (
            <Form form={formEdit} onFinish={handleEditFormFinish}>
              <Form.Item
                name="image"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e && e.fileList;
                }}
                initialValue={record.image}
                rules={[
                  { required: true, message: "Please upload an image" },
                  {
                    validator: (rule, fileList) => {
                      const fileTypeArray = [
                        "image/png",
                        "image/jpg",
                        "image/jpeg",
                      ];

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
                          if (fileList[0]?.originFileObj) {
                            const img = new Image();
                            img.src = URL.createObjectURL(
                              fileList[0]?.originFileObj
                            );
                            img.onload = () => {
                              const width = img.naturalWidth;
                              const height = img.naturalHeight;
                              URL.revokeObjectURL(img.src);
                              if (width / height < 2.5) {
                                reject(
                                  "Image width must be greater than 2.5 times the height"
                                );
                              } else {
                                resolve("Success!");
                              }
                            };
                          } else {
                            if (fileList[0]?.width / fileList[0]?.height < 2.5) {
                              reject(
                                "Image width must be greater than 2.5 times the height"
                              );
                            } else {
                              resolve("Success!");
                            }
                          }
                        }
                      });
                    },
                  },
                ]}
              >
                <Upload
                  listType="picture"
                  maxCount={1}
                  accept="
                  image/png,
                  image/jpeg,
                  image/jpg,
                "
                  beforeUpload={(file) => {
                    const fileTypeArray = [
                      "image/png",
                      "image/jpg",
                      "image/jpeg",
                    ];
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
                          console.log(width, height);
                          if (width / height < 2.5) {
                            reject(
                              "Image width must be greater than 2.5 times the height"
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
                  onChange={(info) => {
                    if (info.file.status === "done") {
                      const reader = new FileReader();
                      reader.readAsDataURL(info.fileList[0].originFileObj);
                      reader.onload = (e) => {
                        setUploadedUserImage(e.target.result);
                      };
                    }
                  }}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Form>
          );
        } else {
          if (text.url !== undefined) {
            return (
              <AntImage
                width={70}
                src={text.url}
                alt="Image News"
                preview={false}
              />
            );
          } else {
            return (
              <AntImage
                width={70}
                src={text[0].thumbUrl}
                alt={text[0].name}
                preview={false}
              />
            );
          }
        }
      },
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: uuidv4(),
      render: (text, record) => {
        const date = moment(record.expiryDate, "ddd, MMM Do YYYY");
        if (record.key === editingRowKey) {
          return (
            <Form form={formEdit} onFinish={handleEditFormFinish}>
              <Form.Item
                name="expiryDate"
                getValueFromEvent={(e) =>
                  e
                    ? e.format("YYYY-MM-DD")
                    : moment(record.expiryDate, "ddd, MMM Do YYYY")
                }
                getValueProps={(i) => ({
                  value: dayjs(
                    moment(i, "ddd, MMM Do YYYY").format("YYYY-MM-DD")
                  ),
                })}
                initialValue={date}
                rules={[
                  {
                    required: true,
                    message: "Please input expiry date!",
                  },
                ]}
              >
                <DatePicker format="YYYY-MM-DD" inputReadOnly />
              </Form.Item>
            </Form>
          );
        } else {
          return <Typography.Text>{text}</Typography.Text>;
        }
      },
    },
    {
      title: "Action",
      render: (text, record) => (
        <Space
          direction="vertical"
          className="flex flex-col gap-y-4 justify-between items-center align-middle"
        >
          <Space
            direction="horizontal"
            className="flex flex-row gap-x-2 justify-between items-center align-middle"
          >
            {editingRowKey === null ? (
              <EditOutlined
                className="flex cursor-pointer"
                onClick={() => {
                  setEditingRowKey(record.key);
                  formEdit.setFieldsValue({
                    title: record.title,
                    description: record.description,
                    image: record.image,
                    expiryDate: moment(record.expiryDate, "ddd, MMM Do YYYY"),
                  });
                }}
                title="Edit"
              />
            ) : (
              record.key === editingRowKey && (
                <CloseCircleOutlined
                  className="flex cursor-pointer"
                  onClick={() => {
                    setEditingRowKey(null);
                  }}
                  title="Cancel Edit"
                />
              )
            )}

            {record.key === editingRowKey && (
              <Popconfirm
                title="Save Edits?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => formEdit.submit()}
              >
                <Button
                  icon={<SaveOutlined title="Save Edits" />}
                  htmlType="submit"
                  className="flex border-hidden bg-transparent justify-center items-center"
                />
              </Popconfirm>
            )}
          </Space>
          <Popconfirm
            title="Sure to delete?"
            okType="danger"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.key)}
          >
            {!editingRowKey && (
              <DeleteOutlined
                className="flex text-red-700 cursor-pointer mt-4"
                title="Delete Row"
              />
            )}
          </Popconfirm>
        </Space>
      ),
      key: uuidv4(),
      fixed: "right",
    },
  ];
}
