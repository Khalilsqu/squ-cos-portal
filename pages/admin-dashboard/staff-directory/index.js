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
  Popconfirm,
} from "antd";
import { v4 as uuidv4 } from "uuid";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { RiInsertColumnRight } from "react-icons/ri";
import { AiOutlineUserAdd, AiOutlineUserDelete } from "react-icons/ai";

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
import { columnsList } from "@/components/admin-dashboard/staffDirectory/table";
import ExportExcel from "@/components/admin-dashboard/staffDirectory/exportExcel";
import ImportExcel from "@/components/admin-dashboard/staffDirectory/importExcel";

const exampleData = [
  {
    key: 1,
    Name: "John Brown 1",
    Gender: "Male",
    Department: ["Chemistry", "Physics"],
    Position: "Assistant Professor",
    Email: "aa@gmail.com",
    "Reports To": "John Doe",
    "Office Phone": "99999999",
  },
  {
    key: 2,
    Name: "John Brown 2",
    Gender: "Female",
    Department: "Chemistry",
    Position: "Assistant Professor",
    Email: "aa2@gmail.com",
    "Reports To": "John Doe",
    "Office Phone": "99999999",
  },
];

const fetcher = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export default function StaffDirectory() {
  const [data, setData] = useState(exampleData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingKey, setEditingKey] = useState(null);

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
      setDepartmentList(departmentList?.sort(), false);
    }
    if (positionList) {
      setPositionList(positionList?.sort(), false);
    }
    if (targetKeys) {
      setTargetKeys(targetKeys?.sort(), false);
    }
  }, [departmentList, positionList, targetKeys]);

  const [formAdd] = Form.useForm();

  const columnsHeader = columnsList(
    setDrawerOpen,
    setEditingKey,
    formAdd,
    data,
    setData
  );
  const [columns, setColumns] = useState(columnsHeader);
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
    if (editingKey) {
      const newData = [...data];
      const index = newData.findIndex((item) => editingKey === item.key);
      if (index > -1) {
        const item = newData[index];

        newData.splice(index, 1, { ...item, ...values });
        setData(newData);
        notification.success({
          message: "Staff Edited",
          description: "Staff has been edited successfully",
        });
        setEditingKey(null);
      }
    } else {
      const mappedData = columns.map((column) => {
        if (column.dataIndex !== "Action") {
          return {
            key: uuidv4(),
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
      setEditingKey(null);
    }
  };

  if (departmentListError && positionListError && targetKeysError) {
    return (
      <Space className="w-full justify-center items-center flex">
        <Typography.Title level={1} className="w-full text-center">
          Failed to load data from server. Please try to refresh the page or try
          again later.
        </Typography.Title>
      </Space>
    );
  }

  if (departmentListLoading || positionListLoading || targetKeysLoading) {
    return (
      <Space className="w-full justify-center items-center flex">
        <Spin size="large" />
      </Space>
    );
  }

  if (targetKeys && departmentList && positionList) {
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
              type="text"
              onClick={() => {
                setDepartmentAddModalOpen(true);
              }}
              icon={<PlusOutlined />}
            />
          </CustomTooltip>
          <CustomTooltip title="Delete Department">
            <Button
              type="text"
              onClick={() => {
                setDepartmentDeleteModalOpen(true);
              }}
              icon={<DeleteOutlined className="text-red-500" />}
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
          loadingPositions={positionListLoading}
          loadingTargetKeys={targetKeysLoading}
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
          editingKey={editingKey}
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
          setTargetKeys={setTargetKeys}
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
                    icon={<AiOutlineUserAdd className="text-xl" />}
                    type="text"
                  />
                </CustomTooltip>
                <CustomTooltip title="Add Column">
                  <Button
                    onClick={() => setColumnAddModalOpen(true)}
                    icon={<RiInsertColumnRight className="text-xl" />}
                    type="text"
                  />
                </CustomTooltip>
                {selectedRowKeys.length > 0 && (
                  <CustomTooltip title="Delete Selected Staff(s)">
                    <Popconfirm
                      title="Are you sure?"
                      onConfirm={() => {
                        const newData = [...data];
                        selectedRowKeys.forEach((key) => {
                          const index = newData.findIndex(
                            (item) => item.key === key
                          );
                          newData.splice(index, 1);
                        });
                        setData(newData);
                        setSelectedRowKeys([]);
                      }}
                    >
                      <Button
                        icon={<AiOutlineUserDelete className="text-xl" />}
                        type="text"
                        danger
                      />
                    </Popconfirm>
                  </CustomTooltip>
                )}
                <ExportExcel data={data} selectedRowKeys={selectedRowKeys} />
                <ImportExcel
                  data={data}
                  setData={setData}
                  columns={columns}
                  departmentList={departmentList}
                  positionList={positionList}
                  targetKeys={targetKeys}
                />
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
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedRowKeys) => {
              setSelectedRowKeys(selectedRowKeys);
            },
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
