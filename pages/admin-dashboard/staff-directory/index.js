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
} from "antd";

const columnsList = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: "30%",
    editable: true,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: "30%",
    editable: true,
  },
  {
    title: "Department",
    dataIndex: "department",
    key: "department",
    width: "30%",
    editable: true,
  },
];

export default function StaffDirectory() {
  const columnsHeader = columnsList;
  const [columns, setColumns] = useState(columnsHeader);
  const [data, setData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [formAdd] = Form.useForm();

  return (
    <div>
      <h1>Staff Directory</h1>
      <AddStaffDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        formAdd={formAdd}
      />
      <Table
        columns={columns}
        dataSource={data}
        footer={() => {
          return (
            <Button type="primary" onClick={() => setDrawerOpen(true)}>
              Add Staff
            </Button>
          );
        }}
      />
    </div>
  );
}

const AddStaffDrawer = ({ drawerOpen, setDrawerOpen, formAdd }) => {
  return (
    <Drawer
      title="Add Staff"
      placement="right"
      closable={true}
      onClose={() => setDrawerOpen(false)}
      open={drawerOpen}
      width={720}
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
              rules={[{ required: true, message: "Please enter email" }]}
            >
              <Input placeholder="Please enter email" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: "Please enter department" }]}
            >
              <Input placeholder="Please enter department" />
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
