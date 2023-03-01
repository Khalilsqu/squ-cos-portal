import { Menu } from "antd";
import { useRouter } from "next/router";
import { RiAdminLine } from "react-icons/ri";
import { BsNewspaper } from "react-icons/bs";
import { getItem } from "./index";
import { CiViewList } from "react-icons/ci";

export function AdminMenu() {
  const router = useRouter();

  const items = [
    getItem(
      "Dashboard",
      "admin-dashboard",
      <CiViewList />,
      null,
      "Admin Dashboard"
    ),
    getItem("Admin Users", "admins", <RiAdminLine />, null, "Admin Users"),
    getItem("News", "news", <BsNewspaper />, null, "News"),
  ];

  const handleClick = (e) => {
    if (e.key === "admin-dashboard") {
      router.push("/" + e.key);
    } else router.push("/" + "admin-dashboard/" + e.key);
  };

  return <Menu mode="inline" items={items} onClick={handleClick} />;
}
