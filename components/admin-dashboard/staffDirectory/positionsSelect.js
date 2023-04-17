import useSWR from "swr";
import { fetcher } from "@/components/utils/useSwrFetcher";
import { List, Space, Form, Typography, Checkbox, message } from "antd";

export default function PositionsList() {
  const {
    data: positionList,
    mutate,
    isLoading,
  } = useSWR("/api/dashboard/staffDirectory/positions", fetcher, {
    refreshInterval: 0,
    revalidateOnFocus: false,
    revalidateIfStale: true,
    revalidateOnMount: true,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <List
      size="small"
      bordered
      header={
        <div className="flex flex-row justify-between">
          <Typography.Text strong>Position Name</Typography.Text>
          <Typography.Text strong>Actions</Typography.Text>
        </div>
      }
      dataSource={positionList}
      renderItem={(item) => (
        <List.Item
          actions={[
            <Form.Item>
              <Space>
                <Typography.Text>edit</Typography.Text>
                <Typography.Text>delete</Typography.Text>
              </Space>
            </Form.Item>,
          ]}
        >
          <List.Item.Meta
            title={item.positionName}
            description={item.description}
            avatar={
              <Checkbox
                defaultChecked={item.selected}
                onChange={async (e) => {
                  console.log(e.target.checked);

                  mutate(
                    positionList.map((position) => {
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
                    if (e.target.checked) {
                      message.success(`${item.positionName} is now available`);
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
  );
}
