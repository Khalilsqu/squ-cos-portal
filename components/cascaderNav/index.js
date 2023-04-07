import { useEffect, useState } from "react";
import { useWindowSize } from "../utils/windowSize";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { Button, Cascader, Space, Typography } from "antd";
import { useSession } from "next-auth/react";
import useSWR from "swr";

const fetcher = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export default function CascaderNav({ setBreakPoint, showAdminPanel }) {
  const [cascaderOpen, setCascaderOpen] = useState(false);
  const [cascaderValue, setCascaderValue] = useState([]);
  const { width } = useWindowSize();
  const router = useRouter();

  const { data: session, status } = useSession();

  const { data: adminUsers } = useSWR("api/dashboard/admins", fetcher, {
    refreshInterval: 0,
  });

  const adminEmails = adminUsers?.map((user) => user.email);

  const isAdmin = adminEmails?.includes(session?.user?.email);

  useEffect(() => {
    if (width < 576) {
      setBreakPoint(true);

      setCookie("isBreakPoint", "true", {
        maxAge: 60 * 60 * 24 * 90,
      }); // 90 days
    }
  }, [width]);

  const items = [
    {
      value: "staff",
      label: (
        <Space className="flex justify-between">
          <Typography.Text>Staff</Typography.Text>
          <Button
            icon={<AiOutlineUsergroupAdd />}
            size="small"
            shape="circle"
            onClick={() => {
              router.push("/staff");
              setCascaderOpen(false);
              setCascaderValue(["staff"]);
            }}
          />
        </Space>
      ),
      children: [
        {
          value: "faculty",
          label: "Faculty",
        },
        {
          value: "technician",
          label: "Technician",
        },
        {
          value: "adminstrator",
          label: "Adminstrator",
        },
      ],
    },
    {
      value: "students",
      label: (
        <Space className="flex justify-between">
          <Typography.Text>Students</Typography.Text>
          <Button
            icon={<AiOutlineUsergroupAdd />}
            size="small"
            shape="circle"
            onClick={() => {
              router.push("/students");
              setCascaderOpen(false);
              setCascaderValue(["students"]);
            }}
          />
        </Space>
      ),
      children: [
        {
          value: "undergraduate",
          label: "Undergraduate",
        },
        {
          value: "postgraduate",
          label: "Postgraduate",
        },
      ],
    },
    {
      value: "adminstrative",
      label: "Adminstrative",
    },
  ];

  const adminItems = [
    {
      value: "admin-dashboard",
      label: "Admin Dashboard",
      children: [
        {
          value: "admins",
          label: "Admins",
        },
        {
          value: "news",
          label: "News",
        },
        {
          value: "staff-directory",
          label: "Staff Directory",
        },
      ],
    },
  ];

  return (
    width < 576 && (
      <Cascader
        value={cascaderValue}
        open={cascaderOpen}
        options={!showAdminPanel ? items : isAdmin && adminItems}
        expandTrigger="hover"
        displayRender={(label) => {
          const routerPathName = router.pathname;
          // capatilize each path name
          const paths = routerPathName.split("/").slice(1);
          const pathsValues = paths.map((path) => {
            return path.charAt(0).toUpperCase() + path.slice(1);
          });

          return pathsValues.join(" / ");
        }}
        bordered={false}
        style={{ margin: "16px 0" }}
        placeholder="Navigation"
        onClear={() => {
          setCascaderValue([]);

          if (!showAdminPanel && isAdmin) {
            router.push("/");
          } else if (showAdminPanel && isAdmin) {
            router.push("/admin-dashboard");
          }
        }}
        onChange={(value) => {
          setCascaderValue(value);
          if (value !== undefined) {
            router.push("/" + value.join("/"));
          }
        }}
        onDropdownVisibleChange={(value) => {
          setCascaderOpen(value);
        }}
        size="middle"
        className="shadow-md rounded-xl w-full"
      />
    )
  );
}
