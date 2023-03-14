import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useState } from "react";
import {
  Form,
  Table,
  Button,
  Space,
  notification,
  Typography,
  Divider,
  Tag,
  Transfer,
  Modal,
  Input,
} from "antd";

import { MailOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import { useWindowSize } from "@/components/utils/windowSize";
import { collapsedState } from "@/components/layout/pageLayout";
import { isBreakPointState } from "@/components/layout/pageLayout";
import { colorThemeState } from "@/components/layout/pageLayout";

import { AddDepartmentModal } from "@/components/admin-dashboard/staffDirectory";
import { AddStaffDrawer } from "@/components/admin-dashboard/staffDirectory";
import { AddColumnModal } from "@/components/admin-dashboard/staffDirectory";
import { DeleteDepartmentModal } from "@/components/admin-dashboard/staffDirectory";
import CustomTooltip from "@/components/tooltip/customtooltip";

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

  const [positionList, setPositionList] = useState([
    "Professor",
    "Associate Professor",
    "Assistant Professor",
    "Lecturer",
    "Demonstrator",
    "Researcher",
    "Research Assistant",
    "Dean",
    "Assistant Dean for Undergraduate Studies",
    "Assistant Dean for PostGraduate Studies",
    "Assistant Dean for Community Service",
    "Clerk",
    "Secretary",
    "Department Head",
    "Depatment SuperAttendant",
    "Technician",
    "Consultant",
  ]);

  const [formAdd] = Form.useForm();
  const [formAddColumns] = Form.useForm();
  const [columnAddModalOpen, setColumnAddModalOpen] = useState(false);
  const [formAddDepartment] = Form.useForm();
  const [departmentAddModalOpen, setDepartmentAddModalOpen] = useState(false);
  const [formDeleteDepartment] = Form.useForm();
  const [departmentDeleteModalOpen, setDepartmentDeleteModalOpen] =
    useState(false);

  const [formAddPosition] = Form.useForm();
  const [positionAddModalOpen, setPositionAddModalOpen] = useState(false);

  const { width } = useWindowSize();

  const isBreakPoint = isBreakPointState().isBreakPoint;
  const collapsed = collapsedState().collapsed;
  const colorTheme = colorThemeState().colorTheme;
  const [targetKeys, setTargetKeys] = useState(positionList);

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
      <Typography.Title level={1} className="w-full text-center">
        Staff Directory
      </Typography.Title>
      <Divider orientation="left">Departments</Divider>
      <Space wrap className="mb-4">
        {departmentList.map((department) => (
          <Tag
            color={colorTheme === "dark" ? "geekblue" : "blue"}
            key={department}
          >
            {department}
          </Tag>
        ))}
        <Divider type="vertical" className="h-8 shadow-2xl border-2" />
        <Button
          type="primary"
          className="border-red-600"
          onClick={() => {
            setDepartmentAddModalOpen(true);
          }}
          icon={<PlusOutlined />}
        >
          Add a new Department
        </Button>
        <Button
          type="danger"
          className="border-red-600"
          onClick={() => {
            setDepartmentDeleteModalOpen(true);
          }}
          icon={<DeleteOutlined />}
        >
          Delete a Department
        </Button>
      </Space>
      <Divider orientation="left">Positions</Divider>
      <Transfer
        dataSource={positionList.map((position) => ({
          key: position,
          title: position,
        }))}
        showSearch
        filterOption={(inputValue, item) =>
          // match search case insensitive
          item.title.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
        }
        listStyle={{
          width: 300,
          height: 300,
        }}
        operations={["Add", "Remove"]}
        titles={["Available", "Selected"]}
        direction="right"
        targetKeys={targetKeys}
        render={(item) => item.title}
        onChange={(nextTargetKeys, direction, moveKeys) => {
          setTargetKeys(nextTargetKeys);
        }}
        footer={(props) => {
          if (props.direction === "left") {
            return (
              <CustomTooltip title="Add a new Position">
                <Button
                  className="border-0 bg-transparent text-blue-500 hover:text-blue-700"
                  icon={
                    <PlusOutlined
                      onClick={() => {
                        setPositionAddModalOpen(true);
                      }}
                    />
                  }
                />
              </CustomTooltip>
            );
          }
        }}
        className="mb-10 overflow-x-auto"
      />
      <Divider orientation="left">Staff Table</Divider>
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
      <AddDepartmentModal
        departmentAddModalOpen={departmentAddModalOpen}
        setDepartmentAddModalOpen={setDepartmentAddModalOpen}
        formAddDepartment={formAddDepartment}
        departmentList={departmentList}
        setDepartmentList={setDepartmentList}
      />
      <DeleteDepartmentModal
        departmentDeleteModalOpen={departmentDeleteModalOpen}
        setDepartmentDeleteModalOpen={setDepartmentDeleteModalOpen}
        formDeleteDepartment={formDeleteDepartment}
        departmentList={departmentList}
        setDepartmentList={setDepartmentList}
      />
      <AddNewPositionModal
        positionAddModalOpen={positionAddModalOpen}
        setPositionAddModalOpen={setPositionAddModalOpen}
        formAddPosition={formAddPosition}
        positionList={positionList}
        setTargetKeys={setTargetKeys}
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

const AddNewPositionModal = ({
  positionAddModalOpen,
  setPositionAddModalOpen,
  formAddPosition,
}) => {
  return (
    <Modal
      title="Add a new Position"
      visible={positionAddModalOpen}
      onCancel={() => {
        setPositionAddModalOpen(false);
      }}
      footer={null}
    >
      <Form
        form={formAddPosition}
        onFinish={(values) => {
          console.log(values);
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
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Form.Item>
      </Form>
    </Modal>
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
