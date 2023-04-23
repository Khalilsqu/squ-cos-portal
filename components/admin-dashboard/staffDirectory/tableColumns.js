import { Tag, Space, Button, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import moment from "moment";
import dayjs from "dayjs";
import useSWR from "swr";
import { fetcher } from "@/components/utils/useSwrFetcher";

import CustomTooltip from "@/components/tooltip/customtooltip";

export const columnWidth = "fit-content";

export const useColumnsList = (
  setDrawerOpen,
  setEditingKey,
  formAdd,
  data,
  setData
) => {
  const {
    data: staffColumns,
    mutate,
    isLoading,
  } = useSWR("/api/dashboard/staffDirectory/staffDirectory", fetcher, {
    refreshInterval: 0,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
  });

  if (!isLoading) {
    console.log("staffColumns", staffColumns);
  }
  const columns = staffColumns?.map((column) => {
    return {
      title: column.key.charAt(0).toUpperCase() + column.key.slice(1), // capitalize(column.key),
      dataIndex: column.key,
      editable: true,
      width: columnWidth,
      render: (text, record) => {
        if (column.array) {
          return (
            <Space size="middle">
              {record[column.key].map((item) => {
                return (
                  <Tag color="blue" key={item}>
                    {item.toUpperCase()}
                  </Tag>
                );
              })}
            </Space>
          );
        }
      },
    };
  });

  return [
    ...columns,
    {
      title: "Action",
      dataIndex: "Action",
      width: "20px",
      render: (text, record) => (
        <Space size="middle" className="flex justify-center">
          <CustomTooltip title="Edit Staff" placement="left">
            <Button
              onClick={() => {
                setDrawerOpen(true);
                setEditingKey(record.key);
                formAdd.setFieldsValue({
                  ...Object.keys(record).reduce((acc, key) => {
                    acc[key] = record[key];
                    if (moment(acc[key], "DD/MMM/YYYY", true).isValid()) {
                      acc[key] = dayjs(acc[key]);
                    }
                    return acc;
                  }, {}),
                });
              }}
              type="text"
              icon={<EditOutlined />}
              className="rounder-full"
            />
          </CustomTooltip>
          <CustomTooltip title="Delete Staff" placement="left">
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => {
                setData(
                  data.filter((staff) => {
                    return staff.key !== record.key;
                  })
                );
              }}
              cancelText="No"
              okText="Yes"
              okType="danger"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                className="rounder-full"
              />
            </Popconfirm>
          </CustomTooltip>
        </Space>
      ),
    },
  ];
};
