import { Transfer, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CustomTooltip from "@/components/tooltip/customtooltip";

export function TransferPosition({
  positionList,
  setPositionList,
  targetKeys,
  setTargetKeys,
  setPositionAddModalOpen,
}) {
  return (
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
  );
}
