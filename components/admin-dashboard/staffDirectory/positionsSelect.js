import {
  List,
  Space,
  Typography,
  Checkbox,
  message,
  Skeleton,
  Button,
  Popconfirm,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import CustomTooltip from "@/components/tooltip/customtooltip";

export default function PositionsList({
  positionsList,
  positionsListError,
  positionsListLoading,
  setPositionsList,
}) {
  return (
    <Skeleton loading={positionsListLoading} active>
      <List
        size="small"
        bordered
        header={
          <div className="flex flex-row justify-between">
            <Typography.Text strong>Position Name</Typography.Text>
            <Typography.Text strong>Actions</Typography.Text>
          </div>
        }
        dataSource={positionsList}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Space key={item.key}>
                <CustomTooltip title="Edit">
                  <Button type="text" icon={<EditOutlined />} />
                </CustomTooltip>

                <Popconfirm
                  title={`Are you sure to delete ${item.positionName}?`}
                  okText="Yes"
                  cancelText="No"
                  onConfirm={async () => {
                    const responseDelete = await fetch(
                      "/api/dashboard/staffDirectory/positions",
                      {
                        method: "DELETE",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          key: item.key,
                        }),
                      }
                    );
                    console.log(responseDelete);
                    if (responseDelete.ok) {
                      setPositionsList(
                        positionsList.filter(
                          (position) => position.key !== item.key
                        ),
                        false
                      );
                      message.success(`${item.positionName} deleted`);
                    } else {
                      message.error(`${item.positionName} delete failed`);
                    }
                  }}
                >
                  <Button type="text" icon={<DeleteOutlined />} danger />
                </Popconfirm>
              </Space>,
            ]}
          >
            <List.Item.Meta
              title={item.positionName}
              description={item.description}
              avatar={
                <Checkbox
                  defaultChecked={item.selected}
                  onChange={async (e) => {
                    const response = await fetch(
                      "/api/dashboard/staffDirectory/positions",
                      {
                        method: "PATCH",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          changeType: "selected",
                          key: item.key,
                          selected: e.target.checked,
                        }),
                      }
                    );

                    if (response.ok) {
                      setPositionsList(
                        positionsList.map((position) => {
                          if (position.positionName === item.positionName) {
                            return {
                              ...position,
                              selected: e.target.checked,
                            };
                          } else {
                            return position;
                          }
                        }),
                        false
                      );
                      if (e.target.checked) {
                        message.success(
                          `${item.positionName} is now available`
                        );
                      } else {
                        message.warning(
                          `${item.positionName} is now unavailable`
                        );
                      }
                    } else {
                      message.error(`${item.positionName} update failed`);
                    }
                  }}
                />
              }
            />
          </List.Item>
        )}
      />
    </Skeleton>
  );
}
