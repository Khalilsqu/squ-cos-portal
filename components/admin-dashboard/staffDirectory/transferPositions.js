import { Transfer, Button, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
// import CustomTooltip from "@/components/tooltip/customtooltip";
import { useEffect } from "react";

export function TransferPosition({
  positionList,
  targetKeys,
  setTargetKeys,
  setPositionAddModalOpen,
  setPositionDeleteModalOpen,
  loadingPositions,
  loadingTargetKeys,
}) {
  return (
    <Transfer
      loading={loadingPositions || loadingTargetKeys}
      dataSource={positionList?.map((position) => ({
        key: position,
        title: position,
      }))}
      showSearch
      filterOption={(inputValue, item) =>
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
      onChange={async (nextTargetKeys, direction, moveKeys) => {
        setTargetKeys(nextTargetKeys, false);
        const responseTargetKeys = await fetch(
          "/api/dashboard/staffDirectory/positionsSelected",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              positions: nextTargetKeys,
            }),
          }
        );
        if (responseTargetKeys.ok) {
        }
      }}
      footer={(props) => {
        if (props.direction === "left") {
          return (
            <Space direction="horizontal">
              {/* <CustomTooltip title="Add a new Position"> */}
                <Button
                  className="border-0 bg-transparent text-blue-500 hover:text-blue-700"
                  onClick={() => {
                    setPositionAddModalOpen(true);
                  }}
                  icon={<PlusOutlined />}
                />
              {/* </CustomTooltip> */}
              {/* <CustomTooltip title="Delete a Position"> */}
                <Button
                  className="border-0 bg-transparent text-blue-500 hover:text-blue-700"
                  onClick={() => {
                    setPositionDeleteModalOpen(true);
                  }}
                  icon={<DeleteOutlined />}
                  danger
                />
              {/* </CustomTooltip> */}
            </Space>
          );
        }
      }}
      className="mb-10 overflow-x-auto"
    />
  );
}
