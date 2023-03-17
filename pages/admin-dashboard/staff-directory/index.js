import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useEffect, useState } from "react";
import useSWR from "swr";
import {
  Form,
  Table,
  Button,
  Space,
  notification,
  Typography,
  Divider,
  Tag,
  Spin,
} from "antd";

import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { IoPersonAdd } from "react-icons/io5";
import { RiInsertColumnRight } from "react-icons/ri";

import { useWindowSize } from "@/components/utils/windowSize";
import { collapsedState } from "@/components/layout/pageLayout";
import { isBreakPointState } from "@/components/layout/pageLayout";
import { colorThemeState } from "@/components/layout/pageLayout";

import { AddDepartmentModal } from "@/components/admin-dashboard/staffDirectory";
import { AddStaffDrawer } from "@/components/admin-dashboard/staffDirectory/addSatffToTable";
import { AddColumnModal } from "@/components/admin-dashboard/staffDirectory";
import { DeleteDepartmentModal } from "@/components/admin-dashboard/staffDirectory";
import { TransferPosition } from "@/components/admin-dashboard/staffDirectory/transferPositions";
import { AddNewPositionModal } from "@/components/admin-dashboard/staffDirectory/positionModal";
import { DeletePositionModal } from "@/components/admin-dashboard/staffDirectory/positionModal";
import CustomTooltip from "@/components/tooltip/customtooltip";

export const columnWidth = "200px";

const columnsList = [
  {
    title: "Name",
    dataIndex: "Name",
    editable: true,
    width: columnWidth,
  },
  {
    title: "Email",
    dataIndex: "Email",
    editable: true,
    width: columnWidth,
  },
  {
    title: "Department",
    dataIndex: "Department",
    editable: true,
    width: columnWidth,
  },
  {
    title: "Position",
    dataIndex: "Position",

    width: columnWidth,
  },
  {
    title: "Reports To",
    dataIndex: "Reports To",

    width: columnWidth,
  },

  {
    title: "Action",
    dataIndex: "Action",

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

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function StaffDirectory() {
  const columnsHeader = columnsList;
  const [columns, setColumns] = useState(columnsHeader);
  const [data, setData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formErrorMessages, setFormErrorMessages] = useState([]);

  const {
    data: departmentList,
    error: departmentListError,
    mutate: setDepartmentList,
    isLoading: departmentListLoading,
  } = useSWR(
    "/api/dashboard/staffDirectory/departments", // sort departments when fectching
    fetcher,
    {
      refreshInterval: 0,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
    }
  );

  const {
    data: positionList,
    error: positionListError,
    mutate: setPositionList,
    isLoading: positionListLoading,
  } = useSWR(
    "/api/dashboard/staffDirectory/positionsAvailable", // sort positions when fectching
    fetcher,
    {
      refreshInterval: 0,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
    }
  );

  const {
    data: targetKeys,
    error: targetKeysError,
    mutate: setTargetKeys,
    isLoading: targetKeysLoading,
  } = useSWR("/api/dashboard/staffDirectory/positionsSelected", fetcher, {
    refreshInterval: 0,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnMount: true,
  });

  useEffect(() => {
    if (departmentList) {
      setDepartmentList(departmentList.sort(), false);
    }
    if (positionList) {
      setPositionList(positionList.sort(), false);
    }
    if (targetKeys) {
      setTargetKeys(targetKeys.sort(), false);
    }
  }, [departmentList, positionList, targetKeys]);

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

  const [formDeletePosition] = Form.useForm();
  const [positionDeleteModalOpen, setPositionDeleteModalOpen] = useState(false);

  const { width } = useWindowSize();

  const isBreakPoint = isBreakPointState().isBreakPoint;
  const collapsed = collapsedState().collapsed;
  const colorTheme = colorThemeState().colorTheme;

  const widthCalc = isBreakPoint ? "20px" : collapsed ? "100px" : "220px";

  const handleAddFormFinish = (values) => {
    const mappedData = columns.map((column) => {
      if (column.dataIndex !== "Action") {
        return {
          key: data.length + 1,
          [column.dataIndex]: values[column.dataIndex],
        };
      }
    });
    const newData = Object.assign({}, ...mappedData);

    setData([...data, newData]);
    notification.success({
      message: "Staff Added",
      description: "Staff has been added successfully",
    });
  };

  if (departmentListError && positionListError && targetKeysError) {
    return (
      <div className="w-full justify-center items-center flex">
        <Typography.Title level={1} className="w-full text-center">
          Failed to load data from server
        </Typography.Title>
      </div>
    );
  }
  if (departmentListLoading && positionListLoading && targetKeysLoading) {
    return (
      <div className="w-full justify-center items-center flex">
        <Spin size="large" />
      </div>
    );
  } else if (targetKeys && departmentList && positionList) {
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
          <CustomTooltip title="Add Department">
            <Button
              className="border-0 bg-transparent"
              icon={
                <PlusOutlined
                  onClick={() => {
                    setDepartmentAddModalOpen(true);
                  }}
                />
              }
            />
          </CustomTooltip>
          <CustomTooltip title="Delete Department">
            <Button
              className="border-0 bg-transparent"
              icon={
                <DeleteOutlined
                  className="text-red-500"
                  onClick={() => {
                    setDepartmentDeleteModalOpen(true);
                  }}
                />
              }
            />
          </CustomTooltip>
        </Space>
        <Divider orientation="left">Positions</Divider>
        <TransferPosition
          positionList={positionList}
          targetKeys={targetKeys}
          setTargetKeys={setTargetKeys}
          setPositionAddModalOpen={setPositionAddModalOpen}
          setPositionDeleteModalOpen={setPositionDeleteModalOpen}
        />
        <Divider orientation="left">Staff Table</Divider>
        <AddStaffDrawer
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          formAdd={formAdd}
          handleAddFormFinish={handleAddFormFinish}
          setFormErrorMessages={setFormErrorMessages}
          departmentList={departmentList}
          targetKeys={targetKeys}
          positionList={positionList}
          columns={columns}
          data={data}
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
          setPositionList={setPositionList}
        />
        <DeletePositionModal
          positionDeleteModalOpen={positionDeleteModalOpen}
          setPositionDeleteModalOpen={setPositionDeleteModalOpen}
          formDeletePosition={formDeletePosition}
          positionList={positionList}
          setPositionList={setPositionList}
          targetKeys={targetKeys}
        />
        <Table
          columns={columns}
          dataSource={data}
          footer={() => {
            return (
              <Space>
                <CustomTooltip title="Add Staff">
                  <Button
                    onClick={() => setDrawerOpen(true)}
                    icon={<IoPersonAdd className="text-xl" />}
                    className="border-0 bg-transparent"
                  />
                </CustomTooltip>
                <CustomTooltip title="Add Column">
                  <Button
                    onClick={() => setColumnAddModalOpen(true)}
                    icon={<RiInsertColumnRight className="text-xl" />}
                    className="border-0 bg-transparent"
                  />
                </CustomTooltip>
              </Space>
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
}

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
