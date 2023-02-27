import { Typography } from "antd";

const CopyRight = (props) => {
  return (
    <div className="flex flex-col border-solid border border-blue-200 p-4 gap-4 rounded-2xl md:flex-row md:items-center">
      <Typography.Text className="flex text-start md:w-1/5">
        © {props.year} College of Sciences, Sultan Qaboos University | All
        Rights
      </Typography.Text>

      <Typography.Link
        className="text-start md:text-center md:w-3/5"
        href="https://www.squ.edu.om/science/"
        target={"_blank"}
      >
        SQU College of Science
      </Typography.Link>
      <Typography.Text className="flex text-start md:w-1/5 md:text-end">
        This site is not affiliated with Sultan Qaboos University, but Developed
        by DataBase Team in College of Sciences
      </Typography.Text>
    </div>
  );
};

export default CopyRight;
