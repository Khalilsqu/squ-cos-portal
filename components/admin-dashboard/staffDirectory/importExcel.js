import { Upload, message, Button } from "antd";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";
import { AiOutlineUpload } from "react-icons/ai";

import CustomTooltip from "@/components/tooltip/customtooltip";

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export default function ImportExcel({
  data,
  setData,
  columns,
  departmentList,
  positionList,
  targetKeys,
}) {
  return (
    <Upload
      beforeUpload={(file) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (e) => {
          const bufferArray = e.target.result;
          const wb = XLSX.read(bufferArray, { type: "buffer" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const newData = XLSX.utils.sheet_to_json(ws);

          // proceed only if data is not empty
          if (newData.length === 0) {
            message.error("No data found in excel file");
            return;
          }
          // check columns of excel file and columns of table match
          const excelColumns = Object.keys(newData[0]);
          const tableColumns = columns.map((column) => column.title);
          if (!excelColumns.every((column) => tableColumns.includes(column))) {
            message.error(
              "Columns of excel file and the existing table do not match"
            );
            return;
          }
          // check if emails are valid in excel file and unique
          const emails = newData.map((item) => item.Email);

          if (emails.some((email) => !validateEmail(email))) {
            message.error("Emails in excel file are not valid");
            return;
          }

          // check if emails are not repeated in excel file and table
          const tableEmails = data.map((item) => item.Email);
          if (emails.some((email) => tableEmails.includes(email))) {
            message.error("Emails in excel file and table are not unique");
            return;
          }

          //split department and position into different tags
          newData.forEach((item) => {
            item.Department = item.Department.split(",");
            item.Position = item.Position.split(",");
          });

          // check department column values of each row are in department list

          if (
            newData.forEach((item) =>
              item.Department.some(
                (department) => !departmentList.includes(department)
              )
            )
          ) {
            message.error(
              "Departments in excel file are not in department list"
            );
            return;
          }

          // check position column values of each row are in position list

          if (
            newData.forEach((item) =>
              item.Position.some((position) => !positionList.includes(position))
            )
          ) {
            message.error("Positions in excel file are not in position list");
            return;
          }

          // set unqiue key for each row
          newData.forEach((item, index) => {
            item.key = uuidv4();
          });

          // append new data to existing data
          setData((prevData) => [...prevData, ...newData]);
        };
        return false;
      }}
      showUploadList={false}
    >
      <CustomTooltip title="Import Excel">
        <Button icon={<AiOutlineUpload className="text-xl" />} type="text" />
      </CustomTooltip>
    </Upload>
  );
}
