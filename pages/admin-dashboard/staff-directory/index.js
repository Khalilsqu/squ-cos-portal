import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useState } from "react";
import {
  Form,
  Table,
  Button,
  Space,
  notification,
  Drawer,
  Input,
  Col,
  Row,
  Select,
  Modal,
} from "antd";

import { MailOutlined } from "@ant-design/icons";

import { useWindowSize } from "@/components/utils/windowSize";
import { collapsedState } from "@/components/layout/pageLayout";
import { isBreakPointState } from "@/components/layout/pageLayout";

const columnWidth = "200px";

const columnsList = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    editable: true,
    width: columnWidth,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    editable: true,
    width: columnWidth,
  },
  {
    title: "Department",
    dataIndex: "department",
    key: "department",
    editable: true,
    width: columnWidth,
  },
  {
    title: "Position",
    dataIndex: "position",
    key: "position",
    width: columnWidth,
  },
  {
    title: "Reports To",
    dataIndex: "reportsTo",
    key: "reportsTo",
    width: columnWidth,
  },

  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    width: "20px",
    render: (text, record) => (
      <Space size="middle">
        <Button type="primary">Edit</Button>
        <Button type="primary" danger>
          Delete
        </Button>
      </Space>
    ),
  },
];

export default function StaffDirectory() {
  const columnsHeader = columnsList;
  const [columns, setColumns] = useState(columnsHeader);
  const [data, setData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formErrorMessages, setFormErrorMessages] = useState([]);
  const [departmentList, setDepartmentList] = useState([
    "Earth Sciences",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Statistics",
  ]);

  const [formAdd] = Form.useForm();
  const [formAddColumns] = Form.useForm();
  const [columnAddModalOpen, setColumnAddModalOpen] = useState(false);
  const { width } = useWindowSize();

  const isBreakPoint = isBreakPointState().isBreakPoint;
  const collapsed = collapsedState().collapsed;
  const widthCalc = isBreakPoint ? "20px" : collapsed ? "100px" : "220px";

  const handleAddFormFinish = (values) => {
    const newData = {
      key: data.length + 1,
      name: values.name,
      email: values.email,
      department: values.department,
    };

    setData([...data, newData]);
    notification.success({
      message: "Staff Added",
      description: "Staff has been added successfully",
    });
  };

  return (
    <div className="w-full">
      <h1>Staff Directory</h1>
      <AddStaffDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        formAdd={formAdd}
        handleAddFormFinish={handleAddFormFinish}
        setFormErrorMessages={setFormErrorMessages}
        departmentList={departmentList}
      />
      <AddColumnModal
        columns={columns}
        setColumns={setColumns}
        columnAddModalOpen={columnAddModalOpen}
        setColumnAddModalOpen={setColumnAddModalOpen}
        formAddColumns={formAddColumns}
      />
      <Table
        columns={columns}
        dataSource={data}
        footer={() => {
          return (
            <div>
              <Button type="primary" onClick={() => setDrawerOpen(true)}>
                Add Staff
              </Button>
              <Button
                type="primary"
                onClick={() => setColumnAddModalOpen(true)}
              >
                Add a new column
              </Button>
            </div>
          );
        }}
        size="small"
        scroll={{ x: true }}
        tableLayout="auto"
        bordered
        style={{
          maxWidth: `calc(${width}px - ${widthCalc})`,
        }}
      />
    </div>
  );
}

const AddColumnModal = ({
  columns,
  setColumns,
  columnAddModalOpen,
  setColumnAddModalOpen,
  formAddColumns,
}) => {
  return (
    <Modal
      title="Add a new column"
      open={columnAddModalOpen}
      onCancel={() => setColumnAddModalOpen(false)}
      footer={[
        <Button
          key="back"
          onClick={() => {
            formAddColumns.resetFields();
            setColumnAddModalOpen(false);
          }}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            formAddColumns
              .validateFields()
              .then((values) => {
                const newColumns = [...columns];
                newColumns.splice(newColumns.length - 1, 0, {
                  title: values.title,
                  dataIndex: values.dataIndex,
                  key: values.dataIndex,
                  editable: true,
                  width: columnWidth,
                });
                setColumns(newColumns);
                setColumnAddModalOpen(false);
                formAddColumns.resetFields();
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
        >
          Submit
        </Button>,
      ]}
    >
      <Form
        form={formAddColumns}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: "public",
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              message: "Please input the title of the column!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="dataIndex"
          label="Data Index"
          rules={[
            {
              required: true,
              message: "Please input the data index of the column!",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const AddStaffDrawer = ({
  drawerOpen,
  setDrawerOpen,
  formAdd,
  handleAddFormFinish,
  setFormErrorMessages,
  departmentList,
}) => {
  const { width } = useWindowSize();
  return (
    <Drawer
      title="Add Staff"
      placement="right"
      closable={false}
      onClose={() => setDrawerOpen(false)}
      open={drawerOpen}
      maskClosable={false}
      mask={true}
      maskStyle={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
      }}
      width={
        width > 768 ? "50%" : width > 576 ? "70%" : width > 320 ? "90%" : "100%"
      }
      footer={
        <div
          style={{
            textAlign: "right",
          }}
        >
          <Button
            onClick={() => {
              formAdd.resetFields();
              setDrawerOpen(false);
            }}
            style={{ marginRight: 8 }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              formAdd
                .validateFields()
                .then((values) => {
                  handleAddFormFinish(values);
                  formAdd.resetFields();
                  setDrawerOpen(false);
                })
                .catch((info) => {
                  setFormErrorMessages(info.errorFields);
                });
            }}
            type="primary"
          >
            Submit
          </Button>
        </div>
      }
    >
      <Form form={formAdd} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter name" }]}
            >
              <Input placeholder="Please enter name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Please enter email",
                },
                {
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
            >
              <Input
                placeholder="Please enter email"
                prefix={<MailOutlined />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="department"
              label="Department"
              hasFeedback
              rules={[{ required: true, message: "Please enter department" }]}
            >
              <Select placeholder="Please select department" allowClear>
                {departmentList.sort().map((department) => {
                  return (
                    <Select.Option key={department} value={department}>
                      {department}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const adminEmails = [
    "hooti@squ.edu.om",
    "hosni@squ.edu.om",
    "wasila@squ.edu.om",
    "alhasnie@squ.edu.om",
    "said.m@squ.edu.om",
    "a.albarwani1@squ.edu.om",
    "h.alshukaili@squ.edu.om",
  ];

  if (!session | !adminEmails.includes(session?.user.email)) {
    return {
      redirect: { destination: "/" },
    };
  }

  return {
    props: { session },
  };
}
