import { Tag, Space, Button, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import moment from "moment";
import dayjs from "dayjs";

import CustomTooltip from "@/components/tooltip/customtooltip";

export const columnWidth = "fit-content";

export const columnsList = (staffTableColumns) => {
  const columns = staffTableColumns?.map((column) => {
    return {
      // Capitalize first letter of title
      title: column.key.charAt(0).toUpperCase() + column.key.slice(1),
      dataIndex: column.key,
      editable: true,
      width: columnWidth,
    };
  });

  return [
    ...columns,

    // {
    //   title: "Action",
    //   dataIndex: "Action",
    //   width: "20px",
    //   render: (text, record) => (
    //     <Space size="middle" className="flex justify-center">
    //       <CustomTooltip title="Edit Staff" placement="left">
    //         <Button
    //           onClick={() => {
    //             setDrawerOpen(true);
    //             setEditingKey(record.key);
    //             formAdd.setFieldsValue({
    //               ...Object.keys(record).reduce((acc, key) => {
    //                 acc[key] = record[key];
    //                 if (moment(acc[key], "DD/MMM/YYYY", true).isValid()) {
    //                   acc[key] = dayjs(acc[key]);
    //                 }
    //                 return acc;
    //               }, {}),
    //             });
    //           }}
    //           type="text"
    //           icon={<EditOutlined />}
    //           className="rounder-full"
    //         />
    //       </CustomTooltip>
    //       <CustomTooltip title="Delete Staff" placement="left">
    //         <Popconfirm
    //           title="Sure to delete?"
    //           onConfirm={() => {
    //             setData(
    //               data.filter((staff) => {
    //                 return staff.key !== record.key;
    //               })
    //             );
    //           }}
    //           cancelText="No"
    //           okText="Yes"
    //           okType="danger"
    //         >
    //           <Button
    //             type="text"
    //             danger
    //             icon={<DeleteOutlined />}
    //             className="rounder-full"
    //           />
    //         </Popconfirm>
    //       </CustomTooltip>
    //     </Space>
    //   ),
    // },
  ];
};
