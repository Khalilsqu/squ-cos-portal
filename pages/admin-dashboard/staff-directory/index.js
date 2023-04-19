import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/components/utils/useSwrFetcher";
import { Form, Typography, Divider, App } from "antd";
import { v4 as uuidv4 } from "uuid";

import { colorThemeState } from "@/components/layout/pageLayout";

import { AddStaffDrawer } from "@/components/admin-dashboard/staffDirectory/addSatffToTable";
import { AddColumnModal } from "@/components/admin-dashboard/staffDirectory";

import { useColumnsList } from "@/components/admin-dashboard/staffDirectory/tableColumns";
import TableComponent from "@/components/admin-dashboard/staffDirectory/table";
import PositionsList from "@/components/admin-dashboard/staffDirectory/positionsSelect";
import DepartmentsList from "@/components/admin-dashboard/staffDirectory/departmentList";

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
  } = useSWR("/api/dashboard/staffDirectory/departments", fetcher, {
    refreshInterval: 0,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnMount: true,
  });

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

  return (
    <div className="my-4">
      <Typography.Title level={1} className="w-full text-center">
        Staff Directory
      </Typography.Title>
      <Divider orientation="left">Departments</Divider>
      <DepartmentsList
        departmentList={departmentList}
        departmentListError={departmentListError}
        departmentListLoading={departmentListLoading}
        setDepartmentList={setDepartmentList}
      />

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
