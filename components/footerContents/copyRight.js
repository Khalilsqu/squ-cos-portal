import { Typography } from "antd";

const CopyRight = (props) => {
  return (
    <div className="flex flex-col border-solid border border-blue-200 p-4 gap-4 rounded-2xl md:flex-row md:items-center">
      <Typography.Text className="hidden sm:flex text-start md:w-2/6">
        © {props.year} College of Sciences, Sultan Qaboos University | All
        Rights
      </Typography.Text>

      <Typography.Link
        className="text-center sm:text-start md:text-center md:w-2/6"
        href="https://www.squ.edu.om/science/"
        target={"_blank"}
      >
        SQU College of Science
      </Typography.Link>
      <Typography.Text className="hidden sm:flex text-start md:w-2/6 md:text-end">
        This site is not affiliated with Sultan Qaboos University, but Developed
        by the DataBase Team in College of Science
      </Typography.Text>
    </div>
  );
};

export default CopyRight;
