import { Transfer, Button, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import CustomTooltip from "@/components/tooltip/customtooltip";

export function TransferPosition({
  positionList,
  setPositionList,
  targetKeys,
  setTargetKeys,
  setPositionAddModalOpen,
  setPositionDeleteModalOpen,
}) {
  return (
    <Transfer
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
        const ressponse = await fetch(
          "/api/dashboard/staffDirectory/positionsSelected",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              movedKeys: moveKeys,
              direction,
            }),
          }
        );

        if (direction === "right") {
          const responseDeletePosition = await fetch(
            "/api/dashboard/staffDirectory/positionsAvailable",
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                movedKeys: moveKeys,
              }),
            }
          );
          if (responseDeletePosition.ok) {
            setPositionList(
              positionList.filter((position) => !moveKeys.includes(position))
            );
            setTargetKeys(nextTargetKeys, false);
          }
        } else {
          const responseAddPosition = await fetch(
            "/api/dashboard/staffDirectory/positionsAvailable",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                movedKeys: moveKeys,
              }),
            }
          );
          if (responseAddPosition.ok) {
            setPositionList([...positionList, ...moveKeys]);
            setTargetKeys(nextTargetKeys, false);
          }
        }

        if (ressponse.ok) {
          setTargetKeys(nextTargetKeys, false);
        }
      }}
      footer={(props) => {
        if (props.direction === "left") {
          return (
            <Space direction="horizontal">
              <CustomTooltip title="Add a new Position">
                <Button
                  className="border-0 bg-transparent text-blue-500 hover:text-blue-700"
                  onClick={() => {
                    setPositionAddModalOpen(true);
                  }}
                  icon={<PlusOutlined />}
                />
              </CustomTooltip>
              <CustomTooltip title="Delete a Position">
                <Button
                  className="border-0 bg-transparent text-blue-500 hover:text-blue-700"
                  onClick={() => {
                    setPositionDeleteModalOpen(true);
                  }}
                  icon={<DeleteOutlined />}
                  danger
                />
              </CustomTooltip>
            </Space>
          );
        }
      }}
      className="mb-10 overflow-x-auto"
    />
  );
}
