import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Form, Table, Button, Space, notification } from "antd";
import { useState } from "react";
import moment from "moment/moment";
import { v4 as uuidv4 } from "uuid";
import useSWR from "swr";

import { AiOutlineInsertRowBelow } from "react-icons/ai";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import ModalData from "../../../components/admin-dashboard/news/addModalNews";
import { columnsData } from "../../../components/admin-dashboard/news/editTableData";

import { useWindowSize } from "@/components/utils/windowSize";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function News(props) {
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data, mutate, error, isLoading } = useSWR(
    "/api/dashboard/news/fetchNews",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnMount: true,
      refreshInterval: 0,
    }
  );

  const [editingRowKey, setEditingRowKey] = useState(null);

  const [uploadedUserImage, setUploadedUserImage] = useState(null);

  const [tablePage, setTablePage] = useState(1);
  const [tableSize, setTableSize] = useState(5);

  const [dataUploadedToDB, setDataUploadedToDB] = useState(false);

  const { width } = useWindowSize();

  const currentdate = new Date();

  const handleDelete = (key) => {
    setDataUploadedToDB(true);

    rowDeleteHandler({ key }).then((res) => {
      if (res.message === "Success") {
        notification.success({
          message: "News deleted successfully from the database",
          placement: "topRight",
          duration: 4,
        });
        setDataUploadedToDB(false);
      } else {
        notification.error({
          message: "Error deleting news from the database - please try again",
          placement: "topRight",
          duration: 4,
        });
      }
    });
    setUploadedUserImage(null);

    mutate(
      data.filter((item) => item.key !== key),
      false
    );
  };

  const handleEditFormFinish = (values) => {
    setDataUploadedToDB(true);

    values.expiryDate = moment(values.expiryDate).format("ddd, MMM Do YYYY");

    const newData = [...data];
    const index = newData.findIndex((item) => editingRowKey === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...values,
    });

    rowEditHandler({
      dataEditted: newData[index],
      image: uploadedUserImage,
    }).then((res) => {
      if (res.message === "Success") {
        notification.success({
          message: "News edited successfully in the database",
          placement: "topRight",
          duration: 4,
        });
        setDataUploadedToDB(false);
      } else {
        notification.error({
          message: "Error editing news in the database - please try again",
          placement: "topRight",
          duration: 4,
        });
        setTimeout(() => {
          setDataUploadedToDB(false);
        }, 45000);
      }
    });
    setEditingRowKey(null);
    setUploadedUserImage(null);

    mutate(newData, false);
  };

  const columns = columnsData({
    handleDelete,
    editingRowKey,
    setEditingRowKey,
    formEdit,
    handleEditFormFinish,
    setUploadedUserImage,
  });

  const handleAddFormFinish = async (values) => {
    setDataUploadedToDB(true);
    const dataAdded = {
      key: uuidv4(),
      title: values.title,
      description: values.description,
      datePosted: currentdate.toLocaleString(),
      image: values.image,
      expiryDate: values.expiryDate.format("ddd, MMM Do YYYY"),
    };

    rowDataHandler({ dataAdded, uploadedUserImage }).then((res) => {
      if (res.message === "Success") {
        notification.success({
          message: "News added successfully to the database",
          placement: "topRight",
          duration: 4,
        });
        setDataUploadedToDB(false);
      } else {
        notification.error({
          message: "Error adding news to the database - please try again",
          placement: "topRight",
          duration: 4,
        });
        setTimeout(() => {
          setDataUploadedToDB(false);
        }, 4500);
      }
    });

    setUploadedUserImage(null);

    /// mutate the date to update the table
    mutate([...data, dataAdded], false);
  };

  if (error)
    return (
      <div>
        <h1>Something went wrong {error.message}</h1>
        <p>Try refreshing the page</p>
      </div>
    );

  if (data !== undefined && data?.length > 0) {
    return (
      <Space className="w-full h-full justify-center items-center">
        <ModalData
          formAdd={formAdd}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          handleAddFormFinish={handleAddFormFinish}
          setUploadedUserImage={setUploadedUserImage}
        />
        <Table
          columns={columns}
          loading={isLoading || dataUploadedToDB}
          dataSource={data}
          pagination={{
            current: tablePage,
            pageSize: tableSize,
            onChange: (page, pageSize) => {
              setTablePage(page);
              setTableSize(pageSize);
            },
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "15", "20"],
            onShowSizeChange: (current, size) => {
              setTablePage(current);
              setTableSize(size);
            },
            total: data?.length,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            showQuickJumper: true,
            showLessItems: true,
            responsive: true,
            position: ["bottomCenter"],
            size: "small",
            itemRender: (current, type, originalElement) => {
              if (type === "prev") {
                return (
                  <a>
                    <LeftOutlined />
                  </a>
                );
              }
              if (type === "next") {
                return (
                  <a>
                    <RightOutlined />
                  </a>
                );
              }
              return originalElement;
            },
            showTitle: true,
            hideOnSinglePage: false,
          }}
          footer={() => {
            return (
              <Button
                type="primary"
                onClick={() => setIsModalVisible(true)}
                className="w-full flex justify-center items-center gap-4"
                icon={<AiOutlineInsertRowBelow />}
              >
                Add News
              </Button>
            );
          }}
          size="small"
          scroll={{ x: true }}
          tableLayout="auto"
          bordered
          style={{
            maxWidth: width > 768 ? "100%" : width > 500 ? "450px" : "280px",
          }}
          className="py-2 px-4"
        />
      </Space>
    );
  }
}

const rowDataHandler = async (data) => {
  const { dataAdded, uploadedUserImage } = data;
  const res = await fetch("/api/dashboard/news/addNews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dataAdded,
      uploadedUserImage,
    }),
  });
  return res.json();
};

const rowDeleteHandler = async (data) => {
  const { key } = data;
  const res = await fetch("/api/dashboard/news/deleteNews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key,
    }),
  });
  return res.json();
};

const rowEditHandler = async (data) => {
  const { dataEditted, image } = data;
  const res = await fetch("/api/dashboard/news/updateNews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image,
      dataEditted,
    }),
  });
  return res.json();
};

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const adminEmails = [
    "hooti@squ.edu.om",
    "hosni@squ.edu.om",
    "wasila@squ.edu.om",
    "alhasnie@squ.edu.om",
    "said.m@squ.edu.om",
    "a.albarwani1@squ.edu.om",
    "h.alshukaili@squ.edu.om",
  ];

  if (!session | !adminEmails.includes(session?.user.email)) {
    return {
      redirect: { destination: "/" },
    };
  }

  return {
    props: { session },
  };
}
