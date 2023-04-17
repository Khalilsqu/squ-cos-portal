import { Table, Popconfirm, Button, Space } from "antd";
import useSWR from "swr";
import { useState } from "react";
import { fetcher } from "@/components/utils/useSwrFetcher";
import CustomTooltip from "@/components/tooltip/customtooltip";
import { RiInsertColumnRight } from "react-icons/ri";
import { AiOutlineUserAdd, AiOutlineUserDelete } from "react-icons/ai";

import { useWindowSize } from "@/components/utils/windowSize";
import { collapsedState } from "@/components/layout/pageLayout";
import { isBreakPointState } from "@/components/layout/pageLayout";
import ExportExcel from "@/components/admin-dashboard/staffDirectory/exportExcel";
import ImportExcel from "@/components/admin-dashboard/staffDirectory/importExcel";

export default function TableComponent({
  setDrawerOpen,
  setColumnAddModalOpen,
  targetKeys,
  departmentList,
  positionList,
  columns,
  data,
  setData,
}) {
  // const { data: staffColumns, mutate } = useSWR(
  //   "/api/dashboard/staffDirectory/getColumnNames",
  //   fetcher,
  //   {
  //     refreshInterval: 0,
  //   }
  // );

  const { width } = useWindowSize();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const isBreakPoint = isBreakPointState().isBreakPoint;
  const collapsed = collapsedState().collapsed;
  const widthCalc = isBreakPoint ? "20px" : collapsed ? "100px" : "220px";

  return (
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
      scroll={{ x: "max-content" }}
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
  );
}
