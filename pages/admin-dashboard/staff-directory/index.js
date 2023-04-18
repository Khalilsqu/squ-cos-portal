import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/components/utils/useSwrFetcher";
import { Form, Button, Space, Typography, Divider, Tag, Spin, App } from "antd";
import { v4 as uuidv4 } from "uuid";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { colorThemeState } from "@/components/layout/pageLayout";

import { AddDepartmentModal } from "@/components/admin-dashboard/staffDirectory";
import { AddStaffDrawer } from "@/components/admin-dashboard/staffDirectory/addSatffToTable";
import { AddColumnModal } from "@/components/admin-dashboard/staffDirectory";
import { DeleteDepartmentModal } from "@/components/admin-dashboard/staffDirectory";
import CustomTooltip from "@/components/tooltip/customtooltip";
import { useColumnsList } from "@/components/admin-dashboard/staffDirectory/tableColumns";
import TableComponent from "@/components/admin-dashboard/staffDirectory/table";
import PositionsList from "@/components/admin-dashboard/staffDirectory/positionsSelect";

export default function StaffDirectory() {
  const { notification } = App.useApp();
  const [data, setData] = useState([]);

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
    data: positionsList,
    mutate: setPositionsList,
    isLoading: positionsListLoading,
    error: positionsListError,
  } = useSWR("/api/dashboard/staffDirectory/positions", fetcher, {
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
  }, [departmentList]);

  const [formAdd] = Form.useForm();

  const columnsHeader = useColumnsList(
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

  const colorTheme = colorThemeState().colorTheme;

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

  if (departmentListError && positionsListError) {
    return (
      <Space className="w-full justify-center items-center flex">
        <Typography.Title level={1} className="w-full text-center">
          Failed to load data from server. Please try to refresh the page or try
          again later.
        </Typography.Title>
      </Space>
    );
  }

  if (departmentListLoading || positionsListLoading) {
    return (
      <Space className="w-full h-full justify-center items-center flex">
        <Spin size="large" />
      </Space>
    );
  }

  if (departmentList) {
    return (
      <div className="my-4">
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
        <PositionsList
          positionsList={positionsList}
          positionsListError={positionsListError}
          positionsListLoading={positionsListLoading}
          setPositionsList={setPositionsList}
        />
        <Divider orientation="left">Staff Table</Divider>
        <AddStaffDrawer
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          formAdd={formAdd}
          handleAddFormFinish={handleAddFormFinish}
          setFormErrorMessages={setFormErrorMessages}
          departmentList={departmentList}
          positionList={positionsList}
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
        <TableComponent
          setDrawerOpen={setDrawerOpen}
          setColumnAddModalOpen={setColumnAddModalOpen}
          departmentList={departmentList}
          positionList={positionsList}
          columns={columns}
          data={data}
          setData={setData}
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
