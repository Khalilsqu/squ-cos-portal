import { Tag, Space, Button, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import CustomTooltip from "@/components/tooltip/customtooltip";

export const columnWidth = "200px";

export const columnsList = (
  setDrawerOpen,
  setEditingKey,
  formAdd,
  data,
  setData
) => {
  return [
    {
      title: "Name",
      dataIndex: "Name",
      editable: true,
      width: columnWidth,
    },
    {
      title: "Email",
      dataIndex: "Email",
      editable: true,
      width: columnWidth,
    },
    {
      title: "Department",
      dataIndex: "Department",
      editable: true,
      width: columnWidth,
      render: (text, record) => {
        if (Array.isArray(text)) {
          return text.map((department) => (
            <Tag key={department}>{department}</Tag>
          ));
        } else {
          return <Tag>{text}</Tag>;
        }
      },
    },
    {
      title: "Gender",
      dataIndex: "Gender",
      editable: true,
      width: columnWidth,
      render: (text, record) => (
        <Tag color={text === "Male" ? "blue" : "pink"}>{text}</Tag>
      ),
    },
    {
      title: "Position",
      dataIndex: "Position",
      width: columnWidth,
      render: (text, record) => {
        if (Array.isArray(text)) {
          return text.map((position) => <Tag key={position}>{position}</Tag>);
        } else {
          return <Tag>{text}</Tag>;
        }
      },
    },
    {
      title: "Reports To",
      dataIndex: "Reports To",
      width: columnWidth,
    },

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
                  Name: record.Name,
                  Email: record.Email,
                  Department: record.Department,
                  Position: record.Position,
                  Gender: record.Gender,
                  "Reports To": record["Reports To"],
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