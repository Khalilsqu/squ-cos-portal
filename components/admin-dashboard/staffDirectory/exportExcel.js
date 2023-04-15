import * as XLSX from "xlsx";
import { Button } from "antd";
// import CustomTooltip from "@/components/tooltip/customtooltip";
import { TbTableExport } from "react-icons/tb";

export default function ExportExcel({ data, selectedRowKeys }) {
  const exportToExcel = (selectedData) => {
    // please do not use delete item.key, it will delete the key in the original data
    const selectedDataWithoutKey = selectedData.map((item) => {
      const newItem = { ...item };
      delete newItem.key;
      return newItem;
    });

    const ws = XLSX.utils.json_to_sheet(selectedDataWithoutKey);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Staff Directory");
    XLSX.writeFile(wb, "Staff Directory.xlsx");
  };
  if (selectedRowKeys.length === 0) {
    return (
      // <CustomTooltip title="Export All Staff">
        <Button
          icon={<TbTableExport className="text-xl" />}
          type="text"
          onClick={() => {
            const newData = [...data];
            const selectedData = [];
            newData.forEach((item) => {
              selectedData.push(item);
            });

            // check if there is array in the data
            selectedData.forEach((item) => {
              Object.keys(item).forEach((key) => {
                if (Array.isArray(item[key])) {
                  item[key] = item[key].join(", ");
                }
              });
            });
            exportToExcel(selectedData);
          }}
        />
      // </CustomTooltip>
    );
  }

  return (
    // <CustomTooltip title="Export Selected Staff">
      <Button
        icon={<TbTableExport className="text-xl" />}
        type="text"
        onClick={() => {
          const newData = [...data];
          const selectedData = [];
          newData.forEach((item) => {
            if (selectedRowKeys.includes(item.key)) {
              selectedData.push(item);
            }
          });

          // check if there is array in the data
          selectedData.forEach((item) => {
            Object.keys(item).forEach((key) => {
              if (Array.isArray(item[key])) {
                item[key] = item[key].join(", ");
              }
            });
          });
          exportToExcel(selectedData);
        }}
      />
    // </CustomTooltip>
  );
}
