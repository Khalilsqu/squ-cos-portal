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
import { TransferPosition } from "@/components/admin-dashboard/staffDirectory/transferPositions";
import { AddNewPositionModal } from "@/components/admin-dashboard/staffDirectory/positionModal";
import { DeletePositionModal } from "@/components/admin-dashboard/staffDirectory/positionModal";
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

  const [formAddPosition] = Form.useForm();
  const [positionAddModalOpen, setPositionAddModalOpen] = useState(false);

  const [formDeletePosition] = Form.useForm();
  const [positionDeleteModalOpen, setPositionDeleteModalOpen] = useState(false);

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
      <Space className="w-full h-full justify-center items-center flex">
        <Spin size="large" />
      </Space>
    );
  }

  if (targetKeys && departmentList && positionList) {
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
        <TableComponent
          setDrawerOpen={setDrawerOpen}
          setColumnAddModalOpen={setColumnAddModalOpen}
          targetKeys={targetKeys}
          departmentList={departmentList}
          positionList={positionList}
          columns={columns}
          data={data}
          setData={setData}
        />
        <PositionsList />
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
